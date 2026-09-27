import { AFFILIATE } from "../config";
import { track } from "../lib/analytics";
import type { Keyword } from "../lib/keywords";

interface RecommendationsProps {
  missing: Keyword[];
  formatScore: number;
}

// Missing "keywords" that aren't skills you can pick up from a course.
const NOT_COURSE_MATERIAL = new Set([
  "bachelor's degree", "master's degree", "mba", "computer science",
  "information technology", "certification",
]);

const COURSE_SLOTS = 4;
const WEAK_FORMAT_SCORE = 80;

function courseUrl(skill: string): string {
  const target = AFFILIATE.courseSearchUrl + encodeURIComponent(skill);
  return AFFILIATE.courseLinkPrefix
    ? AFFILIATE.courseLinkPrefix + encodeURIComponent(target)
    : target;
}

export function Recommendations({ missing, formatScore }: RecommendationsProps) {
  const skills = missing
    .filter((k) => k.source === "dictionary" && !NOT_COURSE_MATERIAL.has(k.term))
    .slice(0, COURSE_SLOTS);
  const builder = AFFILIATE.resumeBuilder;
  const showBuilder = !!builder.url && formatScore < WEAK_FORMAT_SCORE;
  const hasAffiliateLinks = !!AFFILIATE.courseLinkPrefix || showBuilder;

  if (skills.length === 0 && !showBuilder) return null;

  return (
    <section className="card" aria-labelledby="recs-title">
      <h3 className="section-title" id="recs-title">Close the gap</h3>

      {skills.length > 0 && (
        <>
          <p className="recs-intro">
            Don't just paste missing keywords in — recruiters will ask about them. If
            you don't have these skills yet, a short course gives you something real
            to put on your resume.
          </p>
          <ul className="recs-list">
            {skills.map((k) => (
              <li key={k.term} className="recs-item">
                <div>
                  <strong>{k.term}</strong>
                  <span>
                    {k.jdCount > 1 ? `Mentioned ${k.jdCount}× in the job description` : "Asked for in the job description"}
                  </span>
                </div>
                <a
                  className="btn-link"
                  href={courseUrl(k.term)}
                  target="_blank"
                  rel="sponsored noopener"
                  onClick={() => track(`click-course-${k.term}`)}
                >
                  Learn {k.term} on {AFFILIATE.courseProvider}
                  <span aria-hidden="true"> →</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      {showBuilder && (
        <div className="recs-builder">
          <div>
            <strong>Formatting holding you back?</strong>
            <span>{builder.pitch}</span>
          </div>
          <a
            className="btn-primary"
            href={builder.url}
            target="_blank"
            rel="sponsored noopener"
            onClick={() => track("click-resume-builder")}
          >
            Try {builder.name}
            <span aria-hidden="true"> →</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      )}

      {hasAffiliateLinks && (
        <p className="affiliate-note">
          Some links above are affiliate links: we may earn a commission at no extra
          cost to you. It keeps this tool free.
        </p>
      )}
    </section>
  );
}
