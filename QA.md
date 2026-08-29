# Restructure QA

## Intended routes
- `/` — creative homepage
- `/archive/` — Living Archive
- `/projects/presence/` — Presence
- `/projects/campaign/` — Campaign
- `/projects/story/` — Story
- `/web/` — previous website-design offer
- `/privacy.html` — creative privacy notice

## Backwards compatibility
Legacy `/creative/` URLs remain and redirect client-side to the corresponding new root-level pages. GitHub Pages does not provide repository-level HTTP 301 rules, so these compatibility pages use canonical tags + immediate meta/JavaScript redirects.

## Checks completed
- 13 HTML files parsed for local href/src dependencies
- 0 missing local assets/routes
- JavaScript syntax: PASS (`creative/assets/js/site.js`, `config.js`, `web/script.js`)
- All primary routes return HTTP 200 under a local static server
- Creative asset paths continue pointing at the existing `/creative/assets/` files
- Root canonical changed to `https://markkrizsan.com/`
- Website-offer canonical changed to `https://markkrizsan.com/web/`
- Root sitemap updated for the new primary URLs
- Root robots.txt allows crawling and references the sitemap
- Social preview image generated at `/assets/og-creative.jpg`

## Important deployment note
Replace the repository contents with the contents of this package. Do not upload the outer folder itself as a nested directory.
