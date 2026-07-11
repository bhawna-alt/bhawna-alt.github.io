/**
 * splash.js
 * Intro hook inspired by the classic "glowing low-poly network assembles into
 * a logo" app-splash pattern (e.g. Mint Mobile's fox constellation): a wordmark
 * fades in, a hexagon/molecule network of glowing nodes draws itself in line by
 * line, holds for a beat with a tagline, then the whole scene dissolves while
 * the real hero content crossfades in underneath. ~2.4s total, skipped for
 * visitors with "reduce motion" enabled.
 */
(function () {
  const splash = document.getElementById("splash");
  if (!splash) return;

  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let hidden = false;
  function hideSplash() {
    if (hidden) return;
    hidden = true;
    splash.classList.add("splash-hide");
    document.body.classList.add("site-entered");
    document.body.classList.remove("splash-locked");
    setTimeout(() => splash.remove(), 600);
  }

  if (prefersReduced) {
    document.body.classList.add("site-entered");
    hideSplash();
    return;
  }

  document.body.classList.add("splash-locked");

  // ---------------- Wordmark ----------------
  const wordmark = splash.querySelector(".splash-wordmark");
  requestAnimationFrame(() => requestAnimationFrame(() => {
    wordmark.classList.add("wm-show");
  }));

  // ---------------- Ambient bokeh ----------------
  const bokehLayer = document.getElementById("splashBokeh");
  const BOKEH_COUNT = 10;
  for (let i = 0; i < BOKEH_COUNT; i++) {
    const dot = document.createElement("span");
    dot.style.left = (10 + Math.random() * 80) + "%";
    dot.style.top = (10 + Math.random() * 80) + "%";
    dot.style.animationDelay = (Math.random() * 3) + "s";
    dot.style.animationDuration = (2.6 + Math.random() * 2) + "s";
    bokehLayer.appendChild(dot);
  }

  // ---------------- Hexagon / molecule constellation ----------------
  // A center node, an inner hexagon, and an outer hexagon — reads as both a
  // benzene-ring molecule diagram and a network/graph structure at once.
  const NODES = {
    C:  [150, 150],
    I0: [173, 111], I1: [195, 150], I2: [173, 189],
    I3: [128, 189], I4: [105, 150], I5: [128, 111],
    O0: [150, 50],  O1: [237, 100], O2: [237, 200],
    O3: [150, 250], O4: [63, 200],  O5: [63, 100]
  };
  // [from, to, group] — group controls color + draw order
  const EDGES = [
    ["C","I0","spoke"], ["C","I1","spoke"], ["C","I2","spoke"],
    ["C","I3","spoke"], ["C","I4","spoke"], ["C","I5","spoke"],
    ["I0","O0","link"], ["I0","O1","link"], ["I1","O1","link"], ["I1","O2","link"],
    ["I2","O2","link"], ["I2","O3","link"], ["I3","O3","link"], ["I3","O4","link"],
    ["I4","O4","link"], ["I4","O5","link"], ["I5","O5","link"], ["I5","O0","link"],
    ["O0","O1","ring"], ["O1","O2","ring"], ["O2","O3","ring"],
    ["O3","O4","ring"], ["O4","O5","ring"], ["O5","O0","ring"]
  ];
  const GROUP_COLOR = { spoke: "#a5b4fc", link: "#818cf8", ring: "#c084fc" };
  const GROUP_ORDER = { spoke: 0, link: 1, ring: 2 };

  const svg = document.getElementById("splashConstellation");
  const svgNS = "http://www.w3.org/2000/svg";

  // Draw lines, staggered by group so the mesh assembles outward from the center
  EDGES.forEach(([fromId, toId, group], i) => {
    const [x1, y1] = NODES[fromId];
    const [x2, y2] = NODES[toId];
    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", x1); line.setAttribute("y1", y1);
    line.setAttribute("x2", x2); line.setAttribute("y2", y2);
    line.setAttribute("class", "constellation-line");
    line.setAttribute("stroke", GROUP_COLOR[group]);
    svg.appendChild(line);

    const len = Math.hypot(x2 - x1, y2 - y1);
    line.style.strokeDasharray = len;
    line.style.strokeDashoffset = len;
    line.style.opacity = "0.85";

    const delay = 120 + GROUP_ORDER[group] * 280 + (i % 6) * 45;
    setTimeout(() => {
      line.style.transition = "stroke-dashoffset 480ms cubic-bezier(.4,0,.2,1)";
      line.style.strokeDashoffset = "0";
    }, delay);
  });

  // Draw nodes: a soft blurred halo + a bright core, fading/scaling in just
  // after their connecting lines start arriving
  const nodeOrder = ["C", "I0","I1","I2","I3","I4","I5", "O0","O1","O2","O3","O4","O5"];
  nodeOrder.forEach((id, i) => {
    const [x, y] = NODES[id];
    const isCenter = id === "C";
    const isInner = id[0] === "I";
    const color = isCenter ? "#eef0ff" : isInner ? "#a5b4fc" : "#c084fc";

    const halo = document.createElementNS(svgNS, "circle");
    halo.setAttribute("cx", x); halo.setAttribute("cy", y);
    halo.setAttribute("r", isCenter ? 10 : 7);
    halo.setAttribute("fill", color);
    halo.setAttribute("opacity", "0.25");
    halo.setAttribute("class", "constellation-node");
    halo.style.filter = "blur(3px)";
    halo.style.opacity = "0";
    halo.style.transform = "scale(0.4)";
    svg.appendChild(halo);

    const core = document.createElementNS(svgNS, "circle");
    core.setAttribute("cx", x); core.setAttribute("cy", y);
    core.setAttribute("r", isCenter ? 3.6 : 2.6);
    core.setAttribute("fill", color);
    core.setAttribute("class", "constellation-node");
    core.style.opacity = "0";
    core.style.transform = "scale(0.4)";
    svg.appendChild(core);

    const delay = 160 + i * 55;
    setTimeout(() => {
      [halo, core].forEach(el => {
        el.style.opacity = el === halo ? "0.25" : "1";
        el.style.transform = "scale(1)";
      });
    }, delay);
  });

  // ---------------- Tagline + exit ----------------
  const tagline = document.getElementById("splashTagline");
  setTimeout(() => tagline.classList.add("tag-show"), 1500);
  setTimeout(hideSplash, 2550);

  // Safety net: never let the splash block the site for more than ~4.5s
  setTimeout(hideSplash, 4500);
})();
