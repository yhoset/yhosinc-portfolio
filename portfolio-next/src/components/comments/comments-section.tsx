import { getTranslations } from "next-intl/server";
import { getApprovedComments } from "@/server/actions/comments";
import { getVisitorSession } from "@/server/auth/session";
import { Link } from "@/i18n/navigation";
import { CommentForm } from "@/components/comments/comment-form";

export async function CommentsSection({ slug, locale }: { slug: string; locale: string }) {
  const [t, comments, visitor] = await Promise.all([
    getTranslations({ locale, namespace: "Comments" }),
    getApprovedComments(slug),
    getVisitorSession(),
  ]);

  const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });

  return (
    <section className="mx-auto mt-16 max-w-3xl px-4 sm:px-6">
      <h2 className="font-display mb-6 text-2xl text-white">{t("title")}</h2>

      {comments.length === 0 ? (
        <p className="mb-8 text-white/60">{t("empty")}</p>
      ) : (
        <div className="mb-8 flex flex-col gap-4">
          {comments.map((c) => (
            <div key={c.id} className="panel-3d p-4">
              <div className="mb-1.5 flex flex-wrap justify-between gap-2">
                <span className="font-label text-white">{c.name}</span>
                <span className="font-mono text-xs text-white/50">{dateFormatter.format(c.createdAt)}</span>
              </div>
              <p className="leading-relaxed text-white/85">{c.content}</p>
            </div>
          ))}
        </div>
      )}

      {visitor ? (
        <CommentForm projectSlug={slug} />
      ) : (
        <p className="text-white/60">
          {t("loginPrompt")}{" "}
          <Link
            href="/cuenta"
            className="text-cyan underline decoration-cyan/40 underline-offset-4 hover:decoration-cyan"
          >
            {t("loginLink")}
          </Link>
        </p>
      )}
    </section>
  );
}
