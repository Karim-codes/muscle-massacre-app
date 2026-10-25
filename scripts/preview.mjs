import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, resolve, sep } from 'node:path';
import { networkInterfaces } from 'node:os';

const root = resolve('dist');
const port = Number(process.env.PORT || 4173);
if (!existsSync(resolve(root, 'index.html'))) {
  console.error('Build the preview first: npm run export:web');
  process.exit(1);
}
const mimeTypes = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ttf': 'font/ttf', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };
createServer((request, response) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
  catch { response.writeHead(400).end('Invalid request'); return; }
  const requested = resolve(root, `.${pathname}`);
  if (requested !== root && !requested.startsWith(`${root}${sep}`)) { response.writeHead(403).end(); return; }
  const candidates = [requested, `${requested}.html`, resolve(requested, 'index.html')];
  const file = candidates.find((candidate) => existsSync(candidate) && statSync(candidate).isFile());
  if (!file) { response.writeHead(404).end('Not found'); return; }
  response.writeHead(200, { 'Content-Type': mimeTypes[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
  createReadStream(file).pipe(response);
}).listen(port, '0.0.0.0', () => {
  console.log(`Muscle Massacre preview: http://localhost:${port}`);
  for (const addresses of Object.values(networkInterfaces())) {
    for (const address of addresses ?? []) {
      if (address.family === 'IPv4' && !address.internal) console.log(`Phone on the same Wi-Fi: http://${address.address}:${port}`);
    }
  }
});
