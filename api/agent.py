from __future__ import annotations

import json
import sys
from http.server import BaseHTTPRequestHandler
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from ai_agents.blueprint_agent.blueprint_agent import run_blueprint_agent
from ai_agents.blueprint_agent.schema_contract import AgentConfigurationError, AgentOutputError


class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self._send_common_headers()
        self.end_headers()

    def do_GET(self) -> None:
        self._send_json(
            200,
            {
                "ok": True,
                "runtime": "python-deepagents",
                "message": "POST a project, mode, prompt, and optional focusStep to generate an LLM-backed blueprint proposal.",
            },
        )

    def do_POST(self) -> None:
        try:
            payload = self._read_json()
            result = run_blueprint_agent(payload)
            self._send_json(200, result)
        except AgentConfigurationError as exc:
            self._send_json(
                503,
                {
                    "ok": False,
                    "error": "AI_AGENT_NOT_CONFIGURED",
                    "message": str(exc),
                },
            )
        except AgentOutputError as exc:
            self._send_json(
                422,
                {
                    "ok": False,
                    "error": "AI_AGENT_OUTPUT_INVALID",
                    "message": str(exc),
                },
            )
        except json.JSONDecodeError:
            self._send_json(
                400,
                {
                    "ok": False,
                    "error": "INVALID_JSON",
                    "message": "Request body must be valid JSON.",
                },
            )
        except Exception as exc:
            self._send_json(
                500,
                {
                    "ok": False,
                    "error": "AI_AGENT_RUNTIME_ERROR",
                    "message": str(exc),
                },
            )

    def _read_json(self) -> dict[str, Any]:
        length = int(self.headers.get("content-length", "0"))
        if length <= 0:
            return {}
        if length > 2_000_000:
            raise AgentOutputError("Request body is too large for the synchronous agent endpoint.")
        raw = self.rfile.read(length).decode("utf-8")
        data = json.loads(raw)
        if not isinstance(data, dict):
            raise AgentOutputError("Request body must be a JSON object.")
        return data

    def _send_json(self, status: int, body: dict[str, Any]) -> None:
        encoded = json.dumps(body).encode("utf-8")
        self.send_response(status)
        self._send_common_headers()
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(encoded)))
        self.end_headers()
        self.wfile.write(encoded)

    def _send_common_headers(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
