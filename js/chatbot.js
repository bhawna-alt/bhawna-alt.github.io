/**
 * chatbot.js
 * Two-tier AI assistant:
 *   1) If CHAT_API_ENDPOINT is configured and reachable, messages are sent to a
 *      serverless backend (see /api/chat.js) which calls a real LLM (Claude).
 *   2) Otherwise, falls back to a local, resume-grounded Q&A engine so the widget
 *      always works out of the box on static hosting like GitHub Pages.
 *
 * TO ENABLE THE REAL LLM BACKEND:
 *   1. Deploy /api/chat.js as a Vercel serverless function (see README.md).
 *   2. Set CHAT_API_ENDPOINT below to your deployed endpoint URL.
 */
(function () {
  const D = PORTFOLIO_DATA;

  // ---- Configure your live backend endpoint here once deployed ----
  const CHAT_API_ENDPOINT = ""; // e.g. "https://your-app.vercel.app/api/chat"

  const widget = document.getElementById("chatWidget");
  const toggle = document.getElementById("chatToggle");
  const panel = document.getElementById("chatPanel");
  const messagesEl = document.getElementById("chatMessages");
  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatInput");
  const suggestionsEl = document.getElementById("chatSuggestions");
  const statusEl = document.getElementById("chatStatus");

  const SUGGESTIONS = [
    "Tell me about your Breakthrough Tech fellowship",
    "What's the ICons program?",
    "What are your top skills?",
    "Tell me about MinuteCal",
    "What's your GPA?",
    "How can I contact you?"
  ];

  let history = []; // { role: 'user'|'assistant', content: string }
  let backendAvailable = null; // null = unknown, true/false once tested

  function init() {
    addBotMessage(
      `Hi! I'm an AI assistant trained on Bhawna's background. Ask me about her projects, research, skills, or experience — or use a suggestion below.`
    );
    renderSuggestions();
    setStatus(CHAT_API_ENDPOINT ? "Connecting…" : "Online (offline demo mode)");
    scheduleGreetingBubble();
  }

  // Proactively invite recruiters/visitors to engage with the assistant
  function scheduleGreetingBubble() {
    let shown = false;
    const timer = setTimeout(() => {
      if (widget.classList.contains("open") || shown) return;
      shown = true;
      const bubble = document.createElement("div");
      bubble.className = "chat-greeting";
      bubble.id = "chatGreetingBubble";
      bubble.textContent = "👋 Hiring? Ask me anything about Bhawna!";
      widget.appendChild(bubble);
      const dismiss = () => bubble.remove();
      bubble.addEventListener("click", () => { toggle.click(); dismiss(); });
      setTimeout(dismiss, 9000);
    }, 3500);
    toggle.addEventListener("click", () => {
      clearTimeout(timer);
      const existing = document.getElementById("chatGreetingBubble");
      if (existing) existing.remove();
    }, { once: true });
  }

  function renderSuggestions() {
    suggestionsEl.innerHTML = "";
    SUGGESTIONS.forEach(q => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chat-suggestion-btn";
      btn.textContent = q;
      btn.addEventListener("click", () => sendMessage(q));
      suggestionsEl.appendChild(btn);
    });
  }

  function setStatus(text) {
    statusEl.innerHTML = `<span class="status-dot"></span> ${text}`;
  }

  toggle.addEventListener("click", () => {
    widget.classList.toggle("open");
    if (widget.classList.contains("open")) setTimeout(() => input.focus(), 260);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    sendMessage(text);
  });

  function addBotMessage(text) {
    const div = document.createElement("div");
    div.className = "chat-bubble bot";
    div.textContent = text;
    messagesEl.appendChild(div);
    scrollToBottom();
    history.push({ role: "assistant", content: text });
  }

  function addUserMessage(text) {
    const div = document.createElement("div");
    div.className = "chat-bubble user";
    div.textContent = text;
    messagesEl.appendChild(div);
    scrollToBottom();
    history.push({ role: "user", content: text });
  }

  function showTyping() {
    const div = document.createElement("div");
    div.className = "chat-bubble bot typing";
    div.id = "typingIndicator";
    div.innerHTML = "<span></span><span></span><span></span>";
    messagesEl.appendChild(div);
    scrollToBottom();
  }

  function hideTyping() {
    const el = document.getElementById("typingIndicator");
    if (el) el.remove();
  }

  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  async function sendMessage(text) {
    addUserMessage(text);
    showTyping();

    // Try real backend first (if configured and not already known to be down)
    if (CHAT_API_ENDPOINT && backendAvailable !== false) {
      try {
        const reply = await queryBackend(text);
        hideTyping();
        backendAvailable = true;
        setStatus("Online · Claude-powered");
        addBotMessage(reply);
        return;
      } catch (err) {
        backendAvailable = false;
        setStatus("Online (offline demo mode)");
        // fall through to local engine
      }
    }

    // Local fallback engine
    setTimeout(() => {
      hideTyping();
      const reply = localAnswer(text);
      addBotMessage(reply);
    }, 500 + Math.random() * 400);
  }

  async function queryBackend(message) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const res = await fetch(CHAT_API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history: history.slice(-10) }),
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error("Backend error " + res.status);
    const data = await res.json();
    if (!data || !data.reply) throw new Error("Malformed backend response");
    return data.reply;
  }

  // ---------------- Local, resume-grounded Q&A engine ----------------
  function localAnswer(raw) {
    const q = raw.toLowerCase();

    if (/breakthrough|cornell ai|ai studio|fellowship/.test(q)) {
      const prog = (D.programs || []).find(p => p.name.includes("Breakthrough"));
      if (prog) return `${prog.name} — ${prog.description} ${prog.highlights[0]}`;
    }
    if (/icons|future of work|interdisciplinary/.test(q)) {
      const prog = (D.programs || []).find(p => p.name.includes("ICons"));
      if (prog) return `${prog.name} — ${prog.description}`;
    }
    if (/certificat|credential/.test(q)) {
      const certs = (D.certifications || []).map(c => c.name).join(", ");
      return `Bhawna's certifications & programs: ${certs}. Ask me about any one of them for more detail!`;
    }
    if (/contact|email|reach|hire|linkedin|connect/.test(q)) {
      return `You can reach Bhawna at ${D.email} or connect on LinkedIn (${D.links.linkedin}). She's currently open to AI/ML and software engineering internships.`;
    }
    if (/gpa|grade|transcript|academic/.test(q)) {
      return `Bhawna's cumulative GPA is ${D.education.gpa.toFixed(2)}, with Dean's List honors every term (Fall '24 through Spring '26) and the Chancellor's Award. Her strongest term GPA was a 4.0 in Spring 2025.`;
    }
    if (/education|school|university|major|degree|umass/.test(q)) {
      return `Bhawna is pursuing a ${D.education.degree} at ${D.education.school} (${D.education.college}), expected ${D.education.graduation}. ${D.education.thesis}`;
    }
    if (/skill|tech stack|language|framework|tool/.test(q)) {
      const cats = Object.entries(D.skills).map(([k, v]) => `${k}: ${v.slice(0, 5).join(", ")}`).join(" · ");
      return `Bhawna's core toolbox spans ${cats}.`;
    }
    if (/minutecal/.test(q)) {
      const p = D.projects.find(p => p.name === "MinuteCal");
      return `${p.name} — ${p.description} Built with ${p.stack.join(", ")}.`;
    }
    if (/airbnb/.test(q)) {
      const p = D.projects.find(p => p.name === "Airbnb Price Prediction");
      return `${p.name} — ${p.description} Built with ${p.stack.join(", ")}.`;
    }
    if (/stock/.test(q)) {
      const p = D.projects.find(p => p.name === "Stock Dashboard");
      return `${p.name} — ${p.description} Built with ${p.stack.join(", ")}.`;
    }
    if (/empathy|hackumass|hackathon/.test(q)) {
      const p = D.projects.find(p => p.name === "Digital Empathy Coach");
      return `${p.name} — ${p.description} Built with ${p.stack.join(", ")}.`;
    }
    if (/project/.test(q)) {
      return `Bhawna's featured projects: ${D.projects.map(p => p.name).join(", ")}. Ask me about any one of them for details!`;
    }
    if (/research|thesis|molecul|chemistry|auerbach|graph/.test(q)) {
      const exp = D.experience.find(e => e.org.includes("Auerbach"));
      return `Bhawna does undergraduate research with Prof. Scott Auerbach on Machine Learning & Graph Analysis: ${exp.points.join(" ")}`;
    }
    if (/experience|work|job|fellowship|breakthrough|cornell|codepath/.test(q)) {
      return `Bhawna's experience includes: ${D.experience.map(e => `${e.role} at ${e.org} (${e.period})`).join("; ")}.`;
    }
    if (/hindu yuva|yuva|sewa/.test(q)) {
      return `Bhawna has been a member of Hindu YUVA (Youth for Unity, Virtues, and Action) since Fall 2024. She takes part in campus cultural and spiritual celebrations like Diwali, Holi, Navratri, and Ganesh Chaturthi, community service (Sewa) initiatives, and personal development sessions on meditation, yoga, and team-building.`;
    }
    if (/leadership|club|cicsoft|mentor/.test(q)) {
      return `Bhawna mentors 15-20 first-year students per month at UMass Residential Life (240+ students cumulatively since July 2025), is an active member of CICSoft (the Computer Science Club, contributing 5+ pull requests on collaborative projects), and has been part of Hindu YUVA since Fall 2024, engaging in cultural celebrations, community service, and personal development programming.`;
    }
    if (/who are you|what are you|about you|bhawna\b/.test(q)) {
      return D.about.replace(/\s+/g, " ").trim();
    }
    if (/hello|hi|hey/.test(q)) {
      return "Hello! I'm here to answer questions about Bhawna's background — try asking about her projects, research, skills, or how to get in touch.";
    }

    return "That's a great question! I'm running in offline demo mode right now, so my answers are limited to Bhawna's resume data — try asking about her projects, skills, research, education, or contact info. For anything else, feel free to email her directly at " + D.email + ".";
  }

  // ---------------- Live chat handoff (Tawk.to) ----------------
  // Opens the real, human live-chat widget (see the Tawk.to script near the end
  // of index.html) from a button inside this AI panel, and reflects Bhawna's
  // real online/offline status once Tawk has loaded.
  function initLiveChat() {
    const liveBar = document.getElementById("chatLiveBar");
    const liveDot = document.getElementById("chatLiveDot");
    const liveLabel = document.getElementById("chatLiveLabel");
    if (!liveBar) return;

    liveBar.addEventListener("click", () => {
      if (window.Tawk_API && typeof Tawk_API.maximize === "function") {
        Tawk_API.showWidget();
        Tawk_API.maximize();
      } else {
        // Tawk hasn't loaded yet (slow connection, ad-blocker, or not configured) —
        // fall back to email so the visitor is never stuck.
        window.location.href = "mailto:" + D.email + "?subject=Let's chat!";
      }
    });

    function reflectStatus() {
      if (!window.Tawk_API || typeof Tawk_API.getStatus !== "function") return;
      const status = Tawk_API.getStatus(); // 'online' | 'away' | 'offline'
      if (status === "online") {
        liveDot.classList.add("online");
        liveLabel.textContent = "I'm online — chat with me now";
      } else {
        liveDot.classList.remove("online");
        liveLabel.textContent = "Leave me a message";
      }
    }

    // Poll briefly for Tawk_API to finish loading, then check status live
    let attempts = 0;
    const poll = setInterval(() => {
      attempts++;
      if (window.Tawk_API && typeof Tawk_API.getStatus === "function") {
        reflectStatus();
        if (typeof Tawk_API.onStatusChange !== "undefined") {
          Tawk_API.onStatusChange = reflectStatus;
        }
        clearInterval(poll);
      } else if (attempts > 20) {
        clearInterval(poll); // give up after ~10s; button still works via fallback
      }
    }, 500);
  }

  init();
  initLiveChat();
})();
