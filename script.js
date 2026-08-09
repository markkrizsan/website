/* =========================================================
   EDIT THESE TWO VALUES BEFORE DEPLOYMENT.
   That's it. Humanity survives another configuration file.
   ========================================================= */

const SITE_CONFIG = {
  bookingUrl: "https://cal.com/YOUR-HANDLE/15min",
  email: "YOUR-EMAIL@example.com"
};

/* Apply booking + email links */
document.querySelectorAll(".js-booking-link").forEach((link) => {
  link.setAttribute("href", SITE_CONFIG.bookingUrl);

  if (SITE_CONFIG.bookingUrl.includes("YOUR-HANDLE")) {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      alert("Add your real booking URL in SITE_CONFIG inside script.js before publishing.");
    });
  } else {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener");
  }
});

document.querySelectorAll(".js-email-link").forEach((link) => {
  link.setAttribute("href", `mailto:${SITE_CONFIG.email}?subject=Website%20Sprint`);

  if (SITE_CONFIG.email.includes("YOUR-EMAIL")) {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      alert("Add your real email in SITE_CONFIG inside script.js before publishing.");
    });
  }
});

document.querySelectorAll(".js-email-text").forEach((element) => {
  if (!SITE_CONFIG.email.includes("YOUR-EMAIL")) {
    element.textContent = SITE_CONFIG.email;
  }
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
  el.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
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
