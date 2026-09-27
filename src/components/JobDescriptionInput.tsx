interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function JobDescriptionInput({ value, onChange }: JobDescriptionInputProps) {
  return (
    <div>
      <label className="field-label" htmlFor="jd-input">
        Job description
      </label>
      <textarea
        id="jd-input"
        className="jd-input"
        placeholder="Paste the full job description here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="char-count">{value.length.toLocaleString()} characters</div>
    </div>
  );
}
