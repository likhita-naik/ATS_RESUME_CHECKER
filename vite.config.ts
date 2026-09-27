import react from '@vitejs/plugin-react'
import { defineConfig, type HtmlTagDescriptor, type Plugin } from 'vite'
import { GOATCOUNTER_CODE, SITE_URL_FALLBACK } from './src/config.ts'
import { ROLES, type Role } from './src/data/roles.ts'

// Netlify sets URL during builds; fall back for local builds.
const SITE_URL = (process.env.URL || SITE_URL_FALLBACK).replace(/\/$/, '')
const SITE_NAME = 'ATS Score Check'
const HUB_PATH = '/ats-resume-keywords/'
const YEAR = new Date().getFullYear()

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function headTags(title: string, description: string, path: string): string {
  const url = SITE_URL + path
  const analytics = GOATCOUNTER_CODE
    ? `<script data-goatcounter="https://${GOATCOUNTER_CODE}.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>`
    : ''
  return `<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<link rel="canonical" href="${url}" />
<link rel="icon" href="/favicon.ico?v=2" sizes="48x48" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg?v=2" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=2" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="${SITE_NAME}" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${SITE_URL}/og-image.png" />
<meta name="twitter:card" content="summary_large_image" />
${analytics}`
}

// Static pages are plain HTML (no React) so they're fully indexable and tiny.
const PAGE_CSS = `
:root{--bg:#f6f7fb;--surface:#fff;--border:#e4e7ee;--text:#1a1d29;--muted:#62677a;--primary:#4f46e5;--primary-dark:#4338ca;--primary-light:#eef2ff}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;line-height:1.6;-webkit-font-smoothing:antialiased}
a{color:var(--primary)}.wrap{max-width:760px;margin:0 auto;padding:32px 16px 80px}
:focus-visible{outline:3px solid var(--primary);outline-offset:2px}
.brand{display:inline-flex;align-items:center;gap:10px;font-weight:700;font-size:18px;color:var(--text);text-decoration:none;margin-bottom:32px}
.brand img{width:30px;height:30px}
h1{font-size:clamp(28px,4vw,38px);line-height:1.15;letter-spacing:-.02em;margin:0 0 12px}
h2{font-size:20px;margin:36px 0 12px}.lead{color:var(--muted);font-size:17px;margin:0}
.cta{display:inline-block;margin-top:20px;background:var(--primary);color:#fff;text-decoration:none;font-weight:600;padding:13px 28px;border-radius:999px}
.cta:hover{background:var(--primary-dark)}
.chips{display:flex;flex-wrap:wrap;gap:8px;padding:0;margin:0;list-style:none}
.chips li{background:var(--primary-light);color:var(--primary-dark);border:1px solid #c7d2fe;border-radius:999px;padding:5px 12px;font-size:14px;font-weight:500}
blockquote{margin:0;background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:18px 20px;color:var(--muted);font-size:15px}
.roles{columns:2;padding-left:18px}@media(max-width:560px){.roles{columns:1}}
footer{margin-top:60px;color:var(--muted);font-size:13px;text-align:center}
`

function page(opts: { title: string; description: string; path: string; body: string }): string {
  return `<!doctype html>
<html lang="en">
<head>
${headTags(opts.title, opts.description, opts.path)}
<style>${PAGE_CSS}</style>
</head>
<body>
<div class="wrap">
<header><a class="brand" href="/"><img src="/favicon.svg" alt="" width="30" height="30" />${SITE_NAME}</a></header>
<main>
${opts.body}
</main>
<footer><nav aria-label="Site"><a href="/">Free ATS resume checker</a> · <a href="${HUB_PATH}">Resume keywords by role</a></nav></footer>
</div>
</body>
</html>
`
}

const rolePath = (r: Role) => `${HUB_PATH}${r.slug}/`

