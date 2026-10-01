(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = navigator.connection && navigator.connection.saveData;
  const header = document.querySelector('.site-header');
  const progress = document.getElementById('progress');
  let scrollTick = false;
  const updateScroll = () => {
    scrollTick = false;
    if (header) header.classList.toggle('is-scrolled', scrollY > 48);
    if (progress) {
      const max = document.documentElement.scrollHeight - innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
    }
  };
  addEventListener('scroll', () => {
    if (!scrollTick) { scrollTick = true; requestAnimationFrame(updateScroll); }
  }, {passive:true});
  updateScroll();

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  const loadVideoSource = video => {
    if (!video || video.dataset.loaded === 'true') return;
    const source = video.querySelector('source[data-src]');
    if (!source) return;
    source.src = source.dataset.src;
    source.removeAttribute('data-src');
    video.dataset.loaded = 'true';
    video.load();
  };

  const heroFilm = document.getElementById('hero-film');
  if (heroFilm && !reduced.matches && !saveData && innerWidth >= 900) {
    loadVideoSource(heroFilm);
    heroFilm.addEventListener('canplay', () => {
      heroFilm.classList.add('is-ready');
      heroFilm.play().catch(() => {});
    }, {once:true});
  }

  const cutData = [
    {label:'01 / IDEA', heading:'Decide what the viewer should feel first.', body:'Before the shot list, establish the perception: tension, confidence, intimacy, scale, desire, stillness or motion.', image:'/creative/assets/img/campaign-hero.webp'},
    {label:'02 / LANGUAGE', heading:'Build one visual vocabulary.', body:'Color, texture, environment and contrast should belong to the same thought instead of competing for attention.', image:'/creative/assets/img/campaign-02.webp'},
    {label:'03 / FRAME', heading:'Make every crop carry intent.', body:'Framing determines hierarchy before copy ever arrives. The subject, negative space and edge tension all have a job.', image:'/creative/assets/img/campaign-03.webp'},
    {label:'04 / SEQUENCE', heading:'One image is a moment. A sequence is a world.', body:'Variation matters, but the viewer should still feel one author moving through every frame.', image:'/creative/assets/img/campaign-04.webp'},
    {label:'05 / FINAL', heading:'Finish until nothing feels accidental.', body:'The final work should make the underlying decisions invisible. What remains is the feeling and the image.', image:'/creative/assets/img/campaign-05.webp'}
  ];
  const tabs = [...document.querySelectorAll('.cut-tab')];
  const panel = document.getElementById('cut-panel');
  const cutImage = document.getElementById('cut-image');
  const cutNumber = document.getElementById('cut-number');
  const cutHeading = document.getElementById('cut-heading');
  const cutBody = document.getElementById('cut-body');
  const activateCut = (index, focus = false) => {
    const data = cutData[index];
    if (!data) return;
    tabs.forEach((tab, i) => {
      const active = i === index;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    if (panel && !reduced.matches) panel.classList.add('is-changing');
    const swap = () => {
      if (cutImage) { cutImage.src = data.image; cutImage.alt = `${data.label}: selected visual study image.`; }
      if (cutNumber) cutNumber.textContent = data.label;
      if (cutHeading) cutHeading.textContent = data.heading;
      if (cutBody) cutBody.textContent = data.body;
      if (panel) panel.classList.remove('is-changing');
    };
    reduced.matches ? swap() : setTimeout(swap, 150);
    if (focus) tabs[index]?.focus();
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateCut(index));
    tab.addEventListener('keydown', e => {
      let next = null;
      if (e.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (e.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = tabs.length - 1;
      if (next === null) return;
      e.preventDefault(); activateCut(next, true);
    });
  });

  const fieldFilm = document.getElementById('field-film');
  const fieldToggle = document.getElementById('field-film-toggle');
  const syncFilmButton = () => {
    if (!fieldFilm || !fieldToggle) return;
    const paused = fieldFilm.paused;
    fieldToggle.setAttribute('aria-pressed', String(!paused));
    fieldToggle.innerHTML = `${paused ? 'Play film' : 'Pause film'} <span aria-hidden="true">→</span>`;
  };
  if (fieldFilm && fieldToggle) {
    fieldToggle.addEventListener('click', () => {
      if (fieldFilm.paused) {
        loadVideoSource(fieldFilm);
        fieldFilm.play().catch(() => {});
      } else fieldFilm.pause();
    });
    fieldFilm.addEventListener('play', syncFilmButton);
    fieldFilm.addEventListener('pause', syncFilmButton);
    syncFilmButton();
  }

  const form = document.getElementById('inquiry');
  const status = document.getElementById('form-status');
  if (form && status) {
    form.addEventListener('submit', async e => {
      if (!form.checkValidity()) { e.preventDefault(); form.reportValidity(); return; }
      e.preventDefault();
      const button = form.querySelector('.submit');
      const original = button?.innerHTML;
      if (button) { button.disabled = true; button.textContent = 'Sending…'; }
      status.textContent = '';
      try {
        const response = await fetch(form.action, {method:'POST', body:new FormData(form), headers:{Accept:'application/json'}});
        if (!response.ok) throw new Error('Submission failed');
        form.reset();
        status.textContent = 'Received. I’ll review the objective, timing and scope and come back with the clearest next step.';
        status.focus?.();
        window.dataLayer?.push({event:'inquiry_submit'});
      } catch (_err) {
        status.innerHTML = 'Something interrupted the form. Email <a href="mailto:contact@markkrizsan.com">contact@markkrizsan.com</a> instead.';
      } finally {
        if (button) { button.disabled = false; button.innerHTML = original; }
      }
    });
  }

  document.querySelectorAll('a[href="#commission"]').forEach(a => a.addEventListener('click', () => window.dataLayer?.push({event:'start_project_click'})));
  document.querySelectorAll('.world').forEach((world, index) => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        window.dataLayer?.push({event:'project_view', index:index+1}); observer.disconnect();
      }
    }, {threshold:.45});
    observer.observe(world);
  });
})();
