import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {dirname, resolve} from 'node:path';
import {webService as s} from './service-data.mjs';

const webDir = dirname(fileURLToPath(import.meta.url));
const root = resolve(webDir, '..');
const escapeHtml = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const list = values => `<ul>${values.map(value => `<li>${escapeHtml(value)}</li>`).join('')}</ul>`;
const facts = `<section class="service-facts section" aria-labelledby="service-facts-title">
      <div class="section-index">Web design + development</div>
      <div><h2 id="service-facts-title">A website built around what your business needs to say and do.</h2>
        <p>${escapeHtml(s.provider)} provides ${escapeHtml(s.description.toLowerCase())}</p>
        <h3>Who it is for</h3>${list(s.idealClients)}
        <h3>What it addresses</h3>${list(s.problemsSolved)}
        <h3>What the work aims to create</h3>${list(s.outcomes)}
        <p>See <a href="#work">live client websites and Mark’s role</a>, then <a href="#engagement">the typical scope and process</a>.</p>
      </div>
    </section>`;
const graph = {
  '@context': 'https://schema.org',
  '@graph': [
    {'@type': 'Person', '@id': 'https://markkrizsan.com/#mark', name: s.provider, url: 'https://markkrizsan.com/', jobTitle: 'Web Designer and Developer'},
    {'@type': 'Service', '@id': `${s.canonicalUrl}#service`, name: s.name, description: s.description, url: s.canonicalUrl, provider: {'@id': 'https://markkrizsan.com/#mark'}, audience: {'@type': 'Audience', audienceType: s.idealClients.join('; ')}, serviceType: s.name, areaServed: s.availability},
    {'@type': 'WebPage', '@id': s.canonicalUrl, url: s.canonicalUrl, name: `${s.provider} — ${s.name}`, description: s.description, mainEntity: {'@id': `${s.canonicalUrl}#service`}},
    {'@type': 'BreadcrumbList', itemListElement: [
      {'@type': 'ListItem', position: 1, name: 'Home', item: 'https://markkrizsan.com/'},
      {'@type': 'ListItem', position: 2, name: 'Web design and development', item: s.canonicalUrl}
    ]}
  ]
};
const replace = (html, name, content) => {
  const start = `<!-- BEGIN GENERATED ${name} -->`;
  const end = `<!-- END GENERATED ${name} -->`;
  if (!html.includes(start) || !html.includes(end)) throw new Error(`Missing ${name} markers`);
  return html.replace(new RegExp(`${start}[\\s\\S]*?${end}`), `${start}\n${content}\n${end}`);
};
let html = await readFile(resolve(webDir, 'index.html'), 'utf8');
html = replace(html, 'JSON-LD', `<script type="application/ld+json">\n${JSON.stringify(graph, null, 2).replaceAll('<', '\\u003c')}\n  </script>`);
html = replace(html, 'SERVICE FACTS', facts);
await writeFile(resolve(webDir, 'index.html'), html);
await mkdir(resolve(root, 'api'), {recursive: true});
await writeFile(resolve(root, 'api/web-service.json'), JSON.stringify({service: {name: s.name, url: s.canonicalUrl, description: s.description, timeline: s.timeline, pricing: s.pricing, availability: s.availability}, provider: {name: s.provider, url: 'https://markkrizsan.com/'}, idealClients: s.idealClients, problemsSolved: s.problemsSolved, outcomes: s.outcomes, deliverables: s.deliverables, process: s.process, proof: s.proof, primaryAction: s.primaryAction}, null, 2) + '\n');
