const BOOKING_URL = "https://calendly.com/markkrizsan/sprint";

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealEls = document.querySelectorAll(".reveal");

if (reducedMotion) {
  revealEls.forEach(el => el.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -4% 0px" });

  revealEls.forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(index % 3, 2) * 50}ms`;
    observer.observe(el);
  });
}

const lens = document.getElementById("perceptionLens");
const range = document.getElementById("lensRange");

function setSplit(value) {
  if (!lens) return;
  const split = Math.max(8, Math.min(92, Number(value)));
  lens.style.setProperty("--split", `${split}%`);
  if (range && Number(range.value) !== split) range.value = split;
}

if (lens && range) {
  range.addEventListener("input", (event) => setSplit(event.target.value));
  lens.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;
    const rect = lens.getBoundingClientRect();
    const split = ((event.clientX - rect.left) / rect.width) * 100;
    setSplit(split);
  });
}

const hero = document.getElementById("hero");
if (hero) {
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      document.body.classList.toggle("is-hero", entry.isIntersecting && entry.intersectionRatio > 0.18);
    });
  }, { threshold: [0, 0.18, 0.5] });
  heroObserver.observe(hero);
}

document.querySelectorAll("[data-track]").forEach(el => {
  el.addEventListener("click", () => {
    if (typeof window.gtag === "function") {
      window.gtag("event", "fit_call_click", {
        location: el.dataset.track
      });
    }
  });
});
