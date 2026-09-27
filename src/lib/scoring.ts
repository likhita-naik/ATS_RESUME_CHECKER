import { extractKeywordsFromJD, matchKeywordsAgainstResume, type KeywordMatchResult } from "./keywords";
import { runFormatChecks, scoreFromChecks, type FormatCheck } from "./formatChecks";

export interface AnalysisResult {
  overallScore: number;
  keywordMatch: KeywordMatchResult;
  formatChecks: FormatCheck[];
  formatScore: number;
  suggestions: string[];
  resumeWarnings: string[];
  /** Plain text as extracted from the file — what an ATS parser "sees". */
  resumeText: string;
}

const KEYWORD_WEIGHT = 0.65;
const FORMAT_WEIGHT = 0.35;

function buildSuggestions(keywordMatch: KeywordMatchResult, formatChecks: FormatCheck[]): string[] {
  const suggestions: string[] = [];

  const topMissing = keywordMatch.missing
    .filter((k) => k.source === "dictionary")
    .slice(0, 6)
    .map((k) => k.term);

  if (topMissing.length > 0) {
    suggestions.push(
      `Add these missing keywords where they genuinely apply: ${topMissing.join(", ")}.`
    );
  }

  const underused = keywordMatch.matched.find((k) => k.jdCount >= 3 && k.resumeCount === 1);
  if (underused) {
    suggestions.push(
      `The job description mentions "${underused.term}" ${underused.jdCount} times but your resume only once — show it in an experience bullet, not just the skills list.`
    );
  }

  for (const check of formatChecks) {
    if (check.status === "fail" || check.status === "warn") {
      suggestions.push(check.detail);
    }
  }

  if (keywordMatch.matchRate < 50) {
    suggestions.push(
      "Your overall keyword match is low — tailor your resume to this specific job description rather than using one generic version for every application."
    );
  }

  return suggestions.slice(0, 8);
}

export function analyzeResume(resumeText: string, jobDescription: string, resumeWarnings: string[] = []): AnalysisResult {
  const keywords = extractKeywordsFromJD(jobDescription);
  const keywordMatch = matchKeywordsAgainstResume(resumeText, keywords);
  const formatChecks = runFormatChecks(resumeText);
  const formatScore = scoreFromChecks(formatChecks);

  const overallScore = Math.round(
    keywordMatch.matchRate * KEYWORD_WEIGHT + formatScore * FORMAT_WEIGHT
  );

  const suggestions = buildSuggestions(keywordMatch, formatChecks);

  return {
    overallScore,
    keywordMatch,
    formatChecks,
    formatScore,
    suggestions,
    resumeWarnings,
    resumeText,
  };
}
