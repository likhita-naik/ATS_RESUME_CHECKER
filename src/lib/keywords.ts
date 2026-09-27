import { SKILLS_DICTIONARY, STOPWORDS, SYNONYM_GROUPS } from "./skillsDictionary";

export interface Keyword {
  term: string;
  weight: number;
  source: "dictionary" | "frequency";
  /** How many times the JD mentions this keyword (any synonym). */
  jdCount: number;
}

export interface KeywordHit extends Keyword {
  resumeCount: number;
}

export interface KeywordMatchResult {
  matched: KeywordHit[];
  missing: Keyword[];
  matchRate: number; // 0-100, weighted
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const GROUP_BY_VARIANT = new Map<string, string[]>();
for (const group of SYNONYM_GROUPS) {
  for (const variant of group) GROUP_BY_VARIANT.set(variant, group);
}

/** Display name for a term: the first entry of its synonym group, or itself. */
function canonicalOf(term: string): string {
  return GROUP_BY_VARIANT.get(term)?.[0] ?? term;
}

const patternCache = new Map<string, RegExp>();

/**
 * One regex matching any synonym of `term`, word-boundary-safe, with an
 * optional plural "s"/"es". Variants are ordered longest-first inside the
 * alternation so "react.js" is consumed whole instead of also counting as
 * "react".
 */
function patternFor(term: string): RegExp {
  let pattern = patternCache.get(term);
  if (!pattern) {
    const variants = [...(GROUP_BY_VARIANT.get(term) ?? [term])]
      .sort((a, b) => b.length - a.length)
      .map(escapeRegExp);
    pattern = new RegExp(`(?<![a-z0-9])(?:${variants.join("|")})(?:es|s)?(?![a-z0-9])`, "gi");
    patternCache.set(term, pattern);
  }
  return pattern;
}

/** Number of occurrences of `term` (or any of its synonyms) in `haystack`. */
function countTerm(haystack: string, term: string): number {
  return haystack.match(patternFor(term))?.length ?? 0;
}

// Unique display terms, longest-first so multi-word phrases lead.
const DICTIONARY_TERMS = [...new Set(SKILLS_DICTIONARY.map(canonicalOf))].sort(
  (a, b) => b.length - a.length
);

function extractDictionaryKeywords(jdText: string): Keyword[] {
  const normalized = normalize(jdText);
  const found: Keyword[] = [];
  for (const term of DICTIONARY_TERMS) {
    const jdCount = countTerm(normalized, term);
    if (jdCount > 0) {
      found.push({ term, weight: 3, source: "dictionary", jdCount });
    }
  }
  // Most-emphasized skills first: they drive "top fixes" and course links.
  return found.sort((a, b) => b.jdCount - a.jdCount);
}

/**
 * Frequency-based fallback: pulls out bigrams/unigrams that repeat in the
 * JD and aren't stopwords or already covered by the dictionary. Catches
 * role-specific or company-specific terms (tool names, domain jargon)
 * that a fixed dictionary will always miss.
 */
function extractFrequencyKeywords(jdText: string, alreadyFound: Set<string>): Keyword[] {
  const normalized = normalize(jdText.replace(/[^\w\s./#+-]/g, " "));
  const words = normalized.split(" ").filter((w) => w.length > 1);

  const isUsable = (w: string) => w.length > 2 && !STOPWORDS.has(w) && !/^\d+$/.test(w);

  const unigramCounts = new Map<string, number>();
  const bigramCounts = new Map<string, number>();

  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (isUsable(w)) {
      unigramCounts.set(w, (unigramCounts.get(w) ?? 0) + 1);
    }
    if (i < words.length - 1) {
      const w2 = words[i + 1];
      if (isUsable(w) && isUsable(w2)) {
        const bigram = `${w} ${w2}`;
        bigramCounts.set(bigram, (bigramCounts.get(bigram) ?? 0) + 1);
      }
    }
  }

  const candidates: Keyword[] = [];

  for (const [bigram, count] of bigramCounts) {
    if (count >= 2 && !alreadyFound.has(bigram)) {
      candidates.push({ term: bigram, weight: 2, source: "frequency", jdCount: count });
    }
  }

  for (const [word, count] of unigramCounts) {
    if (count >= 3 && !alreadyFound.has(word)) {
      // Skip unigrams that are substrings of an already-picked bigram to
      // avoid redundant entries like "design" + "system design".
      const coveredByBigram = candidates.some((c) => c.term.includes(word));
      if (!coveredByBigram) {
        candidates.push({ term: word, weight: 1, source: "frequency", jdCount: count });
      }
    }
  }

  // Cap and sort by weight then frequency-ish (already filtered by count).
  return candidates.sort((a, b) => b.weight - a.weight).slice(0, 12);
}

export function extractKeywordsFromJD(jdText: string): Keyword[] {
  const dictionaryKeywords = extractDictionaryKeywords(jdText);
  // Include every synonym so e.g. "reactjs" doesn't resurface as jargon.
  const foundTerms = new Set(
    dictionaryKeywords.flatMap((k) => GROUP_BY_VARIANT.get(k.term) ?? [k.term])
  );
  const frequencyKeywords = extractFrequencyKeywords(jdText, foundTerms);

  const all = [...dictionaryKeywords, ...frequencyKeywords];
  // Cap total keyword list to a reasonable number for a readable report.
  return all.slice(0, 30);
}

export function matchKeywordsAgainstResume(
  resumeText: string,
  keywords: Keyword[]
): KeywordMatchResult {
  const normalizedResume = normalize(resumeText);

  const matched: KeywordHit[] = [];
  const missing: Keyword[] = [];

  for (const kw of keywords) {
    const resumeCount = countTerm(normalizedResume, kw.term);
    if (resumeCount > 0) {
      matched.push({ ...kw, resumeCount });
    } else {
      missing.push(kw);
    }
  }

  const totalWeight = keywords.reduce((sum, k) => sum + k.weight, 0);
  const matchedWeight = matched.reduce((sum, k) => sum + k.weight, 0);
  const matchRate = totalWeight > 0 ? Math.round((matchedWeight / totalWeight) * 100) : 0;

  return { matched, missing, matchRate };
}
