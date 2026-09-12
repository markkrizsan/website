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

  const params = new URLSearchParams(location.search);
  ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(key => {
    const field = $('#' + key);
    if (field) field.value = params.get(key) || '';
  });
  const referrer = $('#referrer');
  if (referrer) referrer.value = document.referrer || '';
  const landing = $('#landing_path');
  if (landing) landing.value = location.pathname + location.search;

  const progress = $('#progress');
  const depthFired = new Set();
  const updateScroll = () => {
    const root = document.documentElement;
    const max = Math.max(1, root.scrollHeight - root.clientHeight);
    const pct = Math.min(100, Math.max(0, root.scrollTop / max * 100));
    if (progress) progress.style.width = pct + '%';
    [25,50,75,90].forEach(mark => {
      if (pct >= mark && !depthFired.has(mark)) {
        depthFired.add(mark);
        window.mkTrack('launch_os_scroll_depth', {percent:mark});
      }
    });
  };
  addEventListener('scroll', updateScroll, {passive:true});
  updateScroll();

  $$('[data-track]').forEach(el => el.addEventListener('click', () => {
    window.mkTrack('launch_os_' + (el.dataset.track || 'click'), {
      location:el.dataset.location || '',
      label:(el.textContent || '').trim().replace(/\s+/g,' ').slice(0,90)
    });
  }));

  $$('.faq-list details').forEach(d => d.addEventListener('toggle', () => {
    if (d.open) window.mkTrack('launch_os_faq_open', {question:(d.querySelector('summary')?.textContent || '').trim().slice(0,110)});
  }));

  const form = $('#programForm');
  if (form) {
    const submit = $('#programSubmit');
    const status = $('#programStatus');
    const success = $('#programSuccess');
    let started = false;
    let submitting = false;

    form.addEventListener('focusin', () => {
      if (started) return;
      started = true;
      window.mkTrack('launch_os_application_start', {offer:'Program Architecture + Build'});
    });

    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (submitting) return;
      if (!form.reportValidity()) {
        window.mkTrack('launch_os_application_validation_error', {});
        return;
      }

      const endpoint = (cfg.formEndpoint || form.action || '').trim();
      const email = (cfg.contactEmail || 'contact@markkrizsan.com').trim();
      const data = new FormData(form);

      if (endpoint && endpoint.startsWith('http')) {
        submitting = true;
        submit.disabled = true;
        status.textContent = 'SENDING…';
        try {
          const response = await fetch(endpoint,{method:'POST',headers:{Accept:'application/json'},body:data});
          if (!response.ok) throw new Error('Submission failed');
          form.hidden = true;
          success.hidden = false;
          success.focus();
          status.textContent = '';
          window.mkTrack('launch_os_application_submit', {source:data.get('utm_source') || '', timing:data.get('timing') || ''});
        } catch (_) {
          status.textContent = 'THE FORM DID NOT SEND. EMAIL THE PROGRAM CONTEXT TO ' + email.toUpperCase() + '.';
          submit.disabled = false;
          submitting = false;
          window.mkTrack('launch_os_application_error', {});
        }
      } else {
        const subject = encodeURIComponent('Program Architecture + Build inquiry');
        const body = encodeURIComponent(
          `Name: ${data.get('name') || ''}\n` +
          `Email: ${data.get('email') || ''}\n` +
          `Current work: ${data.get('current') || ''}\n` +
          `Program: ${data.get('launch') || ''}\n` +
          `Buyer access: ${data.get('access') || ''}\n` +
          `Timing: ${data.get('timing') || ''}\n` +
          `What exists: ${data.get('existing') || ''}\n` +
          `URL: ${data.get('url') || ''}`
        );
        location.href = `mailto:${email}?subject=${subject}&body=${body}`;
      }
    });
  }

  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
