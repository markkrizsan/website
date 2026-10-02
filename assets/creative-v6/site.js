(()=>{
  const header=document.querySelector('[data-header]');
  const heroVideo=document.querySelector('[data-hero-video]');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(heroVideo&&!reduced){
    heroVideo.src=matchMedia('(max-width:700px)').matches?heroVideo.dataset.mobileSrc:heroVideo.dataset.desktopSrc;
    heroVideo.load(); heroVideo.play().catch(()=>{});
  }
  const hero=document.querySelector('[data-hero]');
  const button=document.querySelector('[data-menu-button]');
  const nav=document.querySelector('[data-mobile-nav]');
  const main=document.querySelector('main');
  const footer=document.querySelector('footer');
  const setHeader=()=>{
    if(!header) return;
    if(!hero){header.classList.add('is-paper');return;}
    header.classList.toggle('is-paper', hero.getBoundingClientRect().bottom<=72);
  };
  setHeader(); addEventListener('scroll',setHeader,{passive:true});
  const closeMenu=(restore=true)=>{
    if(!button||!nav)return;
    button.setAttribute('aria-expanded','false');button.setAttribute('aria-label','Open menu');button.querySelector('span').textContent='Menu';
    nav.classList.remove('is-open');nav.setAttribute('aria-hidden','true');document.body.classList.remove('nav-open');
    [main,footer].forEach(el=>el&&el.removeAttribute('inert'));if(restore)button.focus();
  };
  const openMenu=()=>{
    button.setAttribute('aria-expanded','true');button.setAttribute('aria-label','Close menu');button.querySelector('span').textContent='Close';
    nav.classList.add('is-open');nav.setAttribute('aria-hidden','false');document.body.classList.add('nav-open');
    [main,footer].forEach(el=>el&&el.setAttribute('inert',''));
    requestAnimationFrame(()=>nav.querySelector('a')?.focus());
  };
  button?.addEventListener('click',()=>button.getAttribute('aria-expanded')==='true'?closeMenu(false):openMenu());
  nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>closeMenu(false)));
  addEventListener('keydown',e=>{if(e.key==='Escape'&&button?.getAttribute('aria-expanded')==='true')closeMenu(true)});

  const filterButtons=[...document.querySelectorAll('[data-filter]')];
  const rows=[...document.querySelectorAll('[data-discipline]')];
  const count=document.querySelector('.filter-count');
  filterButtons.forEach(btn=>btn.addEventListener('click',()=>{
    const val=btn.dataset.filter;let shown=0;
    filterButtons.forEach(b=>{const active=b===btn;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active))});
    rows.forEach(row=>{const show=val==='All'||row.dataset.discipline===val;row.hidden=!show;if(show)shown++});
    if(count)count.textContent=`${shown} shown`;
  }));

  if(reduced){document.querySelectorAll('video[autoplay]').forEach(v=>v.pause())}
})();
