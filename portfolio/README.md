# Bhawna Teerth — Portfolio

A modern, animated personal portfolio with a Claude-powered AI chat assistant.

- **Frontend:** plain HTML/CSS/JS (no build step, no framework lock-in) — deploys instantly to GitHub Pages.
- **Chatbot:** works out of the box in an offline "demo mode" (answers questions using your resume data, client-side). For a **real LLM-powered chatbot**, deploy the included serverless function to Vercel and connect it — takes about 5 minutes.

---

## 1. Preview it locally

No build tools needed — just open `index.html` in your browser, or run a tiny local server:

```bash
cd portfolio
python3 -m http.server 8000
# then visit http://localhost:8000
```

---

## 2. Deploy the site to GitHub Pages (free, permanent link)

1. Create a new GitHub repository (or reuse `bhawna-alt.github.io` if you want it at the root of your existing Pages site).
2. From inside this `portfolio` folder, run:

   ```bash
   git init
   git add .
   git commit -m "Launch new portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```

3. On GitHub: go to your repo → **Settings → Pages** → under "Build and deployment", set **Source = Deploy from a branch**, **Branch = main / (root)** → Save.
4. Your site will be live within a minute or two at:
   - `https://<your-username>.github.io/<your-repo>/` (or `https://bhawna-alt.github.io/` if using your existing user-page repo).

> Note: if you reuse `bhawna-alt.github.io`, copy the **contents** of this `portfolio` folder (not the folder itself) into the root of that repo, replacing the old files.

---

## 3. (Optional but recommended) Enable the real LLM chatbot

GitHub Pages only serves static files, so it can't run the AI backend directly. The chatbot already works without this step (in local "offline demo mode"), but to make it a genuine LLM-powered assistant:

1. **Get an Anthropic API key** at [console.anthropic.com](https://console.anthropic.com) (you'll need your own account and billing — Claude API usage is pay-as-you-go with a generous free trial credit for new accounts).
2. **Deploy this whole `portfolio` folder to [Vercel](https://vercel.com)** (free tier):
   - Push this folder to a GitHub repo (see step 2 above, or a separate repo).
   - Go to vercel.com → **Add New Project** → import that GitHub repo → Deploy. Vercel will automatically detect `api/chat.js` as a serverless function and serve `index.html` and friends as static files — no configuration needed.
3. In the Vercel dashboard: **Project → Settings → Environment Variables** → add:
   - `ANTHROPIC_API_KEY` = *(paste your key)*
   - Redeploy the project so the new variable takes effect.
4. Open `js/chatbot.js` in this project and set:

   ```js
   const CHAT_API_ENDPOINT = "https://<your-vercel-project>.vercel.app/api/chat";
   ```

5. Commit and push that one-line change to wherever your **frontend** is hosted (GitHub Pages, Vercel, or both). The chat widget will now call your live Claude-powered backend — and will automatically fall back to offline demo mode if the backend is ever unreachable.

You control your own API key and billing directly with Anthropic; this project never transmits your key anywhere except from your own serverless function straight to Anthropic's API.

---

## 4. Project structure

```
portfolio/
├── index.html          # Page markup (all sections)
├── css/styles.css       # Theme, layout, animations, dark mode
├── js/
│   ├── data.js          # All resume/profile content — edit this to update copy
│   ├── render.js         # Renders data.js into the DOM (projects, experience, etc.)
│   ├── main.js            # Nav, scroll reveal, counters, particle background, theme toggle
│   └── chatbot.js         # Chat widget UI + offline fallback + backend integration
├── api/chat.js           # Vercel serverless function — real Claude-powered chatbot
├── package.json
└── README.md
```

To update your content (new project, new job, GPA, etc.), edit **`js/data.js`** only — everything else renders automatically from it.

---

## 5. Viewing in Chrome

Once deployed (GitHub Pages or Vercel), just open the live URL in Chrome — no extra setup needed. For local preview before deploying, use the local server command in step 1 and open `http://localhost:8000` in Chrome.
