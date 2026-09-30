(() => {
  'use strict';
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
  const header = document.querySelector('.site-header');
  const progress = document.getElementById('scroll-progress');
  let ticking = false;
  function updateScroll() {
    ticking = false;
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 32);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    }
  }
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(updateScroll); } }, {passive: true});
  updateScroll();
  const tabs = Array.from(document.querySelectorAll('[role="tab"][data-project]'));
  if (!tabs.length) return;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  function activate(tab, moveFocus = false) {
    tabs.forEach(item => {
      const active = item === tab;
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
      item.classList.toggle('is-active', active);
      const panel = document.getElementById(item.getAttribute('aria-controls'));
      if (panel) {
        panel.hidden = !active;
        panel.classList.toggle('is-active', active);
        if (active && !reducedMotion.matches) {
          panel.classList.remove('stage-enter');
          void panel.offsetWidth;
          panel.classList.add('stage-enter');
        }
      }
    });
    if (moveFocus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      activate(tabs[next], true);
    });
  });
})();
