const BOOKING_URL = "https://calendly.com/markkrizsan/sprint";

/* Current year */
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

/* Reveal system */
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const reveals = [...document.querySelectorAll(".reveal")];

if (reducedMotion) {
  reveals.forEach(el => el.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });

  reveals.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 3, 2) * 55}ms`;
    revealObserver.observe(el);
  });
}

/* Perception lens */
const lens = document.getElementById("perceptionLens");
const range = document.getElementById("lensRange");

function setSplit(value) {
  const v = Math.max(8, Math.min(92, Number(value)));
  lens?.style.setProperty("--split", `${v}%`);
  if (range && Number(range.value) !== v) range.value = v;
}

if (range && lens) {
  range.addEventListener("input", (e) => setSplit(e.target.value));

  // Desktop: the whole surface behaves like the slider.
  lens.addEventListener("pointermove", (e) => {
    if (e.pointerType === "mouse") {
      const rect = lens.getBoundingClientRect();
      const percent = ((e.clientX - rect.left) / rect.width) * 100;
      setSplit(percent);
    }
  });
}

/* Persistent booking control */
const guideLink = document.getElementById("guideLink");
const guideText = document.getElementById("guideText");
const guideSmall = document.querySelector(".guide-small");

if (guideLink) {
  guideLink.href = BOOKING_URL;
  guideLink.target = "_blank";
  guideLink.rel = "noopener";
}
if (guideText) guideText.textContent = "BOOK";
if (guideSmall) guideSmall.textContent = "15 MIN";
const guideIcon = guideLink?.querySelector("i");
if (guideIcon) guideIcon.textContent = "↗";

/* Lightweight portrait parallax */
const portrait = document.querySelector(".portrait-media img");
if (portrait && !reducedMotion) {
  const updatePortrait = () => {
    const section = portrait.closest(".portrait-section");
    if (!section) return;
    const rect = section.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
    const y = (progress - .5) * 16;
    portrait.style.objectPosition = `50% ${35 + y * .16}%`;
  };
  window.addEventListener("scroll", updatePortrait, { passive: true });
  updatePortrait();
}

/* Simple CTA analytics hook, compatible with gtag if later installed */
document.querySelectorAll("[data-track]").forEach((el) => {
  el.addEventListener("click", () => {
    if (typeof window.gtag === "function") {
      window.gtag("event", "fit_call_click", {
        location: el.dataset.track
      });
    }
  });
});
