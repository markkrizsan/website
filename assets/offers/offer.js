document.documentElement.classList.add('js');

(() => {
  const $ = (s,c=document) => c.querySelector(s);
  const $$ = (s,c=document) => [...c.querySelectorAll(s)];
  const cfg = window.MK_CONFIG || {};

  window.mkTrack = window.mkTrack || function(event, data={}) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({event, ...data});
    if (typeof window.clarity === 'function') {
      try { window.clarity('event', event); } catch (_) {}
    }
  };

  // Preserve source attribution for outreach links.
  const params = new URLSearchParams(location.search);
  ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(key => {
    const field = $('#' + key);
    if (field) field.value = params.get(key) || '';
  });
  const referrer = $('#referrer');
  if (referrer) referrer.value = document.referrer || '';
  const landingPath = $('#landing_path');
  if (landingPath) landingPath.value = location.pathname + location.search;

  const progress = $('#progress');
  const depthFired = new Set();
  const updateScroll = () => {
    const root = document.documentElement;
    const max = Math.max(1, root.scrollHeight - root.clientHeight);
    const pct = Math.min(100, Math.max(0, (root.scrollTop / max) * 100));
    if (progress) progress.style.width = pct + '%';

    [25,50,75,90].forEach(mark => {
      if (pct >= mark && !depthFired.has(mark)) {
        depthFired.add(mark);
        window.mkTrack('offer_scroll_depth', {percent:mark});
      }
    });
  };
  addEventListener('scroll', updateScroll, {passive:true});
  updateScroll();

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      });
    }, {threshold:.08, rootMargin:'0px 0px -3% 0px'});
    $$('.reveal').forEach(el => io.observe(el));
  } else {
    $$('.reveal').forEach(el => el.classList.add('in'));
  }

  $$('[data-track]').forEach(el => {
    el.addEventListener('click', () => {
      window.mkTrack('offer_' + (el.dataset.track || 'click'), {
        location:el.dataset.location || '',
        label:(el.textContent || '').trim().slice(0,80)
      });
    });
  });

  const form = $('#launchForm');
  if (form) {
    const submit = $('#launchSubmit');
    const status = $('#launchStatus');
    const success = $('#launchSuccess');
    let started = false;

    form.addEventListener('focusin', () => {
      if (started) return;
      started = true;
      window.mkTrack('offer_form_start', {offer:'Launch-Ready Sprint'});
    });

    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!form.reportValidity()) return;

      const endpoint = (cfg.formEndpoint || form.action || '').trim();
      const email = (cfg.contactEmail || 'contact@markkrizsan.com').trim();
      const data = new FormData(form);

      if (endpoint && endpoint.startsWith('http')) {
        submit.disabled = true;
        status.textContent = 'Sending…';

        try {
          const response = await fetch(endpoint, {
            method:'POST',
            headers:{Accept:'application/json'},
            body:data
          });
          if (!response.ok) throw new Error('Submission failed');

          form.hidden = true;
          success.classList.add('show');
          status.textContent = '';
          window.mkTrack('offer_application_complete', {
            offer:'Launch-Ready Sprint',
            launch_date:data.get('launchDate') || '',
            source:data.get('utm_source') || ''
          });
        } catch (_) {
          status.textContent = 'The form did not send. Email the launch details to ' + email + '.';
          submit.disabled = false;
          window.mkTrack('offer_application_error', {offer:'Launch-Ready Sprint'});
        }
      } else {
        const subject = encodeURIComponent('Launch-Ready Sprint inquiry');
        const body = encodeURIComponent(
          `Name: ${data.get('name') || ''}\n` +
          `Email: ${data.get('email') || ''}\n` +
          `Launch: ${data.get('launch') || ''}\n` +
          `Launch date: ${data.get('launchDate') || ''}\n` +
          `URL: ${data.get('url') || ''}\n` +
          `Distribution: ${data.get('distribution') || ''}\n\n` +
          `What feels weak or unfinished:\n${data.get('problem') || ''}`
        );
        location.href = `mailto:${email}?subject=${subject}&body=${body}`;
      }
    });
  }

  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();