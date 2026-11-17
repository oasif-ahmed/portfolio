"use client";

import type { GithubActivity, GithubDay } from "@/lib/github";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function tooltip(day: GithubDay) {
  const date = new Date(`${day.date}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  return day.count === 1 ? `1 contribution on ${date}` : `${day.count} contributions on ${date}`;
}

export function GithubHeatmap({ activity }: { activity: GithubActivity | null }) {
  if (!activity) return null;

  const firstWeekday = new Date(`${activity.days[0].date}T12:00:00Z`).getUTCDay();
  const cells: Array<GithubDay | null> = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...activity.days,
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = cells.length / 7;

  return (
    <div className="spt-gh">
      <div className="spt-gh-head">
        <div className="spt-gh-total">
          <strong>{activity.total.toLocaleString()}</strong>
          <span>contributions in {activity.year}</span>
        </div>
        <a
          className="spt-gh-year"
          href={`https://github.com/${activity.username}`}
          target="_blank"
          rel="noreferrer"
          aria-label={`View ${activity.username} on GitHub`}
        >
          @{activity.username}
        </a>
      </div>

      <div className="spt-gh-grid-wrap">
        <div className="spt-gh-days" aria-hidden="true">
          {WEEKDAYS.map((day, i) => (
            <span key={day}>{i % 2 === 1 ? day : ""}</span>
          ))}
        </div>
        <div
          className="spt-gh-grid"
          style={{ gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))` }}
          role="group"
          aria-label={`GitHub activity for ${activity.username} in ${activity.year}`}
        >
          {cells.map((day, i) =>
            day ? (
              <span
                key={day.date}
                className={`spt-gh-cell spt-gh-l${Math.min(Math.max(day.level, 0), 4)}`}
                title={tooltip(day)}
                aria-label={tooltip(day)}
              />
            ) : (
              <span key={`blank-${i}`} className="spt-gh-cell spt-gh-blank" />
            )
          )}
        </div>
      </div>

      <div className="spt-gh-foot">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <span key={level} className={`spt-gh-cell spt-gh-l${level}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
