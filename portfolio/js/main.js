/**
 * main.js
 * Handles: theme toggle, nav scroll state + mobile menu, scroll-reveal animations,
 * animated stat counters, hero role-text typing rotator, background particle canvas,
 * and scroll progress bar.
 */
(function () {
  const D = PORTFOLIO_DATA;

  // ---------------- Theme toggle ----------------
  const THEME_KEY = "bt-theme";
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  function applyTheme(theme) {
    if (theme === "dark") root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
  }
  let savedTheme = null;
  try { savedTheme = window.__btTheme || null; } catch (e) {}
  // Light is always the default look, regardless of the visitor's system setting —
  // dark mode is available on request via the toggle, but never auto-applied.
  applyTheme(savedTheme || "light");
  themeToggle.addEventListener("click", () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    applyTheme(isDark ? "light" : "dark");
    window.__btTheme = isDark ? "light" : "dark";
  });

  // ---------------- Nav scroll state + mobile menu ----------------
  const nav = document.getElementById("nav");
  const navLinks = document.getElementById("navLinks");
  const burger = document.getElementById("navBurger");
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 20);
    updateProgress();
  }, { passive: true });

  burger.addEventListener("click", () => {
    const open = navLinks.classList.toggle("mobile-open");
    if (open) {
      navLinks.style.cssText = "display:flex;flex-direction:column;position:absolute;top:72px;left:0;right:0;background:var(--card);padding:20px 24px;border-bottom:1px solid var(--border);gap:16px;";
    } else {
      navLinks.style.cssText = "";
    }
  });
  navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    navLinks.classList.remove("mobile-open");
    navLinks.style.cssText = "";
  }));

  // ---------------- Scroll progress bar ----------------
  const progress = document.getElementById("scrollProgress");
  function updateProgress() {
    const h = document.documentElement;
    const scrolled = (h.scrollTop || document.body.scrollTop);
    const height = h.scrollHeight - h.clientHeight;
    progress.style.width = height > 0 ? (scrolled / height * 100) + "%" : "0%";
  }

  // ---------------- Scroll reveal ----------------
  const revealEls = () => document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

  function observeReveals() {
    revealEls().forEach(el => io.observe(el));
  }
  // Delay a tick so render.js has finished injecting markup
  requestAnimationFrame(() => requestAnimationFrame(observeReveals));

  // ---------------- Animated stat counters ----------------
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      animateCount(el);
      statObserver.unobserve(el);
    });
  }, { threshold: 0.4 });

  function initStatCounters() {
    document.querySelectorAll(".stat-value").forEach(el => statObserver.observe(el));
  }
  requestAnimationFrame(() => requestAnimationFrame(initStatCounters));

  function animateCount(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || "";
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      el.textContent = (decimals ? val.toFixed(decimals) : Math.floor(val).toLocaleString()) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = (decimals ? target.toFixed(decimals) : target.toLocaleString()) + suffix;
    }
    requestAnimationFrame(tick);
  }

  // ---------------- Ambient background icons (code / chemistry / CS motifs) ----------------
  // Fixed, full-page layer that drifts continuously behind every section. Confined
  // to the margins outside the content column so movement is visible without ever
  // sitting behind text (CSS hides the whole layer once those margins disappear).
  const bgIcons = document.getElementById("bgIcons");
  if (bgIcons) {
    const ICONS = [
      // code brackets </>
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="8 6 2 12 8 18"/><polyline points="16 6 22 12 16 18"/></svg>`,
      // terminal
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="6 9 10 12 6 15"/><line x1="12" y1="15" x2="16" y2="15"/></svg>`,
      // atom (chemistry)
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/><ellipse cx="12" cy="12" rx="10" ry="4.2"/><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)"/></svg>`,
      // flask (chemistry)
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2h6"/><path d="M10 2v6.2L4.5 18a2 2 0 0 0 1.8 3h11.4a2 2 0 0 0 1.8-3L14 8.2V2"/><path d="M7.5 14h9"/></svg>`,
      // git branch
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="6" cy="18" r="2.2"/><circle cx="18" cy="6" r="2.2"/><path d="M18 8.2A9 9 0 0 1 9.5 15"/></svg>`,
      // cpu / circuit
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="1.5"/><line x1="9" y1="2" x2="9" y2="6"/><line x1="15" y1="2" x2="15" y2="6"/><line x1="9" y1="18" x2="9" y2="22"/><line x1="15" y1="18" x2="15" y2="22"/><line x1="2" y1="9" x2="6" y2="9"/><line x1="2" y1="15" x2="6" y2="15"/><line x1="18" y1="9" x2="22" y2="9"/><line x1="18" y1="15" x2="22" y2="15"/></svg>`,
      // molecule / DNA-ish hex lattice
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4" r="1.6"/><circle cx="5" cy="8.5" r="1.6"/><circle cx="19" cy="8.5" r="1.6"/><circle cx="5" cy="15.5" r="1.6"/><circle cx="19" cy="15.5" r="1.6"/><circle cx="12" cy="20" r="1.6"/><path d="M12 5.6V9M6.3 9.3l4.3.2M17.7 9.3l-4.3.2M6.3 14.7l4.3-.2M17.7 14.7l-4.3-.2M12 15v3.4"/></svg>`,
      // binary
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="7" height="6" rx="1.2"/><rect x="2" y="13" width="7" height="6" rx="1.2"/><path d="M16 5v14M13.5 7.5 16 5l2.5 2.5M13.5 16.5 16 19l2.5-2.5"/></svg>`,
      // database / server stack
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="8" ry="2.6"/><path d="M4 5v6c0 1.4 3.6 2.6 8 2.6s8-1.2 8-2.6V5"/><path d="M4 11v6c0 1.4 3.6 2.6 8 2.6s8-1.2 8-2.6v-6"/></svg>`,
      // neural network / AI node graph
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="4" cy="6" r="1.7"/><circle cx="4" cy="18" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="20" cy="6" r="1.7"/><circle cx="20" cy="18" r="1.7"/><path d="M5.5 7 10.6 11M5.5 17 10.6 13M13.4 11 18.5 7M13.4 13 18.5 17"/></svg>`,
      // hexagon / benzene ring
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M12 2.5 20.5 7.5V16.5L12 21.5 3.5 16.5V7.5Z"/><circle cx="12" cy="12" r="4.2"/></svg>`,
      // bar chart / analytics
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="20" y2="21"/><rect x="5.5" y="13" width="3.4" height="8"/><rect x="10.3" y="8" width="3.4" height="13"/><rect x="15.1" y="4" width="3.4" height="17"/></svg>`,
      // cloud (compute / deployment)
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18h10.5a3.5 3.5 0 0 0 0-7 5.5 5.5 0 0 0-10.6-1.7A4 4 0 0 0 7 18z"/></svg>`,
      // keyboard
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><line x1="6" y1="10" x2="6" y2="10"/><line x1="10" y1="10" x2="10" y2="10"/><line x1="14" y1="10" x2="14" y2="10"/><line x1="18" y1="10" x2="18" y2="10"/><line x1="6" y1="14" x2="18" y2="14"/></svg>`,
      // function / formula (fx)
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3c-2.5 0-3.2 1.6-3.2 4v3M9 21c-2.5 0-3.2-1.6-3.2-4v-3M4 10h6M4 14h6"/><path d="M15 10l5 8M20 10l-5 8"/></svg>`,
      // graduation cap
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8.5 12 4l10 4.5-10 4.5-10-4.5Z"/><path d="M6 10.5v4.6c0 1.5 2.7 2.7 6 2.7s6-1.2 6-2.7v-4.6"/><path d="M21 8.5v6"/></svg>`
    ];
    // Hand-placed in the left/right margins (outside the ~1120px content column)
    // so the drifting motion is visible without ever crossing behind text.
    const PLACEMENTS = [
      { top: "4%",  left: "3%",  size: 26, duration: 16, delay: 0 },
      { top: "12%", right: "4%", size: 22, duration: 19, delay: 2 },
      { top: "21%", left: "5%",  size: 30, duration: 15, delay: 4 },
      { top: "29%", right: "3%", size: 24, duration: 21, delay: 1 },
      { top: "37%", left: "4%",  size: 20, duration: 17, delay: 3 },
      { top: "45%", right: "5%", size: 28, duration: 18, delay: 5 },
      { top: "53%", left: "3%",  size: 22, duration: 20, delay: 2.5 },
      { top: "61%", right: "6%", size: 18, duration: 14, delay: 6 },
      { top: "69%", left: "5%",  size: 26, duration: 16.5, delay: 3.5 },
      { top: "77%", right: "4%", size: 20, duration: 19.5, delay: 1.2 },
      { top: "85%", left: "8%",  size: 18, duration: 13, delay: 5.5 },
      { top: "93%", right: "8%", size: 24, duration: 22, delay: 0.6 },
      { top: "8%",  right: "9%", size: 18, duration: 12.5, delay: 4.8 },
      { top: "33%", left: "9%",  size: 16, duration: 15.5, delay: 2.8 },
      { top: "58%", right: "10%", size: 20, duration: 17.5, delay: 0.3 },
      { top: "89%", right: "3%", size: 18, duration: 20.5, delay: 5.2 }
    ];
    bgIcons.innerHTML = PLACEMENTS.map((pos, i) => {
      const style = [
        `top:${pos.top}`,
        pos.left ? `left:${pos.left}` : `right:${pos.right}`,
        `width:${pos.size}px`,
        `height:${pos.size}px`,
        `animation-duration:${pos.duration}s`,
        `animation-delay:${pos.delay}s`
      ].join(";");
      return `<span class="bg-icon" style="${style}">${ICONS[i % ICONS.length]}</span>`;
    }).join("");
  }

  // ---------------- Hero role rotator ----------------
  const roleEl = document.getElementById("roleText");
  const roles = D.roles;
  let roleIdx = 0, charIdx = 0, deleting = false;
  function typeLoop() {
    const current = roles[roleIdx];
    if (!deleting) {
      charIdx++;
      roleEl.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) {
        deleting = true;
        return setTimeout(typeLoop, 1400);
      }
    } else {
      charIdx--;
      roleEl.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, deleting ? 35 : 55);
  }
  typeLoop();

  // ---------------- Background particle network ----------------
  const canvas = document.getElementById("bg-canvas");
  const ctx = canvas.getContext("2d");
  let particles = [];
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  const COUNT = Math.min(70, Math.floor((window.innerWidth * window.innerHeight) / 22000));
  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.6
    });
  }

  function getAccentColor() {
    const isDark = root.getAttribute("data-theme") === "dark";
    return isDark ? "129,140,248" : "79,70,229";
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const color = getAccentColor();
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 130) {
          ctx.strokeStyle = `rgba(${color},${0.14 * (1 - d / 130)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    particles.forEach(p => {
      ctx.fillStyle = `rgba(${color},0.5)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();

  // ---------------- Nav scroll-spy ----------------
  const sectionIds = ["hero", "about", "experience", "projects", "skills", "education", "certifications", "contact"];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
  const navAnchors = Array.from(navLinks.querySelectorAll("a"));
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = navAnchors.find(a => a.getAttribute("href") === "#" + id);
      if (!link) return;
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove("active"));
        link.classList.add("active");
      }
    });
  }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
  sections.forEach(s => spyObserver.observe(s));

  // ---------------- Tilt + glow on cards (projects, timeline, certs, programs) ----------------
  function initTilt() {
    document.querySelectorAll(".tilt-card").forEach(card => {
      if (card.dataset.tiltBound) return;
      card.dataset.tiltBound = "true";
      const isTouch = window.matchMedia("(hover: none)").matches;
      if (isTouch) return; // skip tilt on touch devices
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const px = (x / rect.width) * 100;
        const py = (y / rect.height) * 100;
        card.style.setProperty("--mx", px + "%");
        card.style.setProperty("--my", py + "%");
        const rotateY = ((x / rect.width) - 0.5) * 8;
        const rotateX = -((y / rect.height) - 0.5) * 8;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }
  requestAnimationFrame(() => requestAnimationFrame(initTilt));
  // Re-scan periodically in case content renders asynchronously later
  setTimeout(initTilt, 800);

  // ---------------- Hero cursor spotlight ----------------
  const heroEl = document.getElementById("hero");
  const spotlightEl = document.getElementById("heroSpotlight");
  if (heroEl && spotlightEl) {
    heroEl.addEventListener("mousemove", (e) => {
      const rect = heroEl.getBoundingClientRect();
      const px = ((e.clientX - rect.left) / rect.width) * 100;
      const py = ((e.clientY - rect.top) / rect.height) * 100;
      spotlightEl.style.setProperty("--mx", px + "%");
      spotlightEl.style.setProperty("--my", py + "%");
    });
  }

  // ---------------- Animated skill proficiency bars ----------------
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const fill = entry.target;
      fill.style.width = fill.dataset.level + "%";
      skillObserver.unobserve(fill);
    });
  }, { threshold: 0.3 });

  function initSkillBars() {
    document.querySelectorAll(".skill-bar-fill").forEach(el => skillObserver.observe(el));
  }
  requestAnimationFrame(() => requestAnimationFrame(initSkillBars));
})();
