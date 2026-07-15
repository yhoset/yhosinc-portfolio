const GITHUB_USERNAME = "yhoset";

export type PowerLevelBase = {
  level: number;
  publicRepos: number;
  followers: number;
  accountAgeDays: number;
};

// Nivel base "real" del Power Level — branding-y-filosofia.md §7: nunca un
// número inventado. Fórmula simple y documentada, no una métrica oficial de
// GitHub: repos públicos * 40 + followers * 25 + 1 punto por cada 10 días de
// cuenta. Si el fetch falla (sin red, rate limit de la API pública sin
// auth), no se inventa un número — se degrada a 0 sin romper la página
// (regla: el Power Level nunca bloquea contenido).
export async function getGithubPowerLevelBase(): Promise<PowerLevelBase> {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`GitHub API respondió ${res.status}`);
    const data = (await res.json()) as {
      public_repos: number;
      followers: number;
      created_at: string;
    };
    const accountAgeDays = Math.floor(
      (Date.now() - new Date(data.created_at).getTime()) / (1000 * 60 * 60 * 24)
    );
    const level = data.public_repos * 40 + data.followers * 25 + Math.floor(accountAgeDays / 10);
    return { level, publicRepos: data.public_repos, followers: data.followers, accountAgeDays };
  } catch {
    return { level: 0, publicRepos: 0, followers: 0, accountAgeDays: 0 };
  }
}
