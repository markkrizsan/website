document.documentElement.classList.add('js');
(() => {
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
  const cfg=window.MK_CONFIG||{};

  // Media loader: missing assets stay as intentional black frames.
  const markLoaded=el=>{if(el.complete && el.naturalWidth) el.classList.add('is-loaded');};
  $$('img').forEach(img=>{
    markLoaded(img);
    img.addEventListener('load',()=>img.classList.add('is-loaded'));
    img.addEventListener('error',()=>img.classList.remove('is-loaded'));
  });
  $$('video').forEach(v=>{
    v.addEventListener('canplay',()=>v.classList.add('is-loaded'),{once:true});
    v.play?.().catch(()=>{});
  });

  // Menu + focus management.
  const menu=$('#menuPanel'), open=$('#menuOpen'), close=$('#menuClose'), main=$('main');
  let menuReturnFocus=null;
  const focusables=container=>$$('a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])',container).filter(el=>!el.hidden);
  function setMenu(on){
    if(!menu)return;
    if(on)menuReturnFocus=document.activeElement;
    menu.classList.toggle('open',on);
    menu.setAttribute('aria-hidden',String(!on));
    document.body.classList.toggle('lock',on);
    open?.setAttribute('aria-expanded',String(on));
    if(main)main.inert=on;
    if(on)setTimeout(()=>close?.focus(),20); else menuReturnFocus?.focus?.();
  }
  open?.addEventListener('click',()=>setMenu(true)); close?.addEventListener('click',()=>setMenu(false));
  $$('#menuPanel a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
  menu?.addEventListener('keydown',e=>{
    if(e.key!=='Tab')return;
    const f=focusables(menu); if(!f.length)return;
    const first=f[0],last=f[f.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
  });

  // Reveal.
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in');io.unobserve(entry.target)}}),{threshold:.1});
    $$('.reveal').forEach(el=>io.observe(el));
  } else $$('.reveal').forEach(el=>el.classList.add('in'));

  // Perception state.
  const pStage=$('#perceptionStage'), pCaption=$('#perceptionCaption');
  $$('.perception-nav button').forEach(btn=>btn.addEventListener('click',()=>{
    const state=btn.dataset.state;
    $$('.perception-nav button').forEach(b=>{const active=b===btn;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
    if(pStage)$$('img',pStage).forEach(img=>img.classList.toggle('active',img.dataset.state===state));
    if(pCaption)pCaption.textContent=btn.dataset.caption||'';
    window.mkTrack?.('perception_state',{state});
  }));

  // Collage archive. Designed to show most of the field immediately, with optional light dragging.
  const win=$('#archiveWindow'), canvas=$('#archiveCanvas');
  if(win&&canvas){
    const full=win.dataset.fullArchive==='true';
    const prefix=win.dataset.assetPrefix||'';
    const count=full?24:18;
    const positions=[
      [35,82,250,315,1],[235,35,300,200,2],[505,90,220,290,3],[690,25,310,210,1],[965,92,230,305,3],[1145,45,315,205,2],
      [80,355,320,215,2],[340,300,225,305,4],[535,390,330,210,1],[830,320,225,300,3],[1020,382,330,210,2],[1280,300,220,300,4],
      [25,610,230,270,3],[220,570,315,210,1],[500,625,220,260,4],[700,555,330,220,2],[1010,615,230,270,4],[1215,555,310,215,1],
      [80,760,260,190,3],[365,725,220,250,2],[620,750,300,195,4],[900,715,220,250,1],[1130,760,300,195,3],[1340,700,220,250,2]
    ];
    canvas.innerHTML=positions.slice(0,count).map((p,i)=>`<button class="archive-card" type="button" data-frame="${i+1}" aria-label="Open archive frame ${String(i+1).padStart(2,'0')}" style="left:${p[0]}px;top:${p[1]}px;width:${p[2]}px;height:${p[3]}px;z-index:${p[4]}"><img loading="lazy" src="${prefix}assets/img/archive-${String(i+1).padStart(2,'0')}.jpg" alt="Archive frame ${i+1}"><span>${String(i+1).padStart(2,'0')}</span></button>`).join('');
    $$('img',canvas).forEach(img=>{img.addEventListener('load',()=>img.classList.add('is-loaded'));img.addEventListener('error',()=>img.classList.remove('is-loaded'));markLoaded(img)});
    const CW=1600, CH=1020;
    let ox=0,oy=0,startX=0,startY=0,baseX=0,baseY=0,drag=false,scale=.85;
    const fit=()=>{
      scale=Math.min((win.clientWidth-18)/CW,(win.clientHeight-18)/CH,.95);
      scale=Math.max(scale,.58);
      const overflowX=Math.max(0,(CW*scale-win.clientWidth)/2+70);
      const overflowY=Math.max(0,(CH*scale-win.clientHeight)/2+70);
      ox=Math.max(-overflowX,Math.min(overflowX,ox)); oy=Math.max(-overflowY,Math.min(overflowY,oy));
      canvas.style.transform=`translate(calc(-50% + ${ox}px),calc(-50% + ${oy}px)) scale(${scale})`;
    };
    win.addEventListener('pointerdown',e=>{if(e.target.closest('.archive-card'))return;drag=true;startX=e.clientX;startY=e.clientY;baseX=ox;baseY=oy;win.setPointerCapture(e.pointerId);win.classList.add('dragging')});
    win.addEventListener('pointermove',e=>{if(!drag)return;ox=baseX+(e.clientX-startX)/scale;oy=baseY+(e.clientY-startY)/scale;fit()});
    const end=()=>{drag=false;win.classList.remove('dragging')};win.addEventListener('pointerup',end);win.addEventListener('pointercancel',end);window.addEventListener('resize',fit);fit();
    $$('.archive-card',canvas).forEach(card=>card.addEventListener('click',()=>openLightbox(card.querySelector('img').src,`Archive / ${String(card.dataset.frame).padStart(2,'0')}`)));
  }

  // Lightbox.
  const lb=$('#lightbox'),lbImg=$('#lightboxImage'),lbLabel=$('#lightboxLabel');
  let lightboxReturnFocus=null;
  function openLightbox(src,label){
    if(!lb)return; lightboxReturnFocus=document.activeElement; lbImg.src=src; lbLabel.textContent=label; lb.classList.add('open'); lb.setAttribute('aria-hidden','false'); document.body.classList.add('lock'); if(main)main.inert=true; setTimeout(()=>$('#lightboxClose')?.focus(),20); window.mkTrack?.('archive_open',{label});
  }
  function closeLightbox(){if(!lb||!lb.classList.contains('open'))return;lb.classList.remove('open');lb.setAttribute('aria-hidden','true');document.body.classList.remove('lock');if(main)main.inert=false;lightboxReturnFocus?.focus?.()}
  $('#lightboxClose')?.addEventListener('click',closeLightbox); lb?.addEventListener('click',e=>{if(e.target===lb)closeLightbox()});

  // Inquiry wizard.
  const form=$('#projectForm');
  if(form){
    const steps=$$('.step',form), bars=$$('.wizard-progress span',form), back=$('#wizardBack'), next=$('#wizardNext'), submit=$('#wizardSubmit'); let step=0;
    const show=()=>{steps.forEach((s,i)=>s.classList.toggle('active',i===step));bars.forEach((b,i)=>b.classList.toggle('active',i<=step));back.disabled=step===0;next.hidden=step===steps.length-1;submit.hidden=step!==steps.length-1;window.mkTrack?.('inquiry_step',{step:step+1})};
    const valid=()=>{const req=$$('[required]',steps[step]);return req.every(el=>el.type==='radio'?!!steps[step].querySelector(`[name="${el.name}"]:checked`):el.value.trim()&&el.checkValidity())};
    next?.addEventListener('click',()=>{if(!valid()){const first=$('[required]',steps[step]);first?.reportValidity?.();return}step=Math.min(steps.length-1,step+1);show();steps[step].scrollIntoView({behavior:'smooth',block:'center'})});
    back?.addEventListener('click',()=>{step=Math.max(0,step-1);show()});
    form.addEventListener('submit',async e=>{
      e.preventDefault(); if(!valid())return;
      const status=$('#formStatus'), endpoint=(cfg.formEndpoint||'').trim(), email=(cfg.contactEmail||'').trim();
      const data=new FormData(form);
      if(endpoint){
        submit.disabled=true;status.textContent='Sending…';
        try{const r=await fetch(endpoint,{method:'POST',headers:{Accept:'application/json'},body:data});if(!r.ok)throw new Error('Submission failed');form.hidden=true;$('#successCard')?.classList.add('show');status.textContent='';window.mkTrack?.('inquiry_submit',{lane:data.get('projectType')})}
        catch(err){status.textContent=email?'Could not send the form. Use the email link below instead.':'Could not send the inquiry. Please try again.';submit.disabled=false}
      } else if(email){
        const subject=encodeURIComponent(`Creative inquiry — ${data.get('projectType')||'Project'}`);
        const body=encodeURIComponent(`Name: ${data.get('name')||''}\nEmail: ${data.get('email')||''}\nCompany / project: ${data.get('company')||''}\n\nType: ${data.get('projectType')||''}\nObjective: ${data.get('objective')||''}\nUsage: ${data.get('usage')||''}\nLocation: ${data.get('location')||''}\nTiming: ${data.get('timing')||''}\nBudget context: ${data.get('budget')||''}`);
        window.location.href=`mailto:${email}?subject=${subject}&body=${body}`;
      } else status.textContent='Inquiry routing is not configured yet.';
    });
    show();
  }

  // Contact email links from config.
  $$('[data-contact-email]').forEach(a=>{const email=(cfg.contactEmail||'').trim();if(email){a.href=`mailto:${email}`;a.textContent=email}else a.hidden=true});

  document.addEventListener('keydown',e=>{if(e.key==='Escape'){setMenu(false);closeLightbox()}});
  if($('#year'))$('#year').textContent=new Date().getFullYear();
  window.mkTrack=window.mkTrack||function(event,data={}){window.dataLayer=window.dataLayer||[];window.dataLayer.push({event,...data})};
})();
