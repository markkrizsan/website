(() => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const progress = document.getElementById('progress');
  const updateProgress = () => {
    if (!progress) return;
    const root = document.documentElement;
    const max = root.scrollHeight - root.clientHeight;
    const value = max > 0 ? (root.scrollTop / max) * 100 : 0;
    progress.style.width = value + '%';
  };
  addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion || !('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -3% 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();
