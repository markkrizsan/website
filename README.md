# Mark Krizsan — Custom Website Sprint

A one-page, conversion-focused personal sales site built in plain HTML/CSS/JS.

## Files

- `index.html`
- `style.css`
- `script.js`

## Before deployment

Open `script.js` and replace:

```js
const SITE_CONFIG = {
  bookingUrl: "https://cal.com/YOUR-HANDLE/15min",
  email: "YOUR-EMAIL@example.com"
};
```

with your real booking URL and email.

## Deploy

### GitHub + Cloudflare Pages

1. Create a GitHub repository.
2. Upload these files to the repository root.
3. In Cloudflare Pages, create a new Pages project from Git.
4. Select the repository.
5. Framework preset: **None**
6. Build command: leave blank
7. Build output directory: `/`
8. Deploy.
9. Add `markkrizsan.com` as a custom domain when ready.

## Positioning

This page is deliberately narrow:
- one offer
- one price anchor
- one primary CTA
- no invented testimonials
- no fake client logos
- no generic agency language

The page itself is intended to function as proof of taste and implementation ability.
