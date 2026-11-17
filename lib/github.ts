import { cacheLife } from "next/cache";

export type GithubDay = {
  date: string;
  count: number;
  level: number;
};

export type GithubActivity = {
  username: string;
  year: number;
  total: number;
  days: GithubDay[];
};

type GithubResponse = {
  total?: Record<string, number>;
  contributions?: GithubDay[];
};

/**
 * Fetches a public GitHub contribution calendar and shapes it for the sidebar
 * heatmap. Cached for a few hours so we don't hit the public API on every hit.
 */
export async function getGithubActivity(username: string): Promise<GithubActivity | null> {
  "use cache";
  cacheLife("hours");

  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) return null;

    const data = (await res.json()) as GithubResponse;
    const years = Object.keys(data.total ?? {}).map(Number).filter(Number.isFinite);
    const year = years.length
      ? Math.max(...years)
      : (data.contributions ?? []).reduce((latest, day) => Math.max(latest, Number(day.date.slice(0, 4))), 0);
    if (!year) return null;

    const days = (data.contributions ?? [])
      .filter((day) => day.date.startsWith(String(year)))
      .sort((a, b) => a.date.localeCompare(b.date));

    if (days.length === 0) return null;

    const total = data.total?.[String(year)] ?? days.reduce((sum, day) => sum + day.count, 0);

    return { username, year, total, days };
  } catch {
    return null;
  }
}
