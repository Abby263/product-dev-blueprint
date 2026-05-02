"use client";

import { useId, useMemo } from "react";

type Direction = "LR" | "TD";

interface ParsedNode {
  id: string;
  label: string;
}

interface ParsedEdge {
  from: string;
  to: string;
  label?: string;
  dashed: boolean;
}

interface ParsedDiagram {
  direction: Direction;
  nodes: ParsedNode[];
  edges: ParsedEdge[];
}

interface PositionedNode extends ParsedNode {
  x: number;
  y: number;
}

const NODE_WIDTH = 220;
const NODE_HEIGHT = 74;
const PADDING = 28;
const H_GAP = 78;
const V_GAP = 34;

function normalizeDirection(value: string): Direction {
  return value === "TD" || value === "TB" ? "TD" : "LR";
}

function parseEndpoint(raw: string) {
  const text = raw.trim().replace(/;$/, "");
  const match = text.match(/^([A-Za-z][\w-]*)(?:\["([\s\S]*?)"\])?$/);
  if (!match) return null;
  return { id: match[1], label: match[2] || match[1] };
}

function parseMermaidFlowchart(chart: string): ParsedDiagram | null {
  const lines = chart
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const header = lines.find((line) => /^flowchart\s+/i.test(line));
  const directionMatch = header?.match(/^flowchart\s+(LR|RL|TD|TB|BT)/i);
  if (!directionMatch) return null;

  const direction = normalizeDirection(directionMatch[1].toUpperCase());
  const nodes = new Map<string, ParsedNode>();
  const edges: ParsedEdge[] = [];

  function upsert(endpoint: { id: string; label: string }) {
    const current = nodes.get(endpoint.id);
    if (!current || current.label === endpoint.id) {
      nodes.set(endpoint.id, endpoint);
    }
  }

  for (const line of lines) {
    if (/^flowchart\s+/i.test(line) || line.startsWith("%%")) continue;

    let left = "";
    let right = "";
    let label: string | undefined;
    let dashed = false;

    if (line.includes("-->")) {
      const parts = line.split("-->");
      left = parts[0];
      right = parts.slice(1).join("-->");
    } else {
      const dashedMatch = line.match(/-\.\s*([\s\S]*?)\s*\.->/);
      if (!dashedMatch) continue;
      const parts = line.split(dashedMatch[0]);
      left = parts[0];
      right = parts.slice(1).join(dashedMatch[0]);
      label = dashedMatch[1].trim() || undefined;
      dashed = true;
    }

    const from = parseEndpoint(left);
    const to = parseEndpoint(right);
    if (!from || !to) continue;

    upsert(from);
    upsert(to);
    edges.push({ from: from.id, to: to.id, label, dashed });
  }

  if (nodes.size === 0) return null;
  return { direction, nodes: Array.from(nodes.values()), edges };
}

function wrapLabel(label: string, maxChars = 25, maxLines = 3) {
  const words = label.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars) {
      current = next;
      continue;
    }
    if (current) lines.push(current);
    current = word;
    if (lines.length === maxLines - 1) break;
  }

  if (current && lines.length < maxLines) lines.push(current);
  const usedWords = lines.join(" ").split(/\s+/).filter(Boolean).length;
  if (usedWords < words.length && lines.length > 0) {
    lines[lines.length - 1] = `${lines[lines.length - 1].replace(/\.*$/, "")}...`;
  }
  return lines.length > 0 ? lines : [label];
}

function layoutDiagram(diagram: ParsedDiagram) {
  const depth = new Map<string, number>();
  const order = new Map<string, number>();
  diagram.nodes.forEach((node, index) => {
    depth.set(node.id, 0);
    order.set(node.id, index);
  });

  for (let i = 0; i < diagram.nodes.length; i += 1) {
    let changed = false;
    for (const edge of diagram.edges) {
      const fromDepth = depth.get(edge.from) ?? 0;
      const toDepth = depth.get(edge.to) ?? 0;
      if (toDepth <= fromDepth) {
        depth.set(edge.to, fromDepth + 1);
        changed = true;
      }
    }
    if (!changed) break;
  }

  const layers = new Map<number, ParsedNode[]>();
  for (const node of diagram.nodes) {
    const layer = depth.get(node.id) ?? 0;
    layers.set(layer, [...(layers.get(layer) || []), node]);
  }

  const orderedLayers = Array.from(layers.entries())
    .sort(([a], [b]) => a - b)
    .map(([, nodes]) => nodes.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0)));

  const maxLayerSize = Math.max(...orderedLayers.map((layer) => layer.length), 1);
  const positioned = new Map<string, PositionedNode>();

  if (diagram.direction === "LR") {
    const width = PADDING * 2 + orderedLayers.length * NODE_WIDTH + Math.max(0, orderedLayers.length - 1) * H_GAP;
    const height = PADDING * 2 + maxLayerSize * NODE_HEIGHT + Math.max(0, maxLayerSize - 1) * V_GAP;

    orderedLayers.forEach((layer, layerIndex) => {
      const layerHeight = layer.length * NODE_HEIGHT + Math.max(0, layer.length - 1) * V_GAP;
      const topOffset = PADDING + Math.max(0, (height - PADDING * 2 - layerHeight) / 2);
      layer.forEach((node, nodeIndex) => {
        positioned.set(node.id, {
          ...node,
          x: PADDING + layerIndex * (NODE_WIDTH + H_GAP),
          y: topOffset + nodeIndex * (NODE_HEIGHT + V_GAP),
        });
      });
    });

    return { width, height, nodes: positioned };
  }

  const width = PADDING * 2 + maxLayerSize * NODE_WIDTH + Math.max(0, maxLayerSize - 1) * H_GAP;
  const height = PADDING * 2 + orderedLayers.length * NODE_HEIGHT + Math.max(0, orderedLayers.length - 1) * V_GAP;

  orderedLayers.forEach((layer, layerIndex) => {
    const layerWidth = layer.length * NODE_WIDTH + Math.max(0, layer.length - 1) * H_GAP;
    const leftOffset = PADDING + Math.max(0, (width - PADDING * 2 - layerWidth) / 2);
    layer.forEach((node, nodeIndex) => {
      positioned.set(node.id, {
        ...node,
        x: leftOffset + nodeIndex * (NODE_WIDTH + H_GAP),
        y: PADDING + layerIndex * (NODE_HEIGHT + V_GAP),
      });
    });
  });

  return { width, height, nodes: positioned };
}

