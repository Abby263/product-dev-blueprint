from __future__ import annotations

import copy
import json
from typing import Any


class AgentConfigurationError(RuntimeError):
    """Raised when the LLM agent runtime is not configured."""


class AgentOutputError(RuntimeError):
    """Raised when the LLM response cannot be converted into a proposal."""


DOMAIN_FROM_PATH: list[tuple[str, str]] = [
    ("problem.", "problem"),
    ("market.", "market"),
    ("experience.", "experience"),
    ("platform.", "platform"),
    ("functional.features", "features"),
    ("functional.", "functional"),
    ("nonfunctional.", "nonfunctional"),
    ("systemDesign.", "systemDesign"),
    ("dataTech.", "dataTech"),
    ("ai.", "ai"),
    ("compliance.", "compliance"),
    ("gtm.", "gtm"),
    ("governance.", "governance"),
    ("stakeholders", "basics"),
    ("decisions", "governance"),
    ("risks", "governance"),
    ("assumptions", "governance"),
    ("openQuestions", "governance"),
]

ALLOWED_TOP_LEVEL = {
    "name",
    "oneLiner",
    "ideaDescription",
    "stakeholders",
    "decisions",
    "risks",
    "assumptions",
    "openQuestions",
}

ALLOWED_NESTED_ROOTS = {
    "problem",
    "market",
    "experience",
    "platform",
    "functional",
    "nonfunctional",
    "systemDesign",
    "dataTech",
    "ai",
    "compliance",
    "gtm",
    "governance",
}

BLOCKED_PATHS = {
    "id",
    "listed",
    "createdAt",
    "updatedAt",
    "progress",
}

DEFAULT_VALUES: dict[str, Any] = {
    "name": "Untitled project",
    "platform.cloud": "vercel",
    "platform.backend": "fastapi",
    "platform.database": "postgres",
    "platform.uiFramework": "shadcn/ui",
    "platform.stateMgmt": "Zustand",
    "platform.envStrategy": "dev / stage / prod",
    "systemDesign.architecturePattern": "modular-monolith",
    "systemDesign.authArchitecture": "managed-oidc",
    "systemDesign.deploymentTopology": "single-region",
    "ai.agentFramework": "none",
    "ai.modelProvider": "tbd",
    "ai.observability": "none",
    "ai.vectorDb": "none",
    "market.vertical": "other",
}


def create_proposal(
    *,
    project: dict[str, Any],
    draft: dict[str, Any],
    mode: str,
    focus_step: str | None,
    user_prompt: str,
    model: str,
) -> dict[str, Any]:
    """Validate an LLM draft and convert it into the frontend proposal shape."""

    raw_changes = draft.get("changes")
    if not isinstance(raw_changes, list):
        raise AgentOutputError("LLM response must include a changes array.")

    raw_patch: dict[str, Any] = {}
    changes: list[dict[str, str]] = []
    touched_domains: set[str] = set()
    allow_existing_updates = bool(user_prompt.strip()) or mode in {"product", "architecture", "review"}

    for raw in raw_changes:
        if not isinstance(raw, dict):
            continue

        path = str(raw.get("path") or "").strip()
        if not path or not is_allowed_path(path) or not is_allowed_for_mode(path, mode, focus_step):
            continue

        next_value = raw.get("next")
        previous = get_path(project, path)
        if same_value(previous, next_value):
            continue

        if not allow_existing_updates and not is_blank(previous) and not is_default_value(path, previous):
            continue

        reason = str(raw.get("reason") or "LLM agent recommendation.").strip()
        set_path(raw_patch, path, next_value)
        touched_domains.add(domain_from_path(path))
        changes.append(
            {
                "path": path,
                "previous": format_value(previous),
                "next": format_value(next_value),
                "reason": reason,
            }
        )

    summary = as_string(draft.get("summary")) or "LLM agent drafted a schema proposal from the current project context."
    confidence = as_confidence(draft.get("confidence"))
    follow_up_questions = as_string_list(draft.get("followUpQuestions") or draft.get("follow_up_questions"))
    assumptions = as_string_list(draft.get("assumptions"))

    return {
        "title": mode_title(mode),
        "summary": f"{summary} Model: {model}.",
        "mode": mode,
        "confidence": confidence,
        "followUpQuestions": follow_up_questions[:8],
        "assumptions": assumptions[:12],
        "changes": changes,
        "touchedDomains": sorted(touched_domains, key=domain_sort_key),
        "patch": expand_project_patch(project, raw_patch),
    }


