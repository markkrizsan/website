document.documentElement.classList.add('js');
(() => {
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
  const cfg=window.MK_CONFIG||{};

  // Demo safety badge
  const badge=$('.demo-badge');
  if(badge && !cfg.demoMode) badge.remove();

  // Menu + focus management
  const menu=$('#menuPanel'), open=$('#menuOpen'), close=$('#menuClose'), main=$('main');
  let menuReturnFocus=null;
  const focusables=container=>$$('a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])',container).filter(el=>!el.hidden);
  function setMenu(on){
    if(!menu)return;
    if(on) menuReturnFocus=document.activeElement;
    menu.classList.toggle('open',on); menu.setAttribute('aria-hidden',String(!on)); document.body.classList.toggle('lock',on); if(open)open.setAttribute('aria-expanded',String(on));
    if(main) main.inert=on;
    if(on) setTimeout(()=>close?.focus(),20); else menuReturnFocus?.focus?.();
  }
  open?.addEventListener('click',()=>setMenu(true)); close?.addEventListener('click',()=>setMenu(false));
  $$('#menuPanel a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
  menu?.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const f=focusables(menu);if(!f.length)return;const first=f[0],last=f[f.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}});

  // Reveal
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
  $$('.reveal').forEach(el=>io.observe(el));

  // Hero video + sound
  const hv=$('#heroVideo');
  if(hv){
    hv.addEventListener('canplay',()=>hv.classList.add('ready'),{once:true});
    hv.play().catch(()=>{});
  }
  const audio=$('#ambientAudio'), sound=$('#soundToggle');
  sound?.addEventListener('click',async()=>{
    if(!audio)return;
    if(audio.paused){try{await audio.play();sound.textContent='Sound off'; sound.setAttribute('aria-pressed','true');}catch(e){sound.textContent='Sound unavailable';}}
    else{audio.pause();sound.textContent='Sound on';sound.setAttribute('aria-pressed','false');}
  });

  // Perception state
  const pStage=$('#perceptionStage'), pCaption=$('#perceptionCaption');
  $$('.perception-nav button').forEach(btn=>btn.addEventListener('click',()=>{
    const s=btn.dataset.state;
    $$('.perception-nav button').forEach(b=>b.classList.toggle('active',b===btn));
    $$('img',pStage).forEach(img=>img.classList.toggle('active',img.dataset.state===s));
    if(pCaption)pCaption.textContent=btn.dataset.caption||'';
    window.mkTrack?.('perception_state',{state:s});
  }));

  // Archive field
  const win=$('#archiveWindow'), canvas=$('#archiveCanvas');
  if(win&&canvas){
    const items=[
      [60,80,240,320],[350,34,320,210],[740,120,230,315],[1060,60,330,220],[1490,120,240,325],[1810,48,300,210],
      [150,520,330,220],[560,445,230,315],[900,530,340,220],[1320,455,230,315],[1660,520,330,220],[1980,430,210,300],
      [50,900,220,300],[390,850,330,220],[850,895,220,300],[1260,850,330,220]
    ];
    canvas.innerHTML=items.map((p,i)=>`<button class="archive-card" type="button" data-frame="${i+1}" aria-label="Open archive frame ${String(i+1).padStart(2,'0')}" style="left:${p[0]}px;top:${p[1]}px;width:${p[2]}px;height:${p[3]}px"><img loading="lazy" src="${win.dataset.assetPrefix||''}assets/img/archive-${String(i+1).padStart(2,'0')}.webp" alt="Demo archive frame ${i+1}"><span>${String(i+1).padStart(2,'0')}</span></button>`).join('');
    let tx=0,ty=0,sx=0,sy=0,baseX=0,baseY=0,drag=false;
    const clamp=()=>{const maxX=Math.max(0,(2200-win.clientWidth)/2),maxY=Math.max(0,(1280-win.clientHeight)/2);tx=Math.max(-maxX,Math.min(maxX,tx));ty=Math.max(-maxY,Math.min(maxY,ty));canvas.style.transform=`translate(calc(-50% + ${tx}px),calc(-50% + ${ty}px))`;};
    win.addEventListener('pointerdown',e=>{if(e.target.closest('.archive-card'))return;drag=true;sx=e.clientX;sy=e.clientY;baseX=tx;baseY=ty;win.setPointerCapture(e.pointerId);win.classList.add('dragging')});
    win.addEventListener('pointermove',e=>{if(!drag)return;tx=baseX+e.clientX-sx;ty=baseY+e.clientY-sy;clamp()});
    const end=()=>{drag=false;win.classList.remove('dragging')}; win.addEventListener('pointerup',end);win.addEventListener('pointercancel',end);window.addEventListener('resize',clamp);clamp();
    $$('.archive-card',canvas).forEach(card=>card.addEventListener('click',()=>openLightbox(card.querySelector('img').src,`Archive / ${String(card.dataset.frame).padStart(2,'0')}`)));
    $('#randomFrame')?.addEventListener('click',()=>{const cards=$$('.archive-card',canvas), card=cards[Math.floor(Math.random()*cards.length)];card.click();window.mkTrack?.('archive_random',{frame:card.dataset.frame});});
  }

  // Lightbox
  const lb=$('#lightbox'),lbImg=$('#lightboxImage'),lbLabel=$('#lightboxLabel');
  let lightboxReturnFocus=null;
  function openLightbox(src,label){if(!lb)return;lightboxReturnFocus=document.activeElement;lbImg.src=src;lbLabel.textContent=label;lb.classList.add('open');lb.setAttribute('aria-hidden','false');document.body.classList.add('lock');if(main)main.inert=true;setTimeout(()=>$('#lightboxClose')?.focus(),20);window.mkTrack?.('archive_open',{label});}
  function closeLightbox(){if(!lb||!lb.classList.contains('open'))return;lb.classList.remove('open');lb.setAttribute('aria-hidden','true');document.body.classList.remove('lock');if(main)main.inert=false;lightboxReturnFocus?.focus?.();}
  $('#lightboxClose')?.addEventListener('click',closeLightbox);lb?.addEventListener('click',e=>{if(e.target===lb)closeLightbox()});

  // Inquiry wizard
  const form=$('#projectForm');
  if(form){
    const steps=$$('.step',form), bars=$$('.wizard-progress span',form), back=$('#wizardBack'), next=$('#wizardNext'), submit=$('#wizardSubmit'); let step=0;
    const show=()=>{steps.forEach((s,i)=>s.classList.toggle('active',i===step));bars.forEach((b,i)=>b.classList.toggle('active',i<=step));back.disabled=step===0;next.hidden=step===steps.length-1;submit.hidden=step!==steps.length-1;window.mkTrack?.('inquiry_step',{step:step+1});};
    const valid=()=>{const req=$$('[required]',steps[step]);return req.every(el=>el.type==='radio' ? !!steps[step].querySelector(`[name="${el.name}"]:checked`) : el.value.trim() && el.checkValidity())};
    next?.addEventListener('click',()=>{if(!valid()){const first=$('[required]',steps[step]);first?.reportValidity?.();return;}step=Math.min(steps.length-1,step+1);show();steps[step].scrollIntoView({behavior:'smooth',block:'center'})});
    back?.addEventListener('click',()=>{step=Math.max(0,step-1);show()});
    form.addEventListener('submit',async e=>{
      e.preventDefault();if(!valid())return;
      const status=$('#formStatus'); const endpoint=cfg.formEndpoint;
      if(!endpoint){status.textContent='Demo mode: connect a form endpoint in assets/js/config.js before launch. Nothing was sent.';return;}
      submit.disabled=true;status.textContent='Sending…';
      try{const r=await fetch(endpoint,{method:'POST',headers:{'Accept':'application/json'},body:new FormData(form)});if(!r.ok)throw new Error('Submission failed');form.hidden=true;$('#successCard')?.classList.add('show');status.textContent='';window.mkTrack?.('inquiry_submit',{lane:new FormData(form).get('projectType')});}
      catch(err){status.textContent='Could not send the inquiry. Please try again or use the email link in the footer.';submit.disabled=false;}
    });
    show();
  }

  // Global keyboard
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){setMenu(false);closeLightbox();}});
  $('#year') && ($('#year').textContent=new Date().getFullYear());

  // Instrumentation hooks only; no tracker installed.
  window.mkTrack=window.mkTrack||function(event,data={}){window.dataLayer=window.dataLayer||[];window.dataLayer.push({event,...data});};
})();
