import { SKILLS_DICTIONARY, STOPWORDS } from "./skillsDictionary";

export interface Keyword {
  term: string;
  weight: number;
  source: "dictionary" | "frequency";
}

export interface KeywordMatchResult {
  matched: Keyword[];
  missing: Keyword[];
  matchRate: number; // 0-100, weighted
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Word-boundary-safe "contains" check that also tolerates a trailing 's'. */
function textContainsTerm(haystack: string, term: string): boolean {
  const escaped = escapeRegExp(term);
  // Allow an optional trailing "s"/"es" for simple pluralization, and treat
  // '.' / '/' inside terms (e.g. "node.js", "ui/ux") as literal.
  const pattern = new RegExp(`(?<![a-z0-9])${escaped}(?:es|s)?(?![a-z0-9])`, "i");
  return pattern.test(haystack);
}

// Sort dictionary terms longest-first so multi-word phrases are checked
// before shorter substrings (e.g. "machine learning engineer" before "java").
const SORTED_DICTIONARY = [...SKILLS_DICTIONARY].sort((a, b) => b.length - a.length);

function extractDictionaryKeywords(jdText: string): Keyword[] {
  const normalized = normalize(jdText);
  const found: Keyword[] = [];
  for (const term of SORTED_DICTIONARY) {
    if (textContainsTerm(normalized, term)) {
      found.push({ term, weight: 3, source: "dictionary" });
    }
  }
  return found;
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
      candidates.push({ term: bigram, weight: 2, source: "frequency" });
    }
  }

  for (const [word, count] of unigramCounts) {
    if (count >= 3 && !alreadyFound.has(word)) {
      // Skip unigrams that are substrings of an already-picked bigram to
      // avoid redundant entries like "design" + "system design".
      const coveredByBigram = candidates.some((c) => c.term.includes(word));
      if (!coveredByBigram) {
        candidates.push({ term: word, weight: 1, source: "frequency" });
      }
    }
  }

  // Cap and sort by weight then frequency-ish (already filtered by count).
  return candidates.sort((a, b) => b.weight - a.weight).slice(0, 12);
}

export function extractKeywordsFromJD(jdText: string): Keyword[] {
  const dictionaryKeywords = extractDictionaryKeywords(jdText);
  const foundTerms = new Set(dictionaryKeywords.map((k) => k.term));
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

  const matched: Keyword[] = [];
  const missing: Keyword[] = [];

  for (const kw of keywords) {
    if (textContainsTerm(normalizedResume, kw.term)) {
      matched.push(kw);
    } else {
      missing.push(kw);
    }
  }

  const totalWeight = keywords.reduce((sum, k) => sum + k.weight, 0);
  const matchedWeight = matched.reduce((sum, k) => sum + k.weight, 0);
  const matchRate = totalWeight > 0 ? Math.round((matchedWeight / totalWeight) * 100) : 0;

  return { matched, missing, matchRate };
}
