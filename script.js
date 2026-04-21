history.scrollRestoration = "manual";
window.scrollTo(0, 0);
/* ===== SPARKLES ===== */
function createSparkles() {
  const container = document.getElementById("sparkle-container");
  for (let i = 0; i < 30; i++) {
    const s = document.createElement("div");
    s.className = "sparkle";
    s.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      --dur: ${1.5 + Math.random() * 2.5}s;
      --delay: ${Math.random() * 3}s;
      width: ${2 + Math.random() * 4}px;
      height: ${2 + Math.random() * 4}px;
    `;
    container.appendChild(s);
  }
}
createSparkles();

/* ===== AIRPLANE ANIMATION ===== */
function animateAirplane() {
  const group = document.getElementById("airplane-group");
  const path = document.getElementById("flight-path");
  const length = path.getTotalLength();
  let startTime = null;
  const duration = 4000;
  const delay = 600;

  setTimeout(() => {
    group.style.opacity = "1";

    function step(ts) {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased =
        progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;

      const pt = path.getPointAtLength(eased * length);
      const ptAhead = path.getPointAtLength(
        Math.min((eased + 0.01) * length, length),
      );
      const angle =
        (Math.atan2(ptAhead.y - pt.y, ptAhead.x - pt.x) * 180) / Math.PI;

      group.setAttribute("transform", `translate(${pt.x}, ${pt.y})`);
      document
        .getElementById("airplane")
        .setAttribute("transform", `rotate(${angle})`);

      if (progress < 1) requestAnimationFrame(step);
      else group.style.opacity = "0";
    }
    requestAnimationFrame(step);
  }, delay);
}

/* ===== STAMPS ===== */
function showStamps() {
  setTimeout(
    () => document.getElementById("stamp1").classList.add("show"),
    800,
  );
  setTimeout(
    () => document.getElementById("stamp2").classList.add("show"),
    1600,
  );
  setTimeout(
    () => document.getElementById("stamp3").classList.add("show"),
    2400,
  );
}

/* ===== MUSIC ===== */
const music = document.getElementById("bg-music");
let musicState = 0; // 0 = stopped, 1 = playing, 2 = muted

function fadeMusicIn(m) {
  let vol = 0;
  m.volume = 0;
  m.muted = false;
  const fade = setInterval(() => {
    vol = Math.min(vol + 0.02, 0.35);
    m.volume = vol;
    if (vol >= 0.35) clearInterval(fade);
  }, 150);
}

function toggleMusic() {
  const btn = document.getElementById("music-btn");
  if (musicState === 0) {
    music
      .play()
      .then(() => fadeMusicIn(music))
      .catch(() => {});
    musicState = 1;
    btn.textContent = "♪";
    btn.title = "Mute Music";
    btn.classList.remove("muted");
  } else if (musicState === 1) {
    music.muted = true;
    musicState = 2;
    btn.textContent = "♪̶";
    btn.title = "Unmute Music";
    btn.classList.add("muted");
  } else {
    music.muted = false;
    fadeMusicIn(music);
    musicState = 1;
    btn.textContent = "♪";
    btn.title = "Mute Music";
    btn.classList.remove("muted");
  }
}

/* ===== ENVELOPE OPEN → AIRPLANE TRANSITION ===== */
function openEnvelope() {
  const btn = document.getElementById("envelope-seal-btn");
  btn.disabled = true;
  setTimeout(() => {
    music
      .play()
      .then(() => fadeMusicIn(music))
      .catch(() => {});
    musicState = 1;
    document.getElementById("music-btn").textContent = "♪";
    document.getElementById("music-btn").classList.remove("muted");
  }, 4000);

  // Animate envelope opening
  const envelope = document.getElementById("envelope-screen");
  const flap = document.querySelector(".env-flap");
  const card = document.querySelector(".env-invite-card");

  // Step 1: flip flap open
  flap.classList.add("open");

  // Step 2: slide card up out of envelope
  setTimeout(() => {
    card.classList.add("slide-out");
  }, 700);

  // Step 3: fade out envelope, show intro/airplane screen
  setTimeout(() => {
    envelope.classList.add("fade-out");
    const intro = document.getElementById("intro");
    intro.classList.add("visible-intro");

    // Start airplane + stamps
    animateAirplane();
    showStamps();
  }, 1600);

  // Step 4: After airplane animation, transition to main
  setTimeout(() => {
    const intro = document.getElementById("intro");
    const main = document.getElementById("main-page");
    intro.classList.add("fade-out");
    main.classList.add("visible");

    document.querySelectorAll(".hero .fade-in").forEach((el, i) => {
      setTimeout(() => el.classList.add("visible"), 200 + i * 150);
    });
  }, 7400); // 1600ms envelope fade + 5800ms airplane
}

/* ===== SCROLL FADE-IN ===== */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 },
);

document
  .querySelectorAll(".fade-in:not(.hero .fade-in)")
  .forEach((el) => observer.observe(el));
