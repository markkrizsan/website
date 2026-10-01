# PROJECT_WEBSITE_SPEC — Mark Krizsan Creative V3

**Spec version:** 3.0 / 2026-09-30  
**Project state:** BUILD  
**Branch:** `website-os/creative-epic-v3`

## Purpose
Rebuild the root of markkrizsan.com as a media-first photography, film, and creative-direction experience whose visual decisions prove Mark has a real eye and can shape a visual world, not merely operate a camera.

## Strategy Vector
- Primary Job: EVALUATE
- Secondary Job: EXPLORE
- Primary Archetype: Portfolio / Agency
- Secondary Archetype: Editorial / Campaign
- Commercial Objective: LEAD
- Buyer Commitment: 2 HIGH
- Information Complexity: 1 MEDIUM
- Experiential Intensity: 2 EXPERIENCE-FIRST
- Interaction Novelty: 1 ENHANCED
- Brand Expression: 2 HIGHLY EXPRESSIVE
- Trust Burden: 2 HIGH
- Core Value Mechanism: visual proof of taste, craft, range, and authorship
- Complexity ROI: required only for signature Director's Cut interaction

## Primary buyer
A decision-maker responsible for a public-facing person, brand, product, place, campaign, or release where visual perception materially affects how it is received. Typical roles include founders, artists/talent, brand owners, creative leads, marketing leads, and producers.

## Situation
Something meaningful is being introduced, repositioned, promoted, or documented, but its visual world is unclear, generic, inconsistent, outdated, or not yet defined.

## Desired progress
Move from “we need content” to a coherent visual world that makes the subject easier to notice, understand, desire, remember, or trust.

## User decision
Is Mark the right person to trust with how this is going to be perceived?

## Required beliefs
1. Mark has exceptional visual judgment.
2. His taste adapts to the assignment rather than forcing one house look.
3. He can originate the visual idea, not merely execute instructions.
4. He can carry the idea into finished photography and/or film.
5. He understands commercial/cultural objectives behind the visuals.
6. The buyer does not need to arrive with a finished treatment.
7. Getting the perception right is worth investing in.

## Positioning
**Internal thesis:** Mark Krizsan creates and directs visual worlds for people and brands whose perception matters.

**Commercial shorthand:** You hire Mark when how the person, brand, or story is perceived matters enough to get right.

## Primary / secondary actions
- Primary CTA: Start a project
- Secondary CTA: View the work
- Inquiry model: asynchronous form first; no finished brief required

## Homepage architecture
1. THE EYE — singular cinematic hero
2. SELECTED WORLDS — three contrasting visual bodies
3. DIRECTOR'S CUT — one signature interactive visual-system study
4. THE FIELD — 20+ selected stills plus motion punctuation
5. MARK / THE PRACTICE — person + point of view + trust
6. COMMISSION — engagement clarity + fit filter + inquiry

## Visual system
- Dominant: contemporary editorial / cinematic portfolio
- Secondary: Swiss-influenced discipline and typography
- Disruptor: restrained raw cultural energy
- Palette: warm paper #f3f0e9, near-black #0a0a0a, signal red #f13720
- Type: Inter display, DM Sans body, Instrument Serif accent
- Grid: disciplined 1184px content canvas plus intentional full-bleed media breaks
- Density: alternates sparse impact with dense visual sequencing
- Media: real work first, large scale, variable aspect ratios, no explanatory overlays
- Portraits: color by default
- Arrows: → and ↓ only; never diagonal arrow glyphs

## Motion / interaction
- Motion profile: restrained cinematic
- One signature interaction: Director's Cut
- Jobs: reveal, orientation, sequence, feedback, media demonstration, atmosphere
- No scroll hijacking, gated loader, WebGL, custom cursor, or drag-only control
- Hover supplementary only
- Reduced motion removes nonessential transitions and autoplay

## Responsive
- Preserve value, not geometry
- Test: 320 / 375 / 390 / 768 / 1024 / 1440 / 1920
- Hero crop/recomposition may differ on mobile
- Director's Cut becomes a vertical evidence sequence on narrow screens
- No critical information or interaction is hover-only
- No accidental horizontal overflow
- Media meaning takes priority over aggressive crop

## Engineering
- Static HTML + CSS + small vanilla JS
- No framework
- Progressive enhancement
- Existing Formspree endpoint retained
- Existing repo WebP media used for V3 production build because it is web-ready
- Connected Drive newer originals are source-of-truth candidates for later web-export replacement; do not hotlink giant originals
- Hero video only upgrades from poster under suitable conditions

## Integrity
- WCAG 2.2 AA
- LCP <= 2.5s target
- INP <= 200ms target
- CLS <= 0.1 target
- Semantic landmarks, one H1, logical headings, visible focus, keyboard operation
- No autoplay audio
- Explicit image dimensions/aspect ratios where practical
- Reduced-motion support
- Correct metadata, canonical, OG/Twitter, sitemap intent

## Proof constraints / assumptions
- Do not fabricate client names, results, testimonials, project roles, or outcomes.
- Legacy `presence`, `campaign`, and `story` media bodies are used as visual bodies in V3 where exact current attribution is not encoded in the repository.
- Named newer Drive projects (e.g. Johnny Palmer, Moonwood Coffee Co, Night Owl) require rights-cleared web-ready exports before they replace repo slots.
- Director's Cut is presented as a visual-system study rather than an invented client case study until real treatment/storyboard artifacts are exported.

## Acceptance criteria
- First 10 seconds establish EYE -> CRAFT -> RANGE.
- The work dominates copy.
- Homepage visible prose stays compressed; no redundant service essay, FAQ, deliverables wall, or investment manifesto.
- Strongest work receives strongest scale.
- 20+ images can be explored without feeling like masonry filler.
- Primary CTA is always understandable and reachable.
- No diagonal arrows or image-caption clutter.
- Mobile is intentionally composed.
- No fabricated proof.
- No broken routes/form/console-critical errors.
- Full L3 red-team and rendered preview required before merge.