def is_allowed_path(path: str) -> bool:
    if path in BLOCKED_PATHS or path.startswith("progress."):
        return False
    if path in ALLOWED_TOP_LEVEL:
        return True
    root = path.split(".", 1)[0]
    return root in ALLOWED_NESTED_ROOTS and "." in path


def is_allowed_for_mode(path: str, mode: str, focus_step: str | None) -> bool:
    domain = domain_from_path(path)
    if focus_step and mode != "complete-missing":
        return domain == focus_step or domain == "governance"
    if mode == "product":
        return domain in {"basics", "problem", "market", "experience", "functional", "features", "gtm", "governance"}
    if mode == "architecture":
        return domain in {"platform", "nonfunctional", "systemDesign", "dataTech", "ai", "compliance", "governance"}
    return True


def domain_from_path(path: str) -> str:
    if path in {"name", "oneLiner", "ideaDescription"}:
        return "basics"
    for prefix, domain in DOMAIN_FROM_PATH:
        if path == prefix or path.startswith(prefix):
            return domain
    return "basics"


def get_path(source: dict[str, Any], path: str) -> Any:
    cursor: Any = source
    for part in path.split("."):
        if isinstance(cursor, dict):
            cursor = cursor.get(part)
        else:
            return None
    return cursor


def set_path(target: dict[str, Any], path: str, value: Any) -> None:
    parts = path.split(".")
    cursor = target
    for index, part in enumerate(parts):
        if index == len(parts) - 1:
            cursor[part] = value
            return
        next_cursor = cursor.get(part)
        if not isinstance(next_cursor, dict):
            next_cursor = {}
            cursor[part] = next_cursor
        cursor = next_cursor


def expand_project_patch(project: dict[str, Any], patch: dict[str, Any]) -> dict[str, Any]:
    expanded: dict[str, Any] = {}
    for key, value in patch.items():
        current = project.get(key)
        if isinstance(current, dict) and isinstance(value, dict):
            expanded[key] = deep_merge(current, value)
        else:
            expanded[key] = value
    return expanded


def deep_merge(base: dict[str, Any], patch: dict[str, Any]) -> dict[str, Any]:
    merged = copy.deepcopy(base)
    for key, value in patch.items():
        if isinstance(merged.get(key), dict) and isinstance(value, dict):
            merged[key] = deep_merge(merged[key], value)
        else:
            merged[key] = value
    return merged


def is_blank(value: Any) -> bool:
    if value is None:
        return True
    if isinstance(value, str):
        return value.strip() == ""
    if isinstance(value, list):
        return len(value) == 0
    if isinstance(value, (int, float)):
        return value == 0
    return False


def is_default_value(path: str, value: Any) -> bool:
    return DEFAULT_VALUES.get(path) == value


def same_value(first: Any, second: Any) -> bool:
    return json.dumps(first, sort_keys=True, default=str) == json.dumps(second, sort_keys=True, default=str)


def format_value(value: Any) -> str:
    if is_blank(value):
        return "Empty"
    if isinstance(value, bool):
        return "Yes" if value else "No"
    if isinstance(value, list):
        if not value:
            return "Empty"
        if all(isinstance(item, str) for item in value):
            return ", ".join(value[:8])
        return f"{len(value)} structured item{'s' if len(value) != 1 else ''}"
    if isinstance(value, dict):
        return "Existing structured value"
    text = str(value)
    return text if len(text) <= 240 else f"{text[:237]}..."


def mode_title(mode: str) -> str:
    if mode == "product":
        return "LLM product manager draft"
    if mode == "architecture":
        return "LLM solution architect draft"
    if mode == "review":
        return "LLM readiness review"
    return "LLM complete blueprint draft"


def as_string(value: Any) -> str:
    return value.strip() if isinstance(value, str) else ""


def as_string_list(value: Any) -> list[str]:
    if not isinstance(value, list):
        return []
    return [str(item).strip() for item in value if str(item).strip()]


def as_confidence(value: Any) -> str:
    text = str(value or "").lower().strip()
    return text if text in {"low", "medium", "high"} else "low"


def domain_sort_key(domain: str) -> int:
    order = [
        "basics",
        "problem",
        "market",
        "experience",
        "platform",
        "functional",
        "features",
        "nonfunctional",
        "systemDesign",
        "dataTech",
        "ai",
        "compliance",
        "gtm",
        "governance",
    ]
    return order.index(domain) if domain in order else len(order)
