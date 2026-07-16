"use client";

import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { Check, Sparkles, Lock } from "lucide-react";
import type { RoadmapNodeData } from "@/lib/roadmap";
import { BRANCH_COLOR } from "@/lib/roadmap";

export type RoadmapFlowNode = Node<
  RoadmapNodeData & { onOpen: (node: RoadmapNodeData) => void },
  "roadmapNode"
>;

const STATUS_ICON = {
  done: Check,
  current: Sparkles,
  upcoming: Lock,
};

export function RoadmapNode({ data }: NodeProps<RoadmapFlowNode>) {
  const color = BRANCH_COLOR[data.branch];
  const StatusIcon = STATUS_ICON[data.status];
  const dimmed = data.status === "upcoming";

  return (
    <>
      <Handle type="target" position={Position.Top} style={{ background: color, border: "none" }} />
      <button
        type="button"
        onClick={() => data.onOpen(data)}
        className="panel-3d w-56 cursor-pointer border-3 p-4 text-left transition-transform hover:-translate-y-0.5"
        style={{
          borderColor: color,
          opacity: dimmed ? 0.55 : 1,
          boxShadow: data.status === "current" ? `4px 4px 0px #0a0a0f, 0 0 16px ${color}88` : undefined,
        }}
      >
        <div className="flex items-center justify-between">
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full"
            style={{ background: color, color: "#0a0a0f" }}
          >
            <StatusIcon size={14} strokeWidth={3} />
          </span>
          <span className="font-mono text-[10px] tracking-widest text-white/50 uppercase">
            {data.level}
          </span>
        </div>
        <h3 className="font-label mt-2 text-sm tracking-wide text-white">{data.title}</h3>
      </button>
      <Handle type="source" position={Position.Bottom} style={{ background: color, border: "none" }} />
    </>
  );
}
