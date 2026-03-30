# SoulSync — AI-Enabled Meditation Platform (Frontend)

SoulSync is a personalized meditation platform that uses AI to generate guided meditation sessions tailored to your mood, goals, and experience level.

**Live:** [meditateaurelia.fit](https://www.meditateaurelia.fit)  
**Backend repo:** [Personalised-Visual-Meditation-Guide-Backend](https://github.com/vini1237777/Personalised-Visual-Meditation-Guide-Backend)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React.js, TypeScript |
| Build Tool | Vite |
| Styling | CSS |
| State | Context API |
| Auth | JWT-based (handled by backend) |
| CI/CD | GitHub Actions |
| Hosting | AWS EC2 (Nginx + PM2) |
| Media CDN | AWS S3 + CloudFront |

---

## Features

- **AI-powered meditation sessions** — personalized guided meditations generated via Gemini APIs
- **Visual meditation guides** — immersive audio-visual meditation experiences
- **User authentication** — JWT-based login/signup with role-based access control
- **Responsive design** — optimized for mobile and desktop
- **Fast media delivery** — page loads cut from 5s+ to under 1s using S3 + CloudFront with lazy loading

---

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   React UI  │────▶│  Express API │────▶│   MongoDB   │
│  (Vite/TS)  │     │  (Node.js)   │     │             │
└─────────────┘     └──────┬───────┘     └─────────────┘
                           │
                    ┌──────▼───────┐
                    │  Gemini API  │
                    │  (LangChain) │
                    └──────────────┘

Media: AWS S3 → CloudFront CDN → Client
```

---

## Performance

| Metric | Before | After |
|--------|--------|-------|
| Page load (media) | ~5s | < 1s |

Achieved via S3 + CloudFront CDN, video compression, and lazy loading.

---

## Local Setup

```bash
git clone https://github.com/vini1237777/Personalised-Visual-Meditation-Guide-Frontend.git
cd Personalised-Visual-Meditation-Guide-Frontend
npm install
```

Create a `.env` file:
```
VITE_API_URL=http://localhost:5000
```

```bash
npm run dev
```

---

## Deployment

Deployed on **AWS EC2** with Nginx reverse proxy and PM2 process manager. CI/CD pipeline via **GitHub Actions** automatically builds and deploys on push to `main`.

---

## Related

- [SoulSync Backend](https://github.com/vini1237777/Personalised-Visual-Meditation-Guide-Backend)

## License

MIT
