const SITE_CONFIG = {
  bookingUrl: "https://calendly.com/markkrizsan/sprint"
};

/* Booking links */
document.querySelectorAll(".js-booking-link").forEach((link) => {
  link.setAttribute("href", SITE_CONFIG.bookingUrl);
  link.setAttribute("target", "_blank");
  link.setAttribute("rel", "noopener");

  link.addEventListener("click", () => {
    const cta = link.dataset.cta || "fit-call";
    if (typeof window.gtag === "function") {
      window.gtag("event", "booking_click", { cta_location: cta });
    }
  });
});

/* Current year */
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

/* Intersection reveals */
const revealEls = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -4% 0px" }
);

revealEls.forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index % 4, 3) * 65}ms`;
  observer.observe(el);
});

/* Cursor light for desktop */
const cursorLight = document.querySelector(".cursor-light");
const finePointer = window.matchMedia("(pointer: fine)");

if (cursorLight && finePointer.matches) {
  window.addEventListener("pointermove", (event) => {
    cursorLight.style.left = `${event.clientX}px`;
    cursorLight.style.top = `${event.clientY}px`;
  });

  document.addEventListener("mouseleave", () => {
    cursorLight.style.opacity = "0";
  });

  document.addEventListener("mouseenter", () => {
    cursorLight.style.opacity = ".5";
  });
} else if (cursorLight) {
  cursorLight.remove();
}
