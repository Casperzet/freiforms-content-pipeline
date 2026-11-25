// usage: node render.js <scene> [fps] [only-times-comma-separated] [outdir]
const { chromium } = require('playwright');
const fs = require('fs');
const http = require('http');
const path = require('path');
const { execSync } = require('child_process');

const scene = process.argv[2] || 'a';
const fps = +(process.argv[3] || 30);
const only = process.argv[4] && process.argv[4] !== 'all' ? process.argv[4].split(',').map(Number) : null;
const root = __dirname;

const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  fs.readFile(p, (e, d) => {
    if (e) { res.writeHead(404); return res.end(); }
    const ext = path.extname(p);
    res.writeHead(200, { 'Content-Type': { '.html': 'text/html', '.js': 'text/javascript', '.woff': 'font/woff', '.css': 'text/css' }[ext] || 'application/octet-stream' });
    res.end(d);
  });
}).listen(0, async () => {
  const port = server.address().port;
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'] });
  const ctx = await browser.newContext({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  page.on('pageerror', e => console.log('PAGEERR', e.message));
  page.on('console', m => { if (m.type() === 'error') console.log('CONSOLE', m.text()); });
  const q = (process.env.GAME ? '&game=1' : '') + (process.env.TIMING ? `&timing=${process.env.TIMING}` : '');
  await page.goto(`http://127.0.0.1:${port}/${process.env.PAGE || 'index.html'}?s=${scene}${q}`);
  await page.waitForFunction('window.__ready === true', null, { timeout: 60000 });
  const dur = await page.evaluate('window.DURATION');
  const tag = scene + (process.env.GAME ? '-game' : '');
  const dir = path.join(root, 'frames', tag);
  fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const times = only || Array.from({ length: Math.round(dur * fps) }, (_, i) => i / fps);
  const t0 = Date.now();
  for (let i = 0; i < times.length; i++) {
    await page.evaluate(t => window.setT(t), times[i]);
    const name = only ? `t${String(times[i]).replace('.', '_')}.jpg` : String(i + 1).padStart(4, '0') + '.jpg';
    await page.screenshot({ path: path.join(dir, name), type: 'jpeg', quality: 92 });
    if (i % 60 === 0) console.log(`frame ${i}/${times.length} ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  console.log(`done ${times.length} frames in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  await browser.close(); server.close();
  if (!only) {
    const out = path.join(root, 'out', `reel-${tag}.mp4`);
    const audio = process.env.AUDIO ? `-i ${process.env.AUDIO} -map 0:v -map 1:a -c:a aac -b:a 192k -shortest` : '';
    execSync(`ffmpeg -y -loglevel error -framerate ${fps} -i ${dir}/%04d.jpg ${audio} -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -movflags +faststart ${out}`);
    console.log('wrote', out);
  }
});
