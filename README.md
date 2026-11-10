# SoulSync Frontend

SoulSync is a meditation app. You pick how you feel on a mood wheel, and it plays a calming video made for that mood, then lets you check out and keep a journal of your sessions.

**Live:** [meditateaurelia.fit](https://www.meditateaurelia.fit)
**Backend repo:** [Personalised-Visual-Meditation-Guide-Backend](https://github.com/vini1237777/Personalised-Visual-Meditation-Guide-Backend)

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19, TypeScript, Create React App |
| Styling | CSS Modules |
| Auth | JWT issued by the backend |
| Media | CloudFront |
| CI/CD | GitHub Actions |
| Hosting | AWS EC2 with Nginx |

## Features

- Mood selector with original faces and an emotion wheel
- Generated sessions: the backend writes a script with OpenAI and makes the video with Veo through the Gemini API
- A demo mode that plays saved clips matched to your mood while live generation is paused
- Check out reflections and a journal with list, card and calendar views, stored in the browser
- Log in and sign up with JWT

## Architecture

```
React app -> Express API -> MongoDB
                |
                +-> OpenAI (script)
                +-> Gemini API, Veo (video)

Background and demo videos: CloudFront -> React app
```

## Local setup

```bash
npm install
npm start
```

Create a `.env.local` file:

```
REACT_APP_API=http://localhost:3000
```

## Benchmarks & Architecture Verification

| Claim | Code | Evidence |
|---|---|---|
| Waiting for long running generation jobs | [waitForJob.ts](src/features/landing/mood/lib/waitForJob.ts) | [unit tests](src/features/landing/mood/lib/waitForJob.test.ts) |
| Background video through CloudFront | [videoUrls.ts](src/assets/bg-videos/videoUrls.ts) | Set the address with `REACT_APP_CDN_URL` |
| 1080p background videos, 72% smaller with no playback freezes | [encode.sh](perf/background-video/encode.sh) | [measure.mjs](perf/background-video/measure.mjs), [raw results](perf/background-video/results-10mbps.json), table below |
| GitHub Actions build and deploy | [deploy-frontend.yml](.github/workflows/deploy-frontend.yml) | Workflow runs on this repo |

### Background video

The four background videos are 1080p H.264 with the index at the front of each file, made with [encode.sh](perf/background-video/encode.sh). Together they weigh 85.4 MB, down from 301.5 MB for the 4K files they replace.

[measure.mjs](perf/background-video/measure.mjs) plays each file in Chrome from a local server paced to 10 Mbps with a 60 ms round trip, 3 runs per file, and records the median. "Frozen" is how much longer than its own length the clip took to finish after its first frame.

| Video | Clip | 4K file | 1080p file | First frame, 4K to 1080p | Frozen, 4K to 1080p |
|---|---|---|---|---|---|
| bg1 | 14.5 s | 82.8 MB | 15.2 MB | 947 ms to 497 ms | 51.2 s to 0.05 s |
| bg2 | 12.3 s | 23.6 MB | 2.0 MB | 640 ms to 203 ms | 6.3 s to 0.01 s |
| bg3 | 49.2 s | 130.6 MB | 49.9 MB | 1,057 ms to 706 ms | 54.8 s to 0.09 s |
| bg4 | 48.4 s | 64.5 MB | 18.3 MB | 478 ms to 249 ms | 4.6 s to 0.03 s |

Quality was checked with SSIM over the first 10 seconds, against the 4K files scaled to 1080p: 0.97 for bg2, 0.97 for bg3, 0.96 for bg4 and 0.93 for bg1, whose fast river was also compared by eye on crops of the water. These are local numbers on an Apple M2; real networks vary.

## Deployment

A push to `main` runs GitHub Actions, which builds the app and copies it to EC2, where Nginx serves it.

## Related

[SoulSync Backend](https://github.com/vini1237777/Personalised-Visual-Meditation-Guide-Backend)

## License

MIT
