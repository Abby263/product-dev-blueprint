from __future__ import annotations

import json
import os
import re
from functools import lru_cache
from pathlib import Path
from typing import Any

from .schema_contract import AgentConfigurationError, AgentOutputError, create_proposal


AGENT_ROOT = Path(__file__).resolve().parent

SYSTEM_PROMPT = """You are the Product Dev Blueprint DeepAgents runtime.

You must produce a structured schema proposal for the current Project object.
Use the loaded AGENTS.md memory, skills, and subagents when useful.

Important rules:
- Return only JSON. No markdown fences. No commentary outside JSON.
- Do not change id, createdAt, updatedAt, listed, or progress.
- Prefer schema paths over prose sections.
- Include Product Manager and Technical Solution Architect coverage.
- Include HLD, LLD, schema design, OAuth/OIDC/RBAC, security, compliance, data, APIs, infrastructure, scale, AI/RAG/agent design, risks, assumptions, and follow-up questions when relevant.
- Existing deterministic generators will render the final artifact files after the user applies the proposal.
"""


def run_blueprint_agent(payload: dict[str, Any]) -> dict[str, Any]:
    project = payload.get("project")
    if not isinstance(project, dict):
        raise AgentOutputError("Request must include a project object.")

    mode = str(payload.get("mode") or "complete-missing")
    if mode not in {"complete-missing", "product", "architecture", "review"}:
        mode = "complete-missing"

    prompt = str(payload.get("prompt") or "")
    focus_step = payload.get("focusStep")
    focus_step = str(focus_step) if focus_step else None
    thread_id = str(payload.get("threadId") or project.get("id") or "blueprint-agent")
    model = configured_model()

    agent = create_agent(model)
    result = agent.invoke(
        {
            "messages": [{"role": "user", "content": build_task(project, mode, focus_step, prompt)}],
            "files": load_agent_files(),
        },
        config={"configurable": {"thread_id": thread_id}},
    )

    draft = parse_agent_result(result)
    proposal = create_proposal(
        project=project,
        draft=draft,
        mode=mode,
        focus_step=focus_step,
        user_prompt=prompt,
        model=model,
    )

    return {
        "ok": True,
        "source": "deepagents",
        "proposal": proposal,
        "run": {
            "model": model,
            "threadId": thread_id,
        },
    }


def configured_model() -> str:
    model = os.environ.get("AI_AGENT_MODEL", "").strip()
    if not model:
        raise AgentConfigurationError(
            "AI_AGENT_MODEL is required. Example values: openai:gpt-4o-mini, anthropic:claude-sonnet-4-5, google_genai:gemini-2.5-pro."
        )

    provider = model.split(":", 1)[0].lower()
    required_by_provider = {
        "openai": ["OPENAI_API_KEY"],
        "anthropic": ["ANTHROPIC_API_KEY"],
        "google_genai": ["GOOGLE_API_KEY"],
        "google_vertexai": ["GOOGLE_APPLICATION_CREDENTIALS"],
        "azure_openai": ["AZURE_OPENAI_API_KEY", "AZURE_OPENAI_ENDPOINT"],
    }

    missing = [name for name in required_by_provider.get(provider, []) if not os.environ.get(name)]
    if missing:
        raise AgentConfigurationError(f"Missing server environment variable(s): {', '.join(missing)}.")

    return model


@lru_cache(maxsize=8)
def create_agent(model: str) -> Any:
    from deepagents import create_deep_agent

    return create_deep_agent(
        model=model,
        system_prompt=SYSTEM_PROMPT,
        memory=["/AGENTS.md"],
        skills=["/skills/"],
        subagents=load_subagents(),
    )


def load_subagents() -> list[dict[str, Any]]:
    import yaml

    path = AGENT_ROOT / "subagents.yaml"
    data = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
    subagents: list[dict[str, Any]] = []

    for name, config in data.items():
        if not isinstance(config, dict):
            continue
        system_prompt = str(config.get("system_prompt") or "").strip()
        description = str(config.get("description") or "").strip()
        if not name or not system_prompt or not description:
            continue
        subagents.append(
            {
                "name": str(name),
                "description": description,
                "system_prompt": system_prompt,
            }
        )
        skills = config.get("skills")
        if isinstance(skills, list):
            subagents[-1]["skills"] = [str(skill) for skill in skills if str(skill).strip()]

    return subagents


def load_agent_files() -> dict[str, str]:
    files: dict[str, str] = {
        "/AGENTS.md": (AGENT_ROOT / "AGENTS.md").read_text(encoding="utf-8"),
    }

    for skill_path in (AGENT_ROOT / "skills").glob("*/SKILL.md"):
        virtual_path = f"/skills/{skill_path.parent.name}/SKILL.md"
        files[virtual_path] = skill_path.read_text(encoding="utf-8")

    return files


def build_task(project: dict[str, Any], mode: str, focus_step: str | None, prompt: str) -> str:
    project_json = json.dumps(project, ensure_ascii=False, sort_keys=True)
    focus_text = focus_step or "none"
    user_prompt = prompt.strip() or "No extra user instruction. Complete missing fields from current project context."

    return f"""
Create a Product Dev Blueprint schema proposal.

Mode: {mode}
Focus step: {focus_text}
User instruction: {user_prompt}

Current Project JSON:
{project_json}

Return only JSON matching the contract in AGENTS.md.
For each change, use canonical Project schema paths and include the proposed next value.
Use arrays of structured objects for schema paths that require arrays, such as functional.features, functional.requirements, dataTech.entities, dataTech.integrations, risks, decisions, assumptions, and openQuestions.
"""


def parse_agent_result(result: dict[str, Any]) -> dict[str, Any]:
    structured = result.get("structured_response") if isinstance(result, dict) else None
    if isinstance(structured, dict):
        return structured

    text = extract_final_text(result)
    if not text:
        raise AgentOutputError("LLM agent returned no parseable content.")

    try:
        parsed = json.loads(text)
    except json.JSONDecodeError:
        parsed = json.loads(extract_json_object(text))

    if not isinstance(parsed, dict):
        raise AgentOutputError("LLM agent response must be a JSON object.")
    return parsed


def extract_final_text(result: dict[str, Any]) -> str:
    messages = result.get("messages") if isinstance(result, dict) else None
    if not isinstance(messages, list):
        return ""

    for message in reversed(messages):
        content = message.get("content") if isinstance(message, dict) else getattr(message, "content", None)
        text = content_to_text(content)
        if text:
            return strip_json_fence(text)
    return ""


def content_to_text(content: Any) -> str:
    if isinstance(content, str):
        return content.strip()
    if isinstance(content, list):
        parts: list[str] = []
        for item in content:
            if isinstance(item, dict):
                text = item.get("text") or item.get("content")
                if isinstance(text, str):
                    parts.append(text)
            elif isinstance(item, str):
                parts.append(item)
        return "\n".join(parts).strip()
    return ""


def strip_json_fence(text: str) -> str:
    stripped = text.strip()
    match = re.search(r"```(?:json)?\s*(.*?)\s*```", stripped, flags=re.DOTALL | re.IGNORECASE)
    return match.group(1).strip() if match else stripped


def extract_json_object(text: str) -> str:
    stripped = strip_json_fence(text)
    start = stripped.find("{")
    end = stripped.rfind("}")
    if start == -1 or end == -1 or end <= start:
        raise AgentOutputError("LLM agent response did not contain a JSON object.")
    return stripped[start : end + 1]
