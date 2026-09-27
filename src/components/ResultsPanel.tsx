import type { AnalysisResult } from "../lib/scoring";
import { ScoreGauge } from "./ScoreGauge";

interface ResultsPanelProps {
  result: AnalysisResult;
}

const CHECK_ICON: Record<string, string> = {
  pass: "✅",
  warn: "⚠️",
  fail: "❌",
};

function scoreMessage(score: number): string {
  if (score >= 80) return "Strong match. Small tweaks could push this even higher.";
  if (score >= 60) return "Decent match, but there's clear room to close the gap.";
  if (score >= 40) return "Weak match — this resume likely needs real tailoring for this role.";
  return "Very low match. This resume in its current form probably won't clear an ATS filter for this job.";
}

export function ResultsPanel({ result }: ResultsPanelProps) {
  const { overallScore, keywordMatch, formatChecks, formatScore, suggestions, resumeWarnings } = result;

  return (
    <div className="results">
      {resumeWarnings.length > 0 && (
        <div className="warnings-box">
          {resumeWarnings.map((w, i) => (
            <div key={i}>⚠️ {w}</div>
          ))}
        </div>
      )}

      <div className="card">
        <div className="results-top">
          <ScoreGauge score={overallScore} />
          <div className="score-summary">
            <h2>Your ATS match score: {overallScore}/100</h2>
            <p>{scoreMessage(overallScore)}</p>
            <div className="subscore-row">
              <span className="subscore-pill">
                🔑 Keyword match: {keywordMatch.matchRate}%
              </span>
              <span className="subscore-pill">
                📐 Formatting score: {formatScore}%
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
          <div className="keyword-chips">
            {keywordMatch.missing.map((kw) => (
              <span key={kw.term} className="keyword-chip missing">
                {kw.term}
              </span>
            ))}
          </div>
        )}

        <div className="section-block">
          <h3 className="section-title">
            Matched keywords ({keywordMatch.matched.length})
          </h3>
          {keywordMatch.matched.length === 0 ? (
            <p style={{ color: "var(--color-text-muted)", fontSize: 14, margin: 0 }}>
              No overlapping keywords found yet.
            </p>
          ) : (
            <div className="keyword-chips">
              {keywordMatch.matched.map((kw) => (
                <span key={kw.term} className="keyword-chip matched">
                  {kw.term}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">Formatting & ATS-safety checks</h3>
        <div className="check-list">
          {formatChecks.map((check) => (
            <div key={check.id} className={`check-item ${check.status}`}>
              <span className="check-icon">{CHECK_ICON[check.status]}</span>
              <div className="check-body">
                <strong>{check.label}</strong>
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
    </div>
  );
}
