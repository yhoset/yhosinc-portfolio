"use client";

import { useMemo, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { usePowerLevel } from "@/components/interaction/power-level-context";
import {
  ROADMAP_NODES,
  BRANCH_ORDER,
  LEVEL_ORDER,
  BRANCH_COLOR,
  type RoadmapNodeData,
} from "@/lib/roadmap";
import { RoadmapNode, type RoadmapFlowNode } from "@/components/roadmap/roadmap-node";
import { FloatingGlyph } from "@/components/decor/floating-glyph";

const NODE_TYPES = { roadmapNode: RoadmapNode };
const COLUMN_WIDTH = 260;
const ROW_HEIGHT = 140;

export function RoadmapCanvas() {
  const t = useTranslations("Roadmap");
  const { powerUp } = usePowerLevel();
  const [openNode, setOpenNode] = useState<RoadmapNodeData | null>(null);
  const openedIds = useRef(new Set<string>());

  const handleOpen = (node: RoadmapNodeData) => {
    setOpenNode(node);
    if (!openedIds.current.has(node.id)) {
      openedIds.current.add(node.id);
      powerUp(node.powerUp, `⚡ ${t("unlocked")}: ${node.title}`);
    }
  };

  const { nodes, edges } = useMemo(() => {
    const flowNodes: RoadmapFlowNode[] = ROADMAP_NODES.map((n) => ({
      id: n.id,
      type: "roadmapNode",
      position: {
        x: BRANCH_ORDER.indexOf(n.branch) * COLUMN_WIDTH,
        y: LEVEL_ORDER.indexOf(n.level) * ROW_HEIGHT,
      },
      data: { ...n, onOpen: handleOpen },
    }));

    const flowEdges: Edge[] = ROADMAP_NODES.flatMap((n) =>
      (n.dependsOn ?? []).map((sourceId) => ({
        id: `${sourceId}->${n.id}`,
        source: sourceId,
        target: n.id,
        style: { stroke: BRANCH_COLOR[n.branch], strokeWidth: 2 },
        animated: n.status === "current",
      }))
    );

    return { nodes: flowNodes, edges: flowEdges };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (ROADMAP_NODES.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 px-6 py-32 text-center">
        <FloatingGlyph className="chapter-num" style={{ color: "var(--color-cyan)" }}>
          ?
        </FloatingGlyph>
        <h1 className="font-display text-4xl text-white sm:text-5xl">{t("emptyTitle")}</h1>
        <p className="max-w-md text-white/60">{t("emptyBody")}</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        fitView
        proOptions={{ hideAttribution: true }}
        minZoom={0.4}
        maxZoom={1.5}
        colorMode="dark"
      >
        <Background variant={BackgroundVariant.Dots} color="#ffffff22" gap={18} />
        <Controls showInteractive={false} />
      </ReactFlow>

      <Dialog open={!!openNode} onOpenChange={(open) => !open && setOpenNode(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">{openNode?.title}</DialogTitle>
            <DialogDescription>{openNode?.description}</DialogDescription>
          </DialogHeader>
          {openNode && (
            <p className="font-label text-sm tracking-widest text-yellow">
              +{openNode.powerUp} PWR
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
