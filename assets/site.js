// LuTekOps – kleine Effekte, keine Tracker, keine Requests nach aussen.
(() => {
  const root = document.documentElement;
  root.classList.add("js");
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

  console.log("%c LuTekOps %c Neugierig? Gefällt uns. → kontakt@lutekops.ch",
    "background:#7a2cf0;color:#fff;font-weight:700;padding:3px 6px;border-radius:4px",
    "color:#b56cff");

  // Terminal: Ausgabezeilen nacheinander tippen
  const lines = [...document.querySelectorAll("[data-type]")];
  if (!calm) {
    lines.forEach((el) => { el.textContent = ""; });
    let i = 0;
    const typeLine = () => {
      const el = lines[i];
      if (!el) return;
      const chars = [...el.dataset.type];
      let n = 0;
      const tick = () => {
        el.textContent = chars.slice(0, ++n).join("");
        if (n < chars.length) setTimeout(tick, 28 + Math.random() * 40);
        else { i++; setTimeout(typeLine, 450); }
      };
      tick();
    };
    setTimeout(typeLine, 600);
  }

  // Sektionen beim Scrollen einblenden
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // Video: nur abspielen, wenn sichtbar; Ton per Knopf
  const clip = document.getElementById("clip");
  const sound = document.querySelector(".sound");
  if (clip) {
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !calm) clip.play().catch(() => {});
      else clip.pause();
    }, { threshold: 0.4 }).observe(clip);
    sound.addEventListener("click", () => {
      clip.muted = !clip.muted;
      if (!clip.muted) { clip.currentTime = 0; clip.play().catch(() => {}); }
      sound.setAttribute("aria-pressed", String(!clip.muted));
      sound.textContent = clip.muted ? sound.dataset.off : sound.dataset.on;
    });
  }

  // Hintergrund: Leiterbahn-Netz wie im Logo
  const cv = document.getElementById("net");
  const ctx = cv.getContext("2d");
  let w, h, dpr, nodes = [];
  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = cv.width = innerWidth * dpr;
    h = cv.height = innerHeight * dpr;
    const count = Math.round(Math.min(90, (innerWidth * innerHeight) / 18000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - .5) * .25 * dpr, vy: (Math.random() - .5) * .25 * dpr,
    }));
  };
  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    const max = 150 * dpr;
    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    }
    for (let a = 0; a < nodes.length; a++) {
      for (let b = a + 1; b < nodes.length; b++) {
        const dx = nodes[a].x - nodes[b].x, dy = nodes[a].y - nodes[b].y;
        const d = Math.hypot(dx, dy);
        if (d < max) {
          ctx.strokeStyle = `rgba(181,108,255,${(1 - d / max) * .35})`;
          ctx.lineWidth = dpr;
          ctx.beginPath(); ctx.moveTo(nodes[a].x, nodes[a].y); ctx.lineTo(nodes[b].x, nodes[b].y); ctx.stroke();
        }
      }
    }
    ctx.fillStyle = "rgba(217,168,255,.8)";
    for (const n of nodes) { ctx.beginPath(); ctx.arc(n.x, n.y, 1.6 * dpr, 0, 6.283); ctx.fill(); }
    if (!calm && !document.hidden) requestAnimationFrame(draw);
  };
  resize(); draw();
  addEventListener("resize", () => { resize(); if (calm) draw(); });
  document.addEventListener("visibilitychange", () => { if (!document.hidden && !calm) draw(); });

  // ↑↑↓↓←→←→BA
  const code = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let pos = 0;
  addEventListener("keydown", (e) => {
    pos = e.key === code[pos] ? pos + 1 : (e.key === code[0] ? 1 : 0);
    if (pos === code.length) {
      pos = 0;
      document.body.classList.toggle("glitch");
      console.log("%c> sudo make me a sandwich\n> okay.", "color:#39ff14;font-family:monospace");
    }
  });
})();

// Fensterknöpfe: nur Spass, nichts schliesst sich
document.querySelectorAll("[data-msg]").forEach((b) => b.addEventListener("click", () => {
  const wc = b.parentElement;
  wc.querySelector(".wc-tip")?.remove();
  const tip = document.createElement("span");
  tip.className = "wc-tip";
  tip.setAttribute("role", "status");
  tip.textContent = b.dataset.msg;
  wc.appendChild(tip);
  // rechtsbündig unter dem Fenster, Pfeil zeigt auf den geklickten Knopf
  tip.style.right = "0px";
  const arrow = b.offsetLeft + b.offsetWidth / 2 - (wc.offsetWidth - tip.offsetWidth);
  tip.style.setProperty("--arrow", Math.max(10, Math.min(tip.offsetWidth - 10, arrow)) + "px");
  clearTimeout(wc._t);
  wc._t = setTimeout(() => tip.remove(), 1800);
}));
