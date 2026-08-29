# MarkKrizsan.com restructure

## New routing
- `/` — Creative homepage
- `/archive/` — Living Archive
- `/projects/presence/` — Presence
- `/projects/campaign/` — Campaign
- `/projects/story/` — Story
- `/web/` — Previous website-design offer
- `/privacy.html` — Creative privacy notice

## Backwards compatibility
Legacy `/creative/`, `/creative/archive/`, `/creative/projects/*/`, and `/creative/privacy.html` URLs redirect to their new locations.

## Asset strategy
Your existing portfolio assets remain under `/creative/assets/`. This was intentional so the WebP files you already uploaded do not need to be renamed or manually reorganized again. The new root creative pages reference those same assets.

## Important
Upload the entire contents of this folder to the repository root, replacing the existing repository contents. Do not nest this folder itself inside the repo.

## Form
The creative form configuration remains at `/creative/assets/js/config.js`. `contact@markkrizsan.com` remains the fallback. Add your Formspree endpoint there when ready for silent in-page delivery.
