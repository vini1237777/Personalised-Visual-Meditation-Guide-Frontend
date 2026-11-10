// How fast each background video starts and how long it freezes while it plays,
// in Chrome over a fixed network speed.
//
//   node perf/background-video/measure.mjs <folder> bg1-small.mp4 bg1-1080p.mp4 ...
//
// Settings: MBPS (10), RTT_MS (60), RUNS (3).
//
// The files come from a local server that paces its bytes to MBPS on one shared
// link, with RTT_MS before each response, so the only difference between runs is
// the file. Chrome's own throttling does not slow localhost reliably, so the
// server does it. Each run uses a fresh browser context with the cache off.
//
// firstFrameMs  page start to the first painted frame
// frozenMs      time the clip took to finish beyond its own length, after the
//               first frame: how long the viewer watched a stuck picture
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const [folder, ...files] = process.argv.slice(2);
if (!folder || !files.length) throw new Error("Pass a folder and at least one file in it");
const MBPS = Number(process.env.MBPS || 10);
const RTT_MS = Number(process.env.RTT_MS || 60);
const RUNS = Number(process.env.RUNS || 3);
const bytesPerMs = (MBPS * 1e6) / 8 / 1000;

let link = 0; // when the shared link is next free

const page = (file) => `<!doctype html><body style="margin:0">
<video id="v" muted autoplay playsinline style="width:100vw" src="/v/${encodeURIComponent(file)}"></video>
<script>
  const v = document.getElementById("v");
  v.requestVideoFrameCallback(() => (window.firstFrame = performance.now()));
  v.addEventListener("ended", () => (window.ended = performance.now()));
</script></body>`;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://local");
  if (url.pathname === "/page") {
    res.writeHead(200, { "content-type": "text/html", "cache-control": "no-store" });
    return res.end(page(url.searchParams.get("f")));
  }
  if (!url.pathname.startsWith("/v/")) {
    res.writeHead(404);
    return res.end();
  }
  const file = path.join(folder, path.basename(decodeURIComponent(url.pathname.slice(3))));
  const size = fs.statSync(file).size;
  const range = /bytes=(\d*)-(\d*)/.exec(req.headers.range || "");
  let start = 0;
  let end = size - 1;
  if (range) {
    if (range[1] === "") start = size - Number(range[2]);
    else {
      start = Number(range[1]);
      if (range[2]) end = Number(range[2]);
    }
  }
  res.writeHead(range ? 206 : 200, {
    "content-type": "video/mp4",
    "accept-ranges": "bytes",
    "content-length": end - start + 1,
    "cache-control": "no-store",
    ...(range ? { "content-range": `bytes ${start}-${end}/${size}` } : {}),
  });

  const began = Date.now() + RTT_MS;
  let last = began;
  const stream = fs.createReadStream(file, { start, end, highWaterMark: 16 * 1024 });
  stream.on("data", (chunk) => {
    stream.pause();
    link = Math.max(link, began) + chunk.length / bytesPerMs;
    last = link;
    setTimeout(() => {
      if (res.destroyed) {
        link = Date.now();
        return stream.destroy();
      }
      res.write(chunk);
      stream.resume();
    }, Math.max(0, link - Date.now()));
  });
  stream.on("end", () => setTimeout(() => res.end(), Math.max(0, last - Date.now())));
  req.on("close", () => stream.destroy());
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ channel: "chrome" });

const runs = [];
for (let run = 1; run <= RUNS; run++) {
  for (const file of files) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const tab = await context.newPage();
    const cdp = await context.newCDPSession(tab);
    await cdp.send("Network.enable");
    await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
    link = 0;
    await tab.goto(`${base}/page?f=${encodeURIComponent(file)}`);
    await tab.waitForFunction(() => window.ended, null, { timeout: 300_000, polling: 100 });
    const m = await tab.evaluate(() => ({
      firstFrame: window.firstFrame,
      ended: window.ended,
      duration: document.getElementById("v").duration * 1000,
    }));
    const row = {
      file,
      run,
      bytes: fs.statSync(path.join(folder, file)).size,
      firstFrameMs: Math.round(m.firstFrame),
      frozenMs: Math.max(0, Math.round(m.ended - m.firstFrame - m.duration)),
      clipMs: Math.round(m.duration),
    };
    runs.push(row);
    console.log(JSON.stringify(row));
    await context.close();
  }
}
const chrome = browser.version();
await browser.close();
server.close();

const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];
const summary = files.map((file) => {
  const rows = runs.filter((r) => r.file === file);
  return {
    file,
    megabytes: Number((rows[0].bytes / 1e6).toFixed(1)),
    clipSeconds: Number((rows[0].clipMs / 1000).toFixed(1)),
    medianFirstFrameMs: median(rows.map((r) => r.firstFrameMs)),
    medianFrozenMs: median(rows.map((r) => r.frozenMs)),
  };
});
console.table(summary);

const out = path.join(import.meta.dirname, `results-${MBPS}mbps.json`);
fs.writeFileSync(
  out,
  JSON.stringify(
    {
      date: new Date().toISOString(),
      network: { mbps: MBPS, rttMs: RTT_MS, pacedBy: "local server, one shared link" },
      browser: `Chrome ${chrome}`,
      runsPerFile: RUNS,
      summary,
      runs,
    },
    null,
    2,
  ),
);
console.log(`Saved ${path.relative(process.cwd(), out)}`);
