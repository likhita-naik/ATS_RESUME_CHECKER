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

This is a static site — drag-and-drop `dist/` onto Netlify, or connect the repo
to Vercel/Netlify/Cloudflare Pages for automatic deploys. No environment
variables or backend config needed.

## How the scoring works

- `src/lib/skillsDictionary.ts` — curated list of ~250 hard-skill keywords
  (tech + general business) used to identify meaningful terms in a job
  description.
- `src/lib/keywords.ts` — extracts keywords from the JD (dictionary match +
  frequency-based fallback for role-specific jargon not in the dictionary),
  then checks which ones appear in the resume.
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

- SEO content pages ("what is an ATS", "ATS resume format guide", "is my
  score of X good") linking back to the tool
- Affiliate placements after the score (resume builders, courses, LinkedIn
  Premium) — see the affiliate programs discussed when this was scoped
- Role-specific keyword banks (separate dictionaries for IT/software,
  marketing, finance, etc.) selectable before scanning
- Save/compare scores across resume versions (would need a backend or
  browser storage)
