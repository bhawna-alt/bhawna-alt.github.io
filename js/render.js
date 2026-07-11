/**
 * render.js
 * Populates the DOM from PORTFOLIO_DATA (data.js). Keeping content data-driven
 * makes it easy to update the site later without touching markup.
 */
(function () {
  const D = PORTFOLIO_DATA;

  // ---- Hero ----
  document.getElementById("heroTagline").textContent = D.tagline;
  const heroLinks = document.getElementById("heroLinks");
  heroLinks.innerHTML = `
    <a href="${D.links.github}" target="_blank" rel="noopener" title="GitHub">${icon("github")}</a>
    <a href="${D.links.linkedin}" target="_blank" rel="noopener" title="LinkedIn">${icon("linkedin")}</a>
    <a href="mailto:${D.email}" title="Email">${icon("mail")}</a>
  `;

  // ---- Stats ----
  const statsStrip = document.getElementById("statsStrip");
  statsStrip.innerHTML = D.stats.map((s, i) => `
    <div class="stat-item reveal" style="transition-delay:${i * 60}ms">
      <div class="stat-value" data-target="${s.value}" data-suffix="${s.suffix}" data-decimals="${s.decimals || 0}">0</div>
      <div class="stat-label">${s.label}</div>
    </div>
  `).join("");

  // ---- About ----
  document.getElementById("aboutText").textContent = D.about.replace(/\s+/g, " ").trim();
  document.getElementById("aboutLocation").textContent = D.location;

  // ---- Experience timeline ----
  const timeline = document.getElementById("timeline");
  timeline.innerHTML = D.experience.map((e, i) => `
    <div class="timeline-item reveal" style="transition-delay:${i * 70}ms">
      <div class="timeline-dot"></div>
      <div class="timeline-card tilt-card">
        <div class="timeline-header">
          <div>
            <div class="timeline-role">${e.role}</div>
            <div class="timeline-org">${e.org}</div>
          </div>
          <div class="timeline-period">${e.period}</div>
        </div>
        <ul class="timeline-points">
          ${e.points.map(p => `<li>${p}</li>`).join("")}
        </ul>
      </div>
    </div>
  `).join("");

  // ---- Program spotlight (Breakthrough Tech AI / ICons) ----
  const programSpotlight = document.getElementById("programSpotlight");
  if (programSpotlight && D.programs) {
    programSpotlight.innerHTML = D.programs.map((p, i) => `
      <div class="program-card reveal tilt-card" style="transition-delay:${i * 90}ms">
        <span class="program-badge">${p.badge}</span>
        <div class="program-name">${p.name}</div>
        <div class="program-org">${p.org}</div>
        <div class="program-period">${p.period} · ${p.tagline}</div>
        <p class="program-desc">${p.description}</p>
        <ul class="program-highlights">
          ${p.highlights.map(h => `<li>${h}</li>`).join("")}
        </ul>
        <div class="program-tags tag-row">
          ${p.stack.map(t => `<span class="tag">${t}</span>`).join("")}
        </div>
      </div>
    `).join("");
  }

  // ---- Projects ----
  const projectGrid = document.getElementById("projectGrid");
  projectGrid.innerHTML = D.projects.map((p, i) => `
    <div class="project-card tilt-card reveal ${p.featured ? "featured" : ""}" style="transition-delay:${i * 70}ms">
      ${p.featured ? '<span class="featured-badge">Featured</span>' : ""}
      ${p.tagline ? `<div class="project-tagline">${p.tagline}</div>` : ""}
      <div class="project-name">${p.name}</div>
      <p class="project-desc">${p.description}</p>
      <ul class="project-highlights">
        ${p.highlights.map(h => `<li>${h}</li>`).join("")}
      </ul>
      <div class="tag-row">
        ${p.stack.map(t => `<span class="tag">${t}</span>`).join("")}
      </div>
    </div>
  `).join("");

  // ---- Skills (animated proficiency bars) ----
  const skillsGrid = document.getElementById("skillsGrid");
  skillsGrid.innerHTML = Object.entries(D.skills).map(([cat, items], i) => `
    <div class="skill-card reveal" style="transition-delay:${i * 70}ms">
      <h3>${cat}</h3>
      ${items.map(s => `
        <div class="skill-bar-row">
          <div class="skill-bar-label"><span>${s.name}</span><span class="pct">${s.level}%</span></div>
          <div class="skill-bar-track">
            <div class="skill-bar-fill" data-level="${s.level}"></div>
          </div>
        </div>
      `).join("")}
    </div>
  `).join("");

  // ---- Education ----
  const edu = D.education;
  document.getElementById("eduMain").innerHTML = `
    <div class="edu-school">${edu.school}</div>
    <div class="edu-college">${edu.college}</div>
    <div class="edu-degree">${edu.degree} · ${edu.graduation}</div>
    <div class="edu-meta">
      <div><span>Cumulative GPA</span><strong>${edu.gpa.toFixed(2)}</strong></div>
    </div>
    <ul class="edu-honors">
      ${edu.honors.map(h => `<li>${h}</li>`).join("")}
    </ul>
    <p class="edu-thesis">${edu.thesis}</p>
  `;

  document.getElementById("coursework").innerHTML = `
    <h3 style="font-size:14px;color:var(--text-faint);text-transform:uppercase;letter-spacing:.06em;margin-bottom:12px;">Relevant Coursework</h3>
    <div class="tag-row">
      ${edu.coursework.map(c => `<span class="tag">${c}</span>`).join("")}
    </div>
  `;

  // GPA trend chart (hand-rolled, smoothed SVG line chart)
  renderGpaChart(edu.gpaTrend);

  // ---- Certifications & Programs ----
  const certGrid = document.getElementById("certGrid");
  if (certGrid && D.certifications) {
    const iconMap = { cornell: "🎓", ml: "🤖", icons: "🧭", research: "🧬" };
    certGrid.innerHTML = D.certifications.map((c, i) => `
      <div class="cert-card tilt-card reveal" style="transition-delay:${i * 70}ms">
        <div class="cert-period">${c.period}</div>
        <div class="cert-icon">${iconMap[c.icon] || "🏆"}</div>
        <div class="cert-name">${c.name}</div>
        <div class="cert-issuer">${c.issuer}</div>
        <div class="cert-desc">${c.description}</div>
      </div>
    `).join("");
  }

  // ---- Leadership ----
  document.getElementById("leadershipList").innerHTML = D.leadership.map((l, i) => `
    <div class="leadership-card tilt-card reveal" style="transition-delay:${i * 70}ms">
      <div class="timeline-header">
        <div>
          <div class="timeline-role">${l.role}</div>
          <div class="timeline-org">${l.org}</div>
        </div>
        <div class="timeline-period">${l.period}</div>
      </div>
      <ul class="timeline-points">
        ${l.points.map(p => `<li>${p}</li>`).join("")}
      </ul>
    </div>
  `).join("");

  // ---- Contact ----
  document.getElementById("contactActions").innerHTML = `
    <a class="btn btn-primary" href="mailto:${D.email}">${icon("mail")} Email me</a>
    <a class="btn btn-ghost" href="${D.links.linkedin}" target="_blank" rel="noopener">${icon("linkedin")} LinkedIn</a>
    <a class="btn btn-ghost" href="${D.links.github}" target="_blank" rel="noopener">${icon("github")} GitHub</a>
  `;

  document.getElementById("year").textContent = new Date().getFullYear();

  // ---------------- helpers ----------------
  function icon(name) {
    const icons = {
      github: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.11 3.06.74.8 1.19 1.83 1.19 3.09 0 4.43-2.7 5.4-5.27 5.69.42.36.78 1.08.78 2.18 0 1.57-.01 2.84-.01 3.23 0 .3.2.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z"/></svg>`,
      linkedin: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45z"/></svg>`,
      mail: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>`
    };
    return icons[name] || "";
  }

  function renderGpaChart(trend) {
    const svg = document.getElementById("gpaChart");
    const w = 320, h = 180, pad = 30;
    // Tight axis around the actual range so the strong, consistent GPA reads as a
    // confident, elevated line rather than looking compressed near the bottom.
    const minGpa = 3.75, maxGpa = 4.0;
    const stepX = (w - pad * 2) / (trend.length - 1);
    const yFor = (gpa) => h - pad - ((Math.min(gpa, maxGpa) - minGpa) / (maxGpa - minGpa)) * (h - pad * 2);
    const points = trend.map((t, i) => [pad + i * stepX, yFor(t.gpa)]);

    // Smooth catmull-rom -> cubic bezier path so the line reads as an elegant,
    // confident curve rather than sharp zig-zag segments.
    function smoothPath(pts) {
      if (pts.length < 3) return "M" + pts.map(p => p.join(",")).join(" L");
      let d = `M${pts[0][0]},${pts[0][1]}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i - 1] || pts[i];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[i + 2] || p2;
        const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
        const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
        const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
        const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
        d += ` C${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
      }
      return d;
    }

    const pathD = smoothPath(points);
    const areaD = pathD + ` L${points[points.length - 1][0]},${h - pad} L${points[0][0]},${h - pad} Z`;

    let gridLines = "";
    for (let g = minGpa; g <= maxGpa + 0.001; g += 0.05) {
      const y = yFor(g);
      gridLines += `<line x1="${pad}" y1="${y}" x2="${w - pad}" y2="${y}" stroke="var(--border)" stroke-width="1" />`;
    }

    const dots = points.map((p, i) => `
      <circle cx="${p[0]}" cy="${p[1]}" r="4.5" fill="var(--accent)" stroke="var(--card)" stroke-width="2">
        <title>${trend[i].term}: ${trend[i].gpa.toFixed(3)}</title>
      </circle>
      <text x="${p[0]}" y="${h - 8}" font-size="9" fill="var(--text-faint)" text-anchor="middle">${trend[i].term}</text>
      <text x="${p[0]}" y="${p[1] - 12}" font-size="10" fill="var(--text)" text-anchor="middle" font-weight="700">${trend[i].gpa.toFixed(2)}</text>
    `).join("");

    svg.innerHTML = `
      <defs>
        <linearGradient id="gpaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.4" />
          <stop offset="100%" stop-color="var(--accent)" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="gpaLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="var(--accent)" />
          <stop offset="100%" stop-color="var(--accent-2)" />
        </linearGradient>
      </defs>
      ${gridLines}
      <path d="${areaD}" fill="url(#gpaGrad)" />
      <path id="gpaLinePath" d="${pathD}" fill="none" stroke="url(#gpaLine)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
      ${dots}
    `;

    // Animate the line drawing in once it scrolls into view
    const linePath = svg.querySelector("#gpaLinePath");
    if (linePath) {
      const len = linePath.getTotalLength();
      linePath.style.strokeDasharray = len;
      linePath.style.strokeDashoffset = len;
      const chartObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            linePath.style.transition = "stroke-dashoffset 1.6s cubic-bezier(.4,0,.2,1)";
            linePath.style.strokeDashoffset = "0";
            chartObserver.disconnect();
          }
        });
      }, { threshold: 0.4 });
      chartObserver.observe(svg);
    }

    // Overall-gain badge (first -> last cumulative GPA)
    const badgeEl = document.getElementById("gpaGainBadge");
    if (badgeEl) {
      const gain = trend[trend.length - 1].gpa - trend[0].gpa;
      const gainStr = (gain >= 0 ? "+" : "") + gain.toFixed(3);
      badgeEl.innerHTML = `<span class="gpa-gain-badge">▲ ${gainStr} pts since Fall '24 · Dean's List every term</span>`;
    }
  }
})();