function rolePage(role: Role): string {
  const others = ROLES.filter((r) => r !== role)
    .map((r) => `<li><a href="${rolePath(r)}">${esc(r.title)}</a></li>`)
    .join('')
  const cta = `<a class="cta" href="/?role=${role.slug}">Check your resume against a ${esc(role.title)} job →</a>`
  return page({
    title: `${role.title} Resume Keywords for ATS (${YEAR}) | ${SITE_NAME}`,
    description: `The ${role.keywords.length} keywords ATS software looks for on a ${role.title} resume, how to use them, and a free checker to test your resume against a real job description.`,
    path: rolePath(role),
    body: `<h1>${esc(role.title)} resume keywords for ATS</h1>
<p class="lead">${esc(role.summary)}</p>
${cta}
<h2>Top ${esc(role.title)} keywords</h2>
<ul class="chips">${role.keywords.map((k) => `<li>${esc(k)}</li>`).join('')}</ul>
<h2>How to use them</h2>
<ul>${role.tips.map((t) => `<li>${esc(t)}</li>`).join('')}
<li>Only add a keyword where it's true. Recruiters read resumes after the ATS does, and interviews will test what you list.</li></ul>
<h2>Sample ${esc(role.title)} job description</h2>
<blockquote>${esc(role.sampleJD)}</blockquote>
<p>Your target job's description will differ, and it's the one that matters. Paste it into the checker to see exactly which keywords <em>your</em> resume is missing.</p>
${cta}
<nav aria-labelledby="other-roles"><h2 id="other-roles">Other roles</h2>
<ul class="roles">${others}</ul></nav>`,
  })
}

function hubPage(): string {
  return page({
    title: `ATS Resume Keywords by Job Role (${YEAR}) | ${SITE_NAME}`,
    description: `Resume keywords that ATS software screens for, for ${ROLES.length} common roles, with sample job descriptions and a free resume checker.`,
    path: HUB_PATH,
    body: `<h1>ATS resume keywords by job role</h1>
<p class="lead">Applicant tracking systems rank resumes by how well they match the job description's keywords. Pick your role to see the keywords recruiters filter on, then test your own resume for free.</p>
<a class="cta" href="/">Check my resume →</a>
<h2>Roles</h2>
<ul class="roles">${ROLES.map((r) => `<li><a href="${rolePath(r)}">${esc(r.title)}</a></li>`).join('')}</ul>`,
  })
}

function seoPages(): Plugin {
  return {
    name: 'seo-pages',
    transformIndexHtml() {
      const tags: HtmlTagDescriptor[] = [
        { tag: 'link', attrs: { rel: 'canonical', href: `${SITE_URL}/` }, injectTo: 'head' },
        { tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:type', content: 'website' }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:site_name', content: SITE_NAME }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:title', content: 'Free ATS Resume Checker — Instant Score & Keyword Match' }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:description', content: 'Get an instant ATS match score, missing keywords and formatting fixes. No sign-up, your resume never leaves your browser.' }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:url', content: `${SITE_URL}/` }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:image', content: `${SITE_URL}/og-image.png` }, injectTo: 'head' },
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' }, injectTo: 'head' },
        {
          tag: 'script',
          attrs: { type: 'application/ld+json' },
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: SITE_NAME,
            url: `${SITE_URL}/`,
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Any',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          }),
          injectTo: 'head',
        },
      ]
      if (GOATCOUNTER_CODE) {
        tags.push({
          tag: 'script',
          attrs: { 'data-goatcounter': `https://${GOATCOUNTER_CODE}.goatcounter.com/count`, async: true, src: 'https://gc.zgo.at/count.js' },
          injectTo: 'head',
        })
      }
      return tags
    },
    generateBundle() {
      const emit = (fileName: string, source: string) =>
        this.emitFile({ type: 'asset', fileName, source })

      emit(`${HUB_PATH.slice(1)}index.html`, hubPage())
      for (const role of ROLES) emit(`${rolePath(role).slice(1)}index.html`, rolePage(role))

      const paths = ['/', HUB_PATH, ...ROLES.map(rolePath)]
      emit(
        'sitemap.xml',
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
          .map((p) => `  <url><loc>${SITE_URL}${p}</loc></url>`)
          .join('\n')}\n</urlset>\n`
      )
      emit('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), seoPages()],
})
