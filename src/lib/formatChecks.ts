export type CheckStatus = "pass" | "warn" | "fail";

export interface FormatCheck {
  id: string;
  label: string;
  status: CheckStatus;
  detail: string;
}

const SECTION_PATTERNS: Record<string, RegExp> = {
  experience: /\b(work experience|professional experience|experience|employment history)\b/i,
  education: /\beducation\b/i,
  skills: /\b(skills|technical skills|core competencies)\b/i,
  contact: /\b(email|phone|linkedin)\b/i,
  summary: /\b(summary|objective|profile)\b/i,
};

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
// Matches a run of digits/separators (spaces, dots, dashes, parens) that,
// once separators are stripped, leaves a plausible phone number length.
// This is deliberately loose on grouping since conventions vary widely
// (e.g. Indian "98765 43210" is a 5+5 split, US is 3-3-4).
const PHONE_CANDIDATE_REGEX = /\+?[\d][\d\s().-]{7,}\d/g;

function hasPhoneNumber(text: string): boolean {
  const candidates = text.match(PHONE_CANDIDATE_REGEX) ?? [];
  return candidates.some((c) => {
    const digitCount = c.replace(/\D/g, "").length;
    return digitCount >= 10 && digitCount <= 13;
  });
}
const BULLET_LINE_REGEX = /^[\s]*[•\-*▪●○◦‣]\s*(.+)$/gm;
const NUMBER_IN_BULLET_REGEX = /\d/;

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

export function runFormatChecks(resumeText: string): FormatCheck[] {
  const checks: FormatCheck[] = [];
  const text = resumeText || "";
  const wordCount = countWords(text);

  // 1. Contact info detectable
  const hasEmail = EMAIL_REGEX.test(text);
  const hasPhone = hasPhoneNumber(text);
  if (hasEmail && hasPhone) {
    checks.push({
      id: "contact-info",
      label: "Contact information",
      status: "pass",
      detail: "Email and phone number were both found in the extracted text.",
    });
  } else if (hasEmail || hasPhone) {
    checks.push({
      id: "contact-info",
      label: "Contact information",
      status: "warn",
      detail: `${hasEmail ? "Email found, but no phone number" : "Phone number found, but no email"} could be detected. Make sure both are in plain text, not inside an image or text box.`,
    });
  } else {
    checks.push({
      id: "contact-info",
      label: "Contact information",
      status: "fail",
      detail: "No email or phone number was detected. If they're in a header/footer or graphic, most ATS software can't read them.",
    });
  }

  // 2. Standard section headings
  const foundSections = Object.entries(SECTION_PATTERNS)
    .filter(([key, pattern]) => key !== "contact" && pattern.test(text))
    .map(([key]) => key);

  const coreSections = ["experience", "education", "skills"];
  const missingCore = coreSections.filter((s) => !foundSections.includes(s));

  if (missingCore.length === 0) {
    checks.push({
      id: "section-headings",
      label: "Standard section headings",
      status: "pass",
      detail: "Experience, Education, and Skills sections were all detected.",
    });
  } else if (missingCore.length <= 1) {
    checks.push({
      id: "section-headings",
      label: "Standard section headings",
      status: "warn",
      detail: `Couldn't clearly detect a "${missingCore[0]}" section heading. Use a standard label (e.g. "Work Experience", "Education", "Skills") so ATS parsers can categorize your content.`,
    });
  } else {
    checks.push({
      id: "section-headings",
      label: "Standard section headings",
      status: "fail",
      detail: `Missing clear headings for: ${missingCore.join(", ")}. Non-standard or creative section titles often aren't recognized by ATS software.`,
    });
  }

  // 3. Quantified achievements
  // Note: explicit bullet glyphs (•, -, *) are only reliably present when
  // extracting from PDFs. DOCX text extraction (mammoth) strips list
  // formatting entirely, so a resume built with Word's native bullet
  // list style will show zero glyph matches even though it's well
  // structured. We fall back to short/medium newline-separated lines
  // as a structural proxy whenever glyph bullets aren't found.
  const bulletLines = [...text.matchAll(BULLET_LINE_REGEX)].map((m) => m[1]);
  const paragraphLines = text
    .split(/\n+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 25 && l.length < 300);
  const usingGlyphBullets = bulletLines.length >= 3;
  const linesToCheck = usingGlyphBullets ? bulletLines : paragraphLines;
  const quantified = linesToCheck.filter((l) => NUMBER_IN_BULLET_REGEX.test(l));
  const quantifiedRatio = linesToCheck.length > 0 ? quantified.length / linesToCheck.length : 0;

  if (linesToCheck.length === 0) {
    checks.push({
      id: "quantified-impact",
      label: "Quantified achievements",
      status: "warn",
      detail: "Couldn't detect distinct bullet points to check for measurable impact (numbers, %, metrics).",
    });
  } else if (quantifiedRatio >= 0.3) {
    checks.push({
      id: "quantified-impact",
      label: "Quantified achievements",
      status: "pass",
      detail: `${quantified.length} of ${linesToCheck.length} bullet points include a number or metric — good use of measurable impact.`,
    });
  } else if (quantifiedRatio > 0) {
    checks.push({
      id: "quantified-impact",
      label: "Quantified achievements",
      status: "warn",
      detail: `Only ${quantified.length} of ${linesToCheck.length} bullet points include a number or metric. Try adding measurable results (%, ₹, time saved, team size) to more bullets.`,
    });
  } else {
    checks.push({
      id: "quantified-impact",
      label: "Quantified achievements",
      status: "fail",
      detail: "None of your bullet points appear to include numbers or metrics. Recruiters and ATS scoring both favor quantified impact (e.g. \"reduced load time by 40%\").",
    });
  }

  // 4. Resume length
  if (wordCount < 150) {
    checks.push({
      id: "length",
      label: "Resume length",
      status: "fail",
      detail: `Only ${wordCount} words were extracted. Your resume may be too short, or text may not have been extracted correctly (check for images or unusual formatting).`,
    });
  } else if (wordCount > 1100) {
    checks.push({
      id: "length",
      label: "Resume length",
      status: "warn",
      detail: `${wordCount} words is on the longer side. Most ATS-friendly resumes fit 1-2 pages (roughly 400-800 words).`,
    });
  } else {
    checks.push({
      id: "length",
      label: "Resume length",
      status: "pass",
      detail: `${wordCount} words — a reasonable length for 1-2 pages.`,
    });
  }

  // 5. Bullet point usage (structure signal)
  if (usingGlyphBullets) {
    checks.push({
      id: "bullet-structure",
      label: "Bullet point structure",
      status: "pass",
      detail: `${bulletLines.length} bullet points detected — clear, scannable structure.`,
    });
  } else if (paragraphLines.length >= 3) {
    checks.push({
      id: "bullet-structure",
      label: "Bullet point structure",
      status: "pass",
      detail: `${paragraphLines.length} distinct line items detected — structure looks scannable. (Bullet glyphs aren't always preserved when text is extracted from Word files, so this is estimated from line breaks.)`,
    });
  } else {
    checks.push({
      id: "bullet-structure",
      label: "Bullet point structure",
      status: "warn",
      detail: "Few or no bullet points detected. Dense paragraphs are harder for both ATS parsers and recruiters to scan quickly.",
    });
  }

  return checks;
}

export function scoreFromChecks(checks: FormatCheck[]): number {
  const points: Record<CheckStatus, number> = { pass: 100, warn: 60, fail: 0 };
  const total = checks.reduce((sum, c) => sum + points[c.status], 0);
  return Math.round(total / checks.length);
}
