# ATS Score Check

A free, no-signup ATS (Applicant Tracking System) resume checker. Paste a job
description and upload a resume (PDF or DOCX) to get an instant match score,
missing-keyword list, and formatting fixes.

Everything runs client-side — the resume is parsed entirely in the browser
(via `pdfjs-dist` and `mammoth`), nothing is uploaded to a server. This is a
deliberate positioning choice: it's the differentiator against tools like
Jobscan/Resume Worded that gate scoring behind sign-up and limited free scans.

## Stack

- React + TypeScript + Vite
- `pdfjs-dist` (PDF text extraction) — pinned to 4.10.38 for broad browser
  compatibility. Do not upgrade to 6.x without testing across real browsers:
  newer builds use very recent JS engine features (`Map.prototype.getOrInsertComputed`)
  that aren't yet widely supported.
- `mammoth` (DOCX text extraction)
- No backend, no database — fully static site

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build   # outputs to dist/
npm run preview # serve the production build locally
```

## Deploying

This is a static site. Connect the repo to Netlify (build command
`npm run build`, publish directory `dist`) for automatic deploys. Netlify's
`URL` build variable is used for canonical links and `sitemap.xml`, so connect
the repo rather than drag-and-dropping `dist/` (or set `SITE_URL_FALLBACK` in
`src/config.ts` to your real URL first).

After the first deploy, submit `https://<your-site>/sitemap.xml` in Google
Search Console.

## Monetization & analytics (`src/config.ts`)

Everything is optional. Blank values hide the feature.

- `GOATCOUNTER_CODE` — free, cookie-less analytics. Tracks page views plus
  events: `scan-started`, `scan-completed-<score bucket>`, `scan-unreadable`,
  `scan-error`, `click-course-<skill>`, `click-resume-builder`.
- `AFFILIATE.courseLinkPrefix` — your affiliate deep-link prefix (e.g.
  Coursera via Impact). Each missing skill in the results gets a "Learn X on
  Coursera" link; without a prefix these are plain, unpaid links.
- `AFFILIATE.resumeBuilder` — shown when the formatting score is below 80.

An affiliate disclosure appears automatically whenever a paid link is shown.

## SEO pages

`vite.config.ts` (`seoPages` plugin) generates at build time, from
`src/data/roles.ts`:

- `/ats-resume-keywords/` hub + one static HTML page per role (keywords, tips,
  sample JD, link to `/?role=<slug>` which prefills the checker)
- `sitemap.xml`, `robots.txt`, Open Graph / canonical / JSON-LD tags

To add a role, append to `ROLES`. Its keywords must be display terms from
`skillsDictionary.ts` and should appear in its own `sampleJD`.

## How the scoring works

- `src/lib/skillsDictionary.ts` — curated list of ~250 hard-skill keywords
  (tech + general business) used to identify meaningful terms in a job
  description.
  `SYNONYM_GROUPS` maps equivalent terms (JS/JavaScript, k8s/Kubernetes,
  B.Tech/bachelor's) so they match each other and aren't double-counted.
- `src/lib/keywords.ts` — extracts keywords from the JD (dictionary match +
  frequency-based fallback for role-specific jargon not in the dictionary),
  then checks which ones appear in the resume and how often (JD vs resume
  mention counts).
- `src/lib/formatChecks.ts` — rule-based ATS-safety checks: contact info
  detection, standard section headings, quantified achievements, resume
  length, bullet structure.
- `src/lib/scoring.ts` — combines keyword match (65% weight) and formatting
  score (35% weight) into the overall score, plus generates the "top fixes"
  list.
- `src/lib/parseResume.ts` — extracts raw text from PDF/DOCX. For PDFs, text
  items are regrouped into lines by vertical position (pdf.js gives you
  positioned glyph runs, not paragraphs) and a simple x-position clustering
  heuristic flags likely multi-column layouts, which most real ATS software
  parses out of order.

## Ideas for a v2 (once this has traffic/validation)

- Guide pages ("ATS resume format guide", "is a score of 70 good?") written
  with real, specific content, not generated filler
- Save/compare scores across resume versions (localStorage is enough)
- Section-aware matching (skill only in the Skills list vs. in experience)
- Downloadable report
