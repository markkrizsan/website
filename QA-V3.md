# Creative V3 — QA / Red-Team Record

## Pre-push checks
- [x] Six-act architecture implemented.
- [x] Hero remains useful with video unavailable.
- [x] Hero video loads only on wide screens when reduced motion and Save Data are off.
- [x] Field video loads only after user action.
- [x] Director's Cut supports click, keyboard arrows, Home, End.
- [x] Reduced-motion path implemented.
- [x] No diagonal-arrow glyphs.
- [x] No explanatory chips over portfolio images.
- [x] Founder portrait remains color.
- [x] Form has native labels/required states and progressive POST fallback.
- [x] Semantic landmarks and one H1.
- [x] Primary CTA accessible independently of signature interaction.

## Required rendered preview checks before merge
- [ ] 1440+ desktop hero crop and title balance.
- [ ] 1280 laptop world compositions.
- [ ] 1024 / 768 responsive transitions.
- [ ] 430 / 390 / 375 / 320 mobile.
- [ ] Field image crops and broken-image check for all archive slots.
- [ ] Director's Cut keyboard/focus behavior.
- [ ] Reduced motion in browser.
- [ ] Formspree live submission.
- [ ] Console errors / failed critical requests.
- [ ] Lighthouse / PageSpeed against preview.
- [ ] LCP <= 2.5s target, INP <= 200ms, CLS <= .1 where measurable.
- [ ] `/web/` regression smoke test.
- [ ] Production deployment verification after approval/merge.

## Known content limitations
- Repository web-ready media is used in this branch. Newer Drive originals (Johnny Palmer, Night Owl, Moonwood, etc.) were audited but are not hotlinked because the original files are not web-optimized and would create unacceptable payload/performance risk.
- Legacy visual bodies are intentionally not attributed to named clients where repository metadata does not prove attribution.
- Director's Cut is a visual-system study until rights-cleared treatment/storyboard artifacts are exported for a named real project.
