import type { Ref } from "react";
import type { AnalysisResult } from "../lib/scoring";
import { Recommendations } from "./Recommendations";
import { ScoreGauge } from "./ScoreGauge";

interface ResultsPanelProps {
  result: AnalysisResult;
  headingRef: Ref<HTMLHeadingElement>;
}

const CHECK_ICON: Record<string, string> = {
  pass: "✅",
  warn: "⚠️",
  fail: "❌",
};

const CHECK_STATUS_TEXT: Record<string, string> = {
  pass: "Passed:",
  warn: "Warning:",
  fail: "Failed:",
};

function scoreMessage(score: number): string {
  if (score >= 80) return "Strong match. Small tweaks could push this even higher.";
  if (score >= 60) return "Decent match, but there's clear room to close the gap.";
  if (score >= 40) return "Weak match — this resume likely needs real tailoring for this role.";
  return "Very low match. This resume in its current form probably won't clear an ATS filter for this job.";
}

export function ResultsPanel({ result, headingRef }: ResultsPanelProps) {
  const { overallScore, keywordMatch, formatChecks, formatScore, suggestions, resumeWarnings, resumeText } = result;

  return (
    <div className="results">
      {resumeWarnings.length > 0 && (
        <div className="warnings-box">
          {resumeWarnings.map((w, i) => (
            <div key={i}>
              <span aria-hidden="true">⚠️</span> {w}
            </div>
          ))}
        </div>
      )}

      <div className="card">
        <div className="results-top">
          <ScoreGauge score={overallScore} />
          <div className="score-summary">
            <h2 ref={headingRef} tabIndex={-1}>
              Your ATS match score: {overallScore}/100
            </h2>
            <p>{scoreMessage(overallScore)}</p>
            <div className="subscore-row">
              <span className="subscore-pill">
                <span aria-hidden="true">🔑</span> Keyword match: {keywordMatch.matchRate}%
              </span>
              <span className="subscore-pill">
                <span aria-hidden="true">📐</span> Formatting score: {formatScore}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">
          Missing keywords ({keywordMatch.missing.length})
        </h3>
        {keywordMatch.missing.length === 0 ? (
          <p style={{ color: "var(--color-text-muted)", fontSize: 14, margin: 0 }}>
            No missing keywords detected — great coverage against this job description.
          </p>
        ) : (
          <ul className="keyword-chips">
            {keywordMatch.missing.map((kw) => (
              <li key={kw.term} className="keyword-chip missing">
                {kw.term}
                {kw.jdCount > 1 && <small> ×{kw.jdCount} in JD</small>}
              </li>
            ))}
          </ul>
        )}

        <div className="section-block">
          <h3 className="section-title">
            Matched keywords ({keywordMatch.matched.length})
          </h3>
          {keywordMatch.matched.some((k) => k.jdCount > k.resumeCount) && (
            <p className="chip-legend">
              "2/4" = your resume mentions it 2 times, the job description 4. Repeat
              the most-emphasized skills in your experience bullets.
            </p>
          )}
          {keywordMatch.matched.length === 0 ? (
            <p style={{ color: "var(--color-text-muted)", fontSize: 14, margin: 0 }}>
              No overlapping keywords found yet.
            </p>
          ) : (
            <ul className="keyword-chips">
              {keywordMatch.matched.map((kw) => (
                <li
                  key={kw.term}
                  className="keyword-chip matched"
                  title={`Job description: ${kw.jdCount}× · your resume: ${kw.resumeCount}×`}
                >
                  {kw.term}
                  {kw.jdCount > kw.resumeCount && (
                    <small>
                      {" "}
                      <span aria-hidden="true">{kw.resumeCount}/{kw.jdCount}</span>
                      <span className="sr-only">
                        , {kw.resumeCount} of {kw.jdCount} mentions
                      </span>
                    </small>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Recommendations missing={keywordMatch.missing} formatScore={formatScore} />

      <div className="card">
        <h3 className="section-title">Formatting & ATS-safety checks</h3>
        <div className="check-list">
          {formatChecks.map((check) => (
            <div key={check.id} className={`check-item ${check.status}`}>
              <span className="check-icon" aria-hidden="true">{CHECK_ICON[check.status]}</span>
              <div className="check-body">
                <strong>
                  <span className="sr-only">{CHECK_STATUS_TEXT[check.status]} </span>
                  {check.label}
                </strong>
                <span>{check.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="card">
          <h3 className="section-title">Top fixes</h3>
          <ol className="suggestions-list">
            {suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>
      )}

      <details className="card ats-view">
        <summary className="section-title">See what the ATS sees</summary>
        <p className="chip-legend">
          This is the raw text we extracted from your file — roughly what an ATS
          parser works with. Scrambled order, merged lines, or missing contact
          details here mean a real ATS will likely struggle too.
        </p>
        <pre>{resumeText.trim()}</pre>
      </details>
    </div>
  );
}
