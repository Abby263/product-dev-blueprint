// Generates a minimal boilerplate scaffold for the bundle: a folder
// structure overview, starter README, and docker-compose stub matching
// the platform stack the user picked. Files are stubs — meant as a
// hand-off to a coding agent or human, not a working application.

import type { Project } from "./schema";

export interface ScaffoldFile {
  path: string;       // path inside the scaffold/ folder of the bundle
  content: string;
}

function s(s: string): string {
  return (s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "app";
}

function pickFrontend(p: Project): { name: string; tree: string[]; files: ScaffoldFile[] } {
  switch (p.platform.frontend) {
    case "nextjs":
      return {
        name: "Next.js",
        tree: ["src/app/", "src/app/(routes)/", "src/components/", "src/lib/", "src/styles/", "public/"],
        files: [
          {
            path: "frontend/package.json.stub",
            content: JSON.stringify(
              {
                name: `${s(p.name)}-web`,
                private: true,
                scripts: { dev: "next dev", build: "next build", start: "next start", typecheck: "tsc --noEmit" },
                dependencies: { next: "^14", react: "^18", "react-dom": "^18" },
                devDependencies: { typescript: "^5", "@types/react": "^18", "@types/node": "^22", tailwindcss: "^3" },
              },
              null,
              2,
            ),
          },
        ],
      };
    case "react":
      return {
        name: "React (Vite)",
        tree: ["src/components/", "src/pages/", "src/hooks/", "src/lib/", "public/"],
        files: [],
      };
    case "vue":
      return {
        name: "Vue 3",
        tree: ["src/components/", "src/views/", "src/router/", "src/store/", "src/composables/"],
        files: [],
      };
    case "angular":
      return {
        name: "Angular",
        tree: ["src/app/", "src/app/components/", "src/app/services/", "src/assets/"],
        files: [],
      };
    case "svelte":
      return {
        name: "SvelteKit",
        tree: ["src/routes/", "src/lib/", "src/lib/components/", "static/"],
        files: [],
      };
    default:
      return { name: p.platform.frontend, tree: ["src/"], files: [] };
  }
}

function pickBackend(p: Project): { name: string; tree: string[]; files: ScaffoldFile[] } {
  switch (p.platform.backend) {
    case "fastapi":
      return {
        name: "Python FastAPI",
        tree: ["app/", "app/routers/", "app/models/", "app/services/", "app/db/", "tests/"],
        files: [
          {
            path: "backend/pyproject.toml.stub",
            content:
              `[project]\n` +
              `name = "${s(p.name)}-api"\n` +
              `version = "0.1.0"\n` +
              `requires-python = ">=3.11"\n` +
              `dependencies = [\n` +
              `  "fastapi",\n  "uvicorn[standard]",\n  "pydantic",\n  "sqlalchemy",\n  "alembic",\n` +
              (p.platform.database === "postgres" ? `  "psycopg[binary]",\n` : "") +
              (p.platform.caching ? `  "redis",\n` : "") +
              `]\n`,
          },
          {
            path: "backend/app/main.py.stub",
            content:
              `from fastapi import FastAPI\n\n` +
              `app = FastAPI(title="${p.name}")\n\n` +
              `@app.get("/healthz")\n` +
              `def healthz():\n    return {"status": "ok"}\n`,
          },
        ],
      };
    case "django":
      return {
        name: "Python Django",
        tree: ["config/", `apps/${s(p.name)}/`, `apps/${s(p.name)}/models/`, `apps/${s(p.name)}/views/`, "tests/"],
        files: [],
      };
    case "express":
      return {
        name: "Node.js Express",
        tree: ["src/routes/", "src/controllers/", "src/services/", "src/models/", "tests/"],
        files: [],
      };
    case "nestjs":
      return {
        name: "NestJS",
        tree: ["src/modules/", "src/common/", "src/config/", "test/"],
        files: [],
      };
    case "spring":
      return {
        name: "Java Spring Boot",
        tree: ["src/main/java/", "src/main/resources/", "src/test/java/"],
        files: [],
      };
    case "dotnet":
      return {
        name: ".NET Core",
        tree: ["src/Api/", "src/Application/", "src/Domain/", "src/Infrastructure/", "tests/"],
        files: [],
      };
    case "go":
      return {
        name: "Go",
        tree: ["cmd/api/", "internal/handlers/", "internal/services/", "internal/store/", "pkg/"],
        files: [],
      };
    case "rails":
      return {
        name: "Ruby on Rails",
        tree: ["app/controllers/", "app/models/", "app/services/", "config/", "db/migrate/"],
        files: [],
      };
    default:
      return { name: p.platform.backend, tree: ["src/"], files: [] };
  }
}

function dockerComposeStub(p: Project): string | null {
  const services: string[] = [];
  if (p.platform.database === "postgres") {
    services.push(
      `  db:\n    image: postgres:16-alpine\n    environment:\n      POSTGRES_DB: ${s(p.name)}\n      POSTGRES_USER: app\n      POSTGRES_PASSWORD: changeme\n    ports: ["5432:5432"]\n    volumes: [pgdata:/var/lib/postgresql/data]`,
    );
  } else if (p.platform.database === "mysql") {
    services.push(
      `  db:\n    image: mysql:8\n    environment:\n      MYSQL_DATABASE: ${s(p.name)}\n      MYSQL_USER: app\n      MYSQL_PASSWORD: changeme\n      MYSQL_ROOT_PASSWORD: rootpw\n    ports: ["3306:3306"]\n    volumes: [mysqldata:/var/lib/mysql]`,
    );
  } else if (p.platform.database === "mongodb") {
    services.push(
      `  db:\n    image: mongo:7\n    ports: ["27017:27017"]\n    volumes: [mongodata:/data/db]`,
    );
  }
  if (p.platform.caching || p.platform.database === "redis" || p.platform.realtimeNeeded) {
    services.push(
      `  redis:\n    image: redis:7-alpine\n    ports: ["6379:6379"]`,
    );
  }
  if (p.platform.searchNeeded || p.platform.database === "elasticsearch") {
    services.push(
      `  search:\n    image: docker.elastic.co/elasticsearch/elasticsearch:8.13.0\n    environment:\n      discovery.type: single-node\n      xpack.security.enabled: "false"\n    ports: ["9200:9200"]`,
    );
  }
  if (services.length === 0) return null;

  const volumes: string[] = [];
  if (p.platform.database === "postgres") volumes.push("  pgdata:");
  if (p.platform.database === "mysql") volumes.push("  mysqldata:");
  if (p.platform.database === "mongodb") volumes.push("  mongodata:");

  return [
    `# Local dev infrastructure for ${p.name}`,
    `# Generated by Product Dev Blueprint — adjust before use.`,
    ``,
    `services:`,
    services.join("\n\n"),
    ``,
    volumes.length > 0 ? `volumes:\n${volumes.join("\n")}` : "",
    ``,
  ].join("\n");
}

function envExample(p: Project): string {
  const lines = [
    `# ${p.name} — environment variables`,
    `# Generated by Product Dev Blueprint`,
    ``,
    `# --- Application ---`,
    `APP_NAME=${s(p.name)}`,
    `NODE_ENV=development`,
    ``,
    `# --- Auth ---`,
    `AUTH_METHOD=${p.platform.authMethod}`,
  ];
  if (p.platform.authMethod === "oidc") {
    lines.push(`OIDC_ISSUER_URL=`, `OIDC_CLIENT_ID=`, `OIDC_CLIENT_SECRET=`);
  } else if (p.platform.authMethod === "jwt") {
    lines.push(`JWT_SECRET=changeme-please`);
  }
  lines.push(``, `# --- Database ---`);
  if (p.platform.database === "postgres") {
    lines.push(`DATABASE_URL=postgresql://app:changeme@localhost:5432/${s(p.name)}`);
  } else if (p.platform.database === "mysql") {
    lines.push(`DATABASE_URL=mysql://app:changeme@localhost:3306/${s(p.name)}`);
  } else if (p.platform.database === "mongodb") {
    lines.push(`MONGODB_URI=mongodb://localhost:27017/${s(p.name)}`);
  }
  if (p.platform.caching || p.platform.database === "redis") {
    lines.push(`REDIS_URL=redis://localhost:6379`);
  }
  if (p.ai.needsAI) {
    lines.push(``, `# --- AI ---`);
    if (p.ai.modelProvider === "openai" || p.ai.modelProvider === "azure-openai") lines.push(`OPENAI_API_KEY=`);
    if (p.ai.modelProvider === "anthropic") lines.push(`ANTHROPIC_API_KEY=`);
  }
  return lines.join("\n");
}

function readme(p: Project, frontend: ReturnType<typeof pickFrontend>, backend: ReturnType<typeof pickBackend>): string {
  return [
    `# ${p.name || "Untitled project"} — scaffold`,
    ``,
    p.oneLiner ? `> ${p.oneLiner}` : "",
    ``,
    `Generated by **Product Dev Blueprint**. This scaffold is a starting point — read the bundle's PRD, technical design, and ADR pack first; then expand each stub.`,
    ``,
    `## Stack`,
    ``,
    `- **Frontend:** ${frontend.name}${p.platform.uiFramework ? ` + ${p.platform.uiFramework}` : ""}`,
    `- **Backend:** ${backend.name} (${p.platform.apiStyle})`,
    `- **Database:** ${p.platform.database}${p.platform.caching ? " + Redis cache" : ""}`,
    `- **Auth:** ${p.platform.authMethod}${p.platform.rbacRequired ? " + RBAC" : ""}`,
    `- **Cloud:** ${p.platform.cloud}`,
    `- **CI/CD:** ${p.platform.cicd || "TBD"}`,
    ``,
    `## Quick start`,
    ``,
    `\`\`\`bash`,
    `# 1. Bring up local infrastructure`,
    `docker compose up -d`,
    ``,
    `# 2. Configure environment`,
    `cp .env.example .env   # then edit`,
    ``,
    `# 3. Install dependencies`,
    p.platform.frontend === "nextjs" ? `cd frontend && npm install && npm run dev` : `cd frontend && npm install`,
    p.platform.backend === "fastapi"
      ? `cd backend && python -m venv .venv && source .venv/bin/activate && pip install -e . && uvicorn app.main:app --reload`
      : `cd backend && # install per stack`,
    `\`\`\``,
    ``,
    `## Suggested folder structure`,
    ``,
    `\`\`\``,
    `frontend/`,
    ...frontend.tree.map((t) => `  ${t}`),
    `backend/`,
    ...backend.tree.map((t) => `  ${t}`),
    `infra/`,
    `  docker-compose.yml`,
    `tests/`,
    `\`\`\``,
    ``,
    `## Next steps`,
    ``,
    `1. Open \`17-coding-agent-prompts.md\` from the bundle root and feed each prompt to your coding agent (Cursor / Lovable / Replit).`,
    `2. The agent should use the IDs in the bundle (FR-/NFR-/FEAT-/ADR-/RISK-) when referencing what it builds.`,
    `3. Keep this README and the scaffold tree in sync as the architecture evolves.`,
    ``,
    `> The \`.stub\` files in this folder are intentionally minimal — they are a starting shape, not a working app.`,
  ].join("\n");
}

function gitignore(): string {
  return [
    "node_modules/",
    ".next/",
    "dist/",
    "build/",
    ".venv/",
    "__pycache__/",
    "*.pyc",
    ".env",
    ".env.local",
    ".env.*.local",
    ".DS_Store",
    "coverage/",
    ".pytest_cache/",
    "*.log",
  ].join("\n");
}

export function generateScaffold(p: Project): ScaffoldFile[] {
  const fe = pickFrontend(p);
  const be = pickBackend(p);
  const files: ScaffoldFile[] = [
    { path: "README.md", content: readme(p, fe, be) },
    { path: ".env.example", content: envExample(p) },
    { path: ".gitignore", content: gitignore() },
    ...fe.files,
    ...be.files,
  ];

  const dc = dockerComposeStub(p);
  if (dc) files.push({ path: "infra/docker-compose.yml", content: dc });

  // CI workflow stub
  files.push({
    path: ".github/workflows/ci.yml.stub",
    content: [
      `name: CI`,
      ``,
      `on:`,
      `  pull_request:`,
      `  push:`,
      `    branches: [main]`,
      ``,
      `jobs:`,
      `  verify:`,
      `    runs-on: ubuntu-latest`,
      `    steps:`,
      `      - uses: actions/checkout@v4`,
      `      - uses: actions/setup-node@v4`,
      `        with: { node-version: 20 }`,
      `      - run: echo "TODO: install + lint + test + build"`,
    ].join("\n"),
  });

  return files;
}
