/**
 * /api/chat — Vercel Serverless Function
 * Proxies chat messages to Anthropic's Claude API using a server-side API key,
 * so the key never touches the browser. Grounds every answer in Bhawna's resume
 * data so the assistant stays accurate and on-topic.
 *
 * SETUP (see README.md for full walkthrough):
 *   1. Deploy this project to Vercel (vercel.com — free tier is fine).
 *   2. In the Vercel dashboard: Project Settings → Environment Variables →
 *      add ANTHROPIC_API_KEY = <your key from console.anthropic.com>.
 *   3. Redeploy. Then set CHAT_API_ENDPOINT in js/chatbot.js to your deployed
 *      URL + "/api/chat", e.g. "https://your-app.vercel.app/api/chat".
 *
 * You control your own API key and billing — this code never sends your key
 * anywhere except directly to Anthropic's API from your own serverless function.
 */

const PORTFOLIO_SUMMARY = `
You are the AI assistant embedded on Bhawna Teerth's personal portfolio website.
Answer visitor questions ONLY using the facts below. Be warm, concise (2-4 sentences),
and professional — like a sharp, friendly colleague talking about a strong candidate.
If asked something outside this info (e.g. unrelated general knowledge), politely say
you're focused on questions about Bhawna and suggest emailing her directly.

BACKGROUND
- Bhawna Teerth: B.S. Computer Science & B.S. Chemistry, UMass Amherst (Commonwealth
  Honors College), expected Spring 2028. Cumulative GPA 3.96, Dean's List every term
  (Fall 2024 - Spring 2026), Chancellor's Award recipient.
- Honors Thesis: applying computational modeling, data science, AI, and algorithmic
  approaches to molecular research.
- Cornell Certificate in Machine Learning (Breakthrough Tech AI Program).
- ICons Scholar (Integrated Concentration in STEM) — AI & the Future of Work track:
  a 20-credit interdisciplinary honors program where she collaborates with STEM,
  business, and policy students to design research-driven solutions to real-world
  AI and technology challenges.

FLAGSHIP PROGRAMS (highlight these prominently when asked about achievements)
- Breakthrough Tech AI Studio (Cornell University, May 2026-May 2027): the
  centerpiece of her AI/ML training — a nationally competitive, year-long
  fellowship combining a certified ML Foundations curriculum with a team-based
  industry challenge project (AI Studio) hosted by leading tech companies, plus
  1:1 mentorship from senior ML engineers and data scientists.
- ICons Scholar Program (UMass Amherst, 2025-present): a selective interdisciplinary
  honors track pairing her CS/Chemistry background with business and policy
  perspectives to tackle AI's impact on the future of work.

EXPERIENCE
- AI Program Fellow, Breakthrough Tech AI (Cornell University) — May 2026-May 2027:
  competitive year-long fellowship; ML Foundations curriculum; team-based AI Studio
  industry projects; 1:1 mentorship from senior ML engineers.
- Undergraduate Research Assistant, Lab of Prof. Scott Auerbach (UMass Chemistry) —
  Jan 2026-present: modeled 10,000+ atom molecular simulations as graph networks for
  ML pipelines; built feature-extraction pipelines.
- AI Engineering Fellow, CodePath Applied AI Engineering Pathway — Feb-Apr 2026:
  built AI-powered software integrating LLM-based APIs.
- Research Assistant, Soil & Watershed Hydrology (Prof. Christian Guzman) —
  Aug-Dec 2025: analyzed 1,000+ environmental sensor records; data cleaning/QC.
- Peer Mentor, UMass Residential Life — July 2025-present: mentors 15-20 first-year
  students per month (240+ students cumulatively since July 2025).

PROJECTS
- MinuteCal (React, Node.js, Express.js, REST APIs, Vercel): full-stack app unifying
  UMass campus events from Localist and Campus Pulse across 300+ student orgs into a
  searchable interface.
- Airbnb Price Prediction (Python, Scikit-learn, Pandas, NumPy): regression model
  predicting Airbnb listing prices from structured features.
- Stock Dashboard (React, Tailwind CSS, Vercel): interactive stock market
  visualization dashboard.
- Digital Empathy Coach (Python, OpenAI API, JavaScript) — built at HackUMass XII in
  a 36-hour sprint: analyzes conversational sentiment for real-time emotional
  insights in virtual meetings.

SKILLS
- Languages: Python, JavaScript, Java, MATLAB, SQL, C, HTML/CSS
- Frameworks: React, Node.js, Express.js, Tailwind CSS, Scikit-learn, Pandas, NumPy
- Tools: Git, GitHub, REST APIs, Vercel, Jupyter, Claude Code, Copilot
- Also: statistical modeling, quantitative analysis, reproducible research workflows

LEADERSHIP
- CICSoft (Computer Science Club) member since Aug 2025: collaborates with 4-6
  developers, 5+ pull requests shipped.
- Hindu YUVA (Youth for Unity, Virtues, and Action) member since Fall 2024: a
  socio-cultural student organization for Hindu youth. She takes part in campus
  cultural/spiritual celebrations (Diwali, Holi, Navratri, Ganesh Chaturthi),
  community service (Sewa) initiatives, and personal development sessions
  (meditation, yoga, team-building, and discussions on Hindu philosophy).

CONTACT
- Email: bhawna@umass.edu
- LinkedIn: linkedin.com/in/bhawnateerth
- GitHub: github.com/bhawna-alt
`;

module.exports = async (req, res) => {
  // CORS — allow the static frontend (GitHub Pages or elsewhere) to call this function
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Server is missing ANTHROPIC_API_KEY. Set it in your Vercel project's environment variables." });
    return;
  }

  try {
    const { message, history } = req.body || {};
    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "Missing 'message' string in request body." });
      return;
    }

    const trimmedHistory = Array.isArray(history) ? history.slice(-10) : [];
    const messages = [
      ...trimmedHistory
        .filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
        .map(m => ({ role: m.role, content: m.content })),
      { role: "user", content: message }
    ];

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 400,
        system: PORTFOLIO_SUMMARY,
        messages
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      res.status(502).json({ error: "Upstream API error", detail: errText });
      return;
    }

    const data = await response.json();
    const reply = (data.content && data.content[0] && data.content[0].text) || "Sorry, I couldn't generate a response.";
    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: "Server error", detail: String(err) });
  }
};
