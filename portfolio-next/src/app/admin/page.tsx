import { getAdminSession } from "@/server/auth/session";
import { getMessages, getAnalyticsSummary, getAllComments } from "@/server/actions/admin";
import { listProjectsAdmin } from "@/server/actions/projects";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { LogoutButton } from "@/components/admin/logout-button";
import { CommentsPanel } from "@/components/admin/comments-panel";
import { ProjectsPanel } from "@/components/admin/projects-panel";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-AR", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export default async function AdminPage() {
  const admin = await getAdminSession();
  if (!admin) {
    return <AdminLoginForm />;
  }

  const [messages, analytics, comments, projects] = await Promise.all([
    getMessages(),
    getAnalyticsSummary(),
    getAllComments(),
    listProjectsAdmin(),
  ]);

  return (
    <div className="min-h-screen bg-ink">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-3xl text-white">PANEL ADMIN</h1>
          <LogoutButton />
        </div>

        <section className="mb-10">
          <h2 className="font-mono mb-4 text-sm font-bold tracking-[0.15em] text-cyan">{"// ANALÍTICAS"}</h2>
          <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fit,minmax(160px,1fr))]">
            <div className="panel-3d p-4">
              <div className="font-display text-3xl text-cyan">{analytics.totalPageviews}</div>
              <div className="font-mono text-xs tracking-wide text-white/60">PAGEVIEWS</div>
            </div>
            <div className="panel-3d p-4">
              <div className="font-display text-3xl text-yellow">{analytics.totalProjectViews}</div>
              <div className="font-mono text-xs tracking-wide text-white/60">VISTAS DE PROYECTOS</div>
            </div>
          </div>
          {analytics.byProject.length > 0 && (
            <div className="panel-3d flex flex-col gap-2 p-4">
              {analytics.byProject.map((p) => (
                <div key={p.projectSlug} className="flex justify-between text-sm text-white/80">
                  <span>{p.projectSlug}</span>
                  <span className="font-mono">{p.views}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mb-10">
          <h2 className="font-mono mb-4 text-sm font-bold tracking-[0.15em] text-yellow">
            {"// MENSAJES"} ({messages.length})
          </h2>
          {messages.length === 0 ? (
            <p className="text-white/60">Todavía no hay mensajes.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {messages.map((m) => (
                <div key={m.id} className="panel-3d p-4">
                  <div className="mb-1.5 flex flex-wrap justify-between gap-2">
                    <span className="font-label text-white">{m.name}</span>
                    <span className="font-mono text-xs text-white/50">{formatDate(m.createdAt)}</span>
                  </div>
                  <a href={`mailto:${m.email}`} className="font-mono text-sm text-cyan no-underline">
                    {m.email}
                  </a>
                  <p className="mt-2 leading-relaxed text-white/85">{m.message}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mb-10">
          <ProjectsPanel initialProjects={projects} />
        </section>

        <CommentsPanel initialComments={comments} />
      </div>
    </div>
  );
}
