import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {dirname, resolve} from 'node:path';
import {webService as s} from './service-data.mjs';

const webDir = dirname(fileURLToPath(import.meta.url));
const root = resolve(webDir, '..');
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
const start = '<!-- BEGIN GENERATED JSON-LD -->';
const end = '<!-- END GENERATED JSON-LD -->';
let html = await readFile(resolve(webDir, 'index.html'), 'utf8');
if (!html.includes(start) || !html.includes(end)) throw new Error('Missing JSON-LD generated markers');
const script = `<script type="application/ld+json">\n${JSON.stringify(graph, null, 2).replaceAll('<', '\\u003c')}\n  </script>`;
html = html.replace(new RegExp(`${start}[\\s\\S]*?${end}`), `${start}\n${script}\n  ${end}`);
await writeFile(resolve(webDir, 'index.html'), html);
await mkdir(resolve(root, 'api'), {recursive: true});
await writeFile(resolve(root, 'api/web-service.json'), JSON.stringify({service: {name: s.name, url: s.canonicalUrl, description: s.description, timeline: s.timeline, pricing: s.pricing, availability: s.availability}, provider: {name: s.provider, url: 'https://markkrizsan.com/'}, idealClients: s.idealClients, problemsSolved: s.problemsSolved, outcomes: s.outcomes, deliverables: s.deliverables, process: s.process, proof: s.proof, primaryAction: s.primaryAction}, null, 2) + '\n');
