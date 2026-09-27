interface ScoreGaugeProps {
  score: number;
  label?: string;
}

function colorForScore(score: number): string {
  if (score >= 75) return "#16a34a";
  if (score >= 50) return "#d97706";
  return "#dc2626";
}

export function ScoreGauge({ score, label = "Match score" }: ScoreGaugeProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);
  const color = colorForScore(clamped);

  return (
    <div className="score-gauge">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="#e4e7ee"
          strokeWidth="12"
        />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="score-gauge-value">
        <span className="score-gauge-number" style={{ color }}>
          {clamped}
        </span>
        <span className="score-gauge-label">{label}</span>
      </div>
    </div>
  );
}
