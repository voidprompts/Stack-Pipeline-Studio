<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: 

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

---

## 🤖 12-Hour Autonomous Autopilot Engine

StackPipeline includes a hands-off, automated publishing engine configured via **GitHub Actions** (`.github/workflows/autopilot.yml`):

- **Cadence**: Automatically runs every 12 hours (`0 */12 * * *`).
- **Matrix Pool**: Pulls high-intent B2B SaaS targets (Integrations, Head-to-Head Comparisons, and Alternatives Hubs).
- **Quality & E-E-A-T**: Programmatically generates step-by-step implementation checklists, multi-language code snippets (cURL, TypeScript, Python), comparative architectural latency benchmarks, and Schema.org HowTo/FAQ structured data.
- **Static Cloudflare Deployment**: The GitHub Action commits new articles to `src/data/generatedAutopilotContent.json` and pushes directly to `main`, triggering an automatic instant rebuild on Cloudflare Pages.

### Manual Trigger / Test CLI:
```bash
npm run autopilot:generate
```

### Push to GitHub:
```bash
git remote add origin https://github.com/<YOUR_GITHUB_USER>/<YOUR_REPO_NAME>.git
git add .
git commit -m "feat: setup 12-hour autonomous publishing engine"
git branch -M main
git push -u origin main
```

