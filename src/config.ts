// Site-wide settings for monetization and analytics. This is the only file
// you need to edit after signing up for affiliate programs / analytics.
// Blank values are safe: the related feature is simply hidden or unmonetized.
// Also read by vite.config.ts at build time (role pages, sitemap), so keep it
// free of browser-only APIs.

/** Public site URL, used for canonical links + sitemap. Netlify's build sets `URL`. */
export const SITE_URL_FALLBACK = "https://ats-score-check.netlify.app";

/**
 * GoatCounter site code (free, cookie-less analytics): sign up at
 * https://www.goatcounter.com, then put the subdomain here, e.g. "atscheck"
 * for atscheck.goatcounter.com. Blank = no analytics script is loaded.
 */
export const GOATCOUNTER_CODE = "";

export const AFFILIATE = {
  /** Shown next to each missing skill: "Learn <skill> on <provider>". */
  courseProvider: "Coursera",
  courseSearchUrl: "https://www.coursera.org/search?query=",
  /**
   * Deep-link prefix from your affiliate dashboard (e.g. Coursera via Impact).
   * The course search URL is appended URL-encoded. Blank = plain, unpaid link.
   */
  courseLinkPrefix: "",

  /**
   * Resume builder offer, shown when the formatting score is weak.
   * Blank url = card hidden.
   */
  resumeBuilder: {
    name: "",
    url: "",
    pitch: "Start from an ATS-friendly template instead of fixing formatting by hand.",
  },
};
