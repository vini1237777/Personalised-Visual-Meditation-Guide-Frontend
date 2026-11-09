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

## Deployment

A push to `main` runs GitHub Actions, which builds the app and copies it to EC2, where Nginx serves it.

## Related

[SoulSync Backend](https://github.com/vini1237777/Personalised-Visual-Meditation-Guide-Backend)

## License

MIT
