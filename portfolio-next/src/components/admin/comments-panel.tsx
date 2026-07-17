"use client";

import { useState, useTransition } from "react";
import { moderateComment } from "@/server/actions/admin";

type CommentRow = {
  id: number;
  projectSlug: string;
  content: string;
  status: string;
  createdAt: Date;
  visitorName: string;
  visitorEmail: string;
};

const STATUS_COLOR: Record<string, string> = {
  approved: "text-cyan",
  rejected: "text-red",
  pending: "text-yellow",
};

export function CommentsPanel({ initialComments }: { initialComments: CommentRow[] }) {
  const [comments, setComments] = useState(initialComments);
  const [pendingId, startTransition] = useTransition();

  const moderate = (id: number, status: "approved" | "rejected") => {
    startTransition(async () => {
      const updated = await moderateComment(id, status);
      setComments((cs) => cs.map((c) => (c.id === id ? { ...c, status: updated.status } : c)));
    });
  };

  const pendingCount = comments.filter((c) => c.status === "pending").length;

  return (
    <div>
      <h2 className="font-mono mb-4 text-sm font-bold tracking-[0.15em] text-red">
        {"// COMENTARIOS"} ({pendingCount} pendientes de {comments.length})
      </h2>
      {comments.length === 0 ? (
        <p className="text-white/60">Todavía no hay comentarios.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {comments.map((c) => (
            <div key={c.id} className="panel-3d p-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span className="font-label text-white">
                  {c.visitorName} <span className="font-mono text-xs text-white/50">· {c.projectSlug}</span>
                </span>
                <span className={`font-mono text-xs tracking-widest ${STATUS_COLOR[c.status] ?? "text-white/60"}`}>
                  {c.status.toUpperCase()}
                </span>
              </div>
              <p className="mb-3 leading-relaxed text-white/85">{c.content}</p>
              {c.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => moderate(c.id, "approved")}
                    disabled={pendingId}
                    className="btn-manga cyan px-3.5 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    APROBAR
                  </button>
                  <button
                    type="button"
                    onClick={() => moderate(c.id, "rejected")}
                    disabled={pendingId}
                    className="btn-manga px-3.5 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    RECHAZAR
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
