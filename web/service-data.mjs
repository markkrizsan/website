/** @typedef {{name: string, url: string, description: string, role: string}} Proof */
/** @typedef {{name: string, provider: string, canonicalUrl: string, description: string, idealClients: string[], problemsSolved: string[], outcomes: string[], deliverables: string[], process: string[], proof: Proof[], primaryAction: {label: string, description: string, url: string}, timeline: string, pricing: string, availability: string}} WebService */

/** @type {Readonly<WebService>} Public facts from the existing /web/ page. */
export const webService = Object.freeze({
  name: 'Web design and development',
  provider: 'Mark Krizsan',
  canonicalUrl: 'https://markkrizsan.com/web/',
  description: 'Premium web design and development for established businesses ready for a website that reflects the quality of what they’ve built.',
  idealClients: ['Businesses whose current website no longer reflects the quality of their work', 'Businesses seeking a focused custom marketing site or one-page build'],
  problemsSolved: ['Unclear positioning and value on the current site', 'A visual and verbal standard that weakens buyer confidence', 'Unclear paths to inquiry or purchase'],
  outcomes: ['A website that makes the business easier to understand, trust, and choose', 'A coherent site with a clear next step for visitors'],
  deliverables: ['Positioning and page strategy', 'Copy direction and refinement', 'Custom art direction and design', 'Responsive development', 'Forms and conversion flow', 'SEO and social metadata foundation', 'Performance and accessibility QA', 'Deployment and launch support'],
  process: ['Diagnose perception, clarity, and conversion gaps', 'Direct the site’s message, visual direction, and priorities', 'Design and build', 'Refine responsive behavior, copy, interaction, accessibility, and QA', 'Launch and hand over the site'],
  timeline: 'Typical launch: 7–10 days once scope, content, assets, and access are ready.',
  pricing: 'Most custom marketing sites: $3,500–$6,000. Focused one-page builds: from $3,000. Final scope and investment are agreed before work begins.',
  availability: 'Orange County / Worldwide',
  proof: [
    {name: '20 From 20', url: 'https://danavaughns.com', description: 'Live book-launch and commerce website for Dana Vaughns.', role: 'Website strategy, page architecture, copy direction, art direction, front-end implementation, ecommerce setup, and launch system.'},
    {name: 'Awaken to Jesus', url: 'https://awakentojesus.tv', description: 'Live multi-expression ministry website and editorial system.', role: 'Website strategy, information architecture, copy direction, visual system, custom front-end design, and implementation.'}
  ],
  primaryAction: {label: 'Book a 15-minute fit call', description: 'Bring your current site to discuss clarity, trust, conversion, project fit, and a path to launch.', url: 'https://calendly.com/markkrizsan/sprint'}
});