function edgePath(from: PositionedNode, to: PositionedNode, direction: Direction) {
  if (direction === "LR") {
    const startX = from.x + NODE_WIDTH;
    const startY = from.y + NODE_HEIGHT / 2;
    const endX = to.x;
    const endY = to.y + NODE_HEIGHT / 2;
    const handle = Math.max(36, (endX - startX) / 2);
    return `M ${startX} ${startY} C ${startX + handle} ${startY}, ${endX - handle} ${endY}, ${endX} ${endY}`;
  }

  const startX = from.x + NODE_WIDTH / 2;
  const startY = from.y + NODE_HEIGHT;
  const endX = to.x + NODE_WIDTH / 2;
  const endY = to.y;
  const handle = Math.max(30, (endY - startY) / 2);
  return `M ${startX} ${startY} C ${startX} ${startY + handle}, ${endX} ${endY - handle}, ${endX} ${endY}`;
}

export default function MermaidDiagram({ chart }: { chart: string }) {
  const markerId = useId().replace(/:/g, "");
  const diagram = useMemo(() => parseMermaidFlowchart(chart), [chart]);
  const layout = useMemo(() => (diagram ? layoutDiagram(diagram) : null), [diagram]);

  if (!diagram || !layout) {
    return (
      <div className="my-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-700/50 dark:bg-amber-900/20 dark:text-amber-100">
        <div className="font-medium">This Mermaid diagram uses syntax the built-in renderer does not support yet.</div>
        <pre className="mt-3 overflow-x-auto rounded-md bg-ink-900 p-3 text-ink-50">
          <code>{chart}</code>
        </pre>
      </div>
    );
  }

  return (
    <div className="my-5 max-w-full overflow-x-auto rounded-lg border border-ink-200 bg-white p-3 dark:border-ink-800 dark:bg-ink-950">
      <svg
        role="img"
        aria-label="Architecture diagram"
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        className="h-auto min-w-[720px] max-w-none"
        style={{ width: "100%" }}
      >
        <defs>
          <marker
            id={markerId}
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="5"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-ink-500 dark:fill-ink-300" />
          </marker>
        </defs>

        {diagram.edges.map((edge, index) => {
          const from = layout.nodes.get(edge.from);
          const to = layout.nodes.get(edge.to);
          if (!from || !to) return null;
          const labelX = (from.x + to.x + NODE_WIDTH) / 2;
          const labelY = (from.y + to.y + NODE_HEIGHT) / 2 - 8;
          return (
            <g key={`${edge.from}-${edge.to}-${index}`}>
              <path
                d={edgePath(from, to, diagram.direction)}
                fill="none"
                markerEnd={`url(#${markerId})`}
                strokeWidth="2"
                strokeDasharray={edge.dashed ? "7 6" : undefined}
                className="stroke-ink-400 dark:stroke-ink-500"
              />
              {edge.label && (
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  className="fill-ink-500 text-[11px] font-medium dark:fill-ink-300"
                >
                  {edge.label}
                </text>
              )}
            </g>
          );
        })}

        {Array.from(layout.nodes.values()).map((node) => {
          const lines = wrapLabel(node.label);
          const firstLineY = node.y + NODE_HEIGHT / 2 - (lines.length - 1) * 8;
          return (
            <g key={node.id}>
              <rect
                x={node.x}
                y={node.y}
                width={NODE_WIDTH}
                height={NODE_HEIGHT}
                rx="8"
                className="fill-ink-50 stroke-ink-300 dark:fill-ink-900 dark:stroke-ink-700"
                strokeWidth="1.5"
              />
              {lines.map((line, index) => (
                <text
                  key={`${node.id}-${index}`}
                  x={node.x + NODE_WIDTH / 2}
                  y={firstLineY + index * 17}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-ink-800 text-[13px] font-medium dark:fill-ink-100"
                >
                  {line}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
