
/* ── NAVBAR ── */
var nav=document.getElementById('navbar');
window.addEventListener('scroll',function(){
    var y = window.scrollY;
    var capsule = nav.querySelector('.nav-capsule');
    nav.classList.toggle('scrolled', y > 40);
    // Liquid glass quand on scrolle vers le bas au-delà de 80px
    // Retour normal quand on remonte vers le haut
    if(!capsule) return;
    if(y > 80 && y > (_navLastY || 0)){
      capsule.classList.add('liquid');
    } else if(y < (_navLastY || 0) || y <= 80){
      capsule.classList.remove('liquid');
    }
    _navLastY = y;
  },{passive:true});
  var _navLastY = 0;

/* ── HAMBURGER ── */
var hbg=document.getElementById('hamburger'),mob=document.getElementById('mobile-menu');
function toggleMob(open){
  hbg.classList.toggle('open',open);
  if(open){mob.style.display='flex';setTimeout(function(){mob.style.opacity='1';},10);}
  else{mob.style.opacity='0';setTimeout(function(){mob.style.display='none';},300);}
  hbg.setAttribute('aria-expanded',open);mob.setAttribute('aria-hidden',!open);
  document.body.style.overflow=open?'hidden':'';
}
hbg.addEventListener('click',function(){toggleMob(!hbg.classList.contains('open'));});
document.querySelectorAll('.mob-link').forEach(function(l){l.addEventListener('click',function(){toggleMob(false);});});

/* ── COUNTUP ── */
function countUp(el){
  if(el.dataset.done)return;el.dataset.done='1';
  var target=parseFloat(el.dataset.target),suffix=el.dataset.suffix||'';
  var dur=1800,start=performance.now();
  (function step(now){
    var p=Math.min((now-start)/dur,1),ease=1-Math.pow(1-p,3);
    el.textContent=Math.round(target*ease)+suffix;
    if(p<1)requestAnimationFrame(step);else el.textContent=target+suffix;
  })(start);
}
window.addEventListener('load',function(){document.querySelectorAll('.count-h').forEach(function(el){countUp(el);});});

/* ── COUNTUP — déclenché au chargement ── */
window.addEventListener('load', function(){
  document.querySelectorAll('[data-target]').forEach(function(el){ countUp(el); });
});

/* ── FAQ ── */
document.querySelectorAll('.faq-q').forEach(function(btn){
  btn.addEventListener('click',function(){
    var item=btn.closest('.faq-item'),open=item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(function(i){i.classList.remove('open');i.querySelector('.faq-q').setAttribute('aria-expanded','false');});
    if(!open){item.classList.add('open');btn.setAttribute('aria-expanded','true');}
  });
});

/* ── COMP TABLE TOGGLE ── */
var compToggle=document.getElementById('comp-toggle');
var compTableWrap=document.getElementById('comp-table-wrap');
if(compToggle&&compTableWrap){
  compToggle.addEventListener('click',function(){
    var open=compToggle.classList.contains('open');
    compToggle.classList.toggle('open',!open);
    compToggle.setAttribute('aria-expanded',!open);
    if(!open){
      compTableWrap.style.display='block';
      compToggle.innerHTML='Ocultar comparación detallada <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="2,10 7,4 12,10"/></svg>';
    } else {
      compTableWrap.style.display='none';
      compToggle.innerHTML='Ver comparación detallada <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="2,4 7,10 12,4"/></svg>';
    }
  });
}

/* ── TEMPLATE WALL ANIMATION ── */
(function(){
  var wall = document.getElementById('twall');
  if(!wall) return;
  var tiles = Array.from(wall.querySelectorAll('.tile'));
  var total = tiles.length;
  var litSet = new Set();
  var maxLit = Math.floor(total * 0.35); // 35% allumées max simultanément

  function lightUp(){
    // Allume 2-4 tiles aléatoires
    var toLight = 2 + Math.floor(Math.random() * 3);
    var off = tiles.filter(function(t){ return !litSet.has(t); });
    shuffle(off).slice(0, toLight).forEach(function(t){
      t.classList.add('lit');
      t.classList.remove('dim');
      litSet.add(t);
    });

    // Si trop allumées, en éteint quelques-unes
    if(litSet.size > maxLit){
      var arr = Array.from(litSet);
      shuffle(arr).slice(0, 3).forEach(function(t){
        t.classList.remove('lit');
        t.classList.add('dim');
        litSet.delete(t);
        // Retire le dim après la transition
        setTimeout(function(){ t.classList.remove('dim'); }, 800);
      });
    }
  }

  function shuffle(a){
    for(var i=a.length-1;i>0;i--){
      var j=Math.floor(Math.random()*(i+1));
      var tmp=a[i];a[i]=a[j];a[j]=tmp;
    }
    return a;
  }

  // Init — allume 8 tiles au départ
  shuffle(tiles).slice(0, 8).forEach(function(t){
    t.classList.add('lit');
    litSet.add(t);
  });

  // Cycle principal — toutes les 400ms
  setInterval(lightUp, 400);
})();

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(function(a){
  a.addEventListener('click',function(e){
    var t=document.querySelector(a.getAttribute('href'));
    if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'});}
  });
});

/* ── BILLING TOGGLE ── */
document.addEventListener('DOMContentLoaded', function(){
  var toggle=document.getElementById('billing-toggle');
  var grid=document.getElementById('pricing-grid');
  var lblM=document.getElementById('lbl-monthly');
  var lblA=document.getElementById('lbl-annual');
  if(!toggle||!grid)return;

  function setAnnual(on){
    /* Toggle apparence */
    toggle.classList.toggle('annual',on);
    toggle.setAttribute('aria-checked',String(on));

    /* Prix mensuels/annuels */
    grid.classList.toggle('billing-annual',on);
    grid.classList.toggle('billing-monthly',!on);

    /* Labels toggle */
    lblA.classList.toggle('active',on);
    lblM.classList.toggle('active',!on);

    /* Badges remise */
    document.querySelectorAll('.billing-annual-only').forEach(function(el){
      el.style.display=on?'inline-flex':'none';
    });

    /* Badge engagement — affecte TOUS les éléments de la page */
    document.querySelectorAll('.no-eng-monthly').forEach(function(el){
      el.style.display=on?'none':'inline';
    });
    document.querySelectorAll('.no-eng-annual').forEach(function(el){
      el.style.display=on?'inline':'none';
    });
  }
  // Init avec annuel par défaut
  setAnnual(true);
  toggle.addEventListener('click',function(){
    var isAnnual = toggle.classList.contains('annual');
    setAnnual(!isAnnual);
  });
  toggle.addEventListener('keydown',function(e){
    if(e.key===' '||e.key==='Enter'){e.preventDefault();toggle.click();}
  });
});

/* smooth scroll + navbar scroll — déclarés plus haut, pas de doublon */

/* ── CTA PRICING → empezar.html ── */
/* Lit l'état du toggle billing pour passer le bon paramètre à l'URL */
function goEmpezar(plan){
  var toggle = document.getElementById('billing-toggle');
  var billing = (toggle && toggle.classList.contains('annual')) ? 'annual' : 'monthly';
  window.location.href = 'empezar.html?plan=' + plan + '&billing=' + billing;
}





(function(){
  var cv = document.getElementById('hero-canvas');
  if(!cv) return;

  /* ── WebGL shader lines — transparent, top/bottom uniquement ── */
  var gl = cv.getContext('webgl',{alpha:true,premultipliedAlpha:false})
         || cv.getContext('experimental-webgl',{alpha:true,premultipliedAlpha:false});
  if(!gl){ cv.style.display='none'; return; }

  /* Vertex shader */
  var vs = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vs, 'attribute vec2 a;void main(){gl_Position=vec4(a,0.0,1.0);}');
  gl.compileShader(vs);

  /* Fragment shader — lignes numériques bleues sur fond transparent */
  var fs = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fs, [
    'precision highp float;',
    'uniform vec2 r;',
    'uniform float t;',
    'float rnd(float x){return fract(sin(x)*1e4);}',
    'void main(){',
    '  vec2 uv=(gl_FragCoord.xy*2.0-r)/min(r.x,r.y);',
    /* Pixelation mosaic — effet lignes numériques */
    '  vec2 ms=vec2(4.0,2.0);',
    '  vec2 ss=vec2(256.0,256.0);',
    '  uv.x=floor(uv.x*ss.x/ms.x)/(ss.x/ms.x);',
    '  uv.y=floor(uv.y*ss.y/ms.y)/(ss.y/ms.y);',
    '  float tt=t*0.022+rnd(uv.x)*2.2;',
    '  float lw=0.0009;',
    '  vec3 col=vec3(0.0);',
    '  for(int j=0;j<3;j++){',
    '    for(int i=0;i<5;i++){',
    '      col[j]+=lw*float(i*i)/abs(',
    '        fract(tt-0.01*float(j)+float(i)*0.01)*2.2',
    '        -length(uv));',
    '    }',
    '  }',
    '  col=clamp(col,0.0,1.0);',
    /* Palette bleue site #0047FF — fond transparent */
    '  float bright=col[0]*0.5+col[1]*0.3+col[2]*0.2;',
    '  bright=clamp(bright*0.92,0.0,0.86);',
    '  vec3 c=vec3(',
    '    col[2]*0.06,',
    '    col[1]*0.20+bright*0.10,',
    '    col[0]*0.60+bright*0.38);',
    '  c=clamp(c,0.0,1.0);',
    '  gl_FragColor=vec4(c,bright);',
    '}'
  ].join(''));
  gl.compileShader(fs);

  var prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.useProgram(prog);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  /* Full-screen quad */
  var vbuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  var aLoc = gl.getAttribLocation(prog, 'a');
  gl.enableVertexAttribArray(aLoc);
  gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0);

  var uR = gl.getUniformLocation(prog, 'r');
  var uT = gl.getUniformLocation(prog, 't');

  function shaderResize(){
    var w = cv.offsetWidth  || window.innerWidth;
    var h = cv.offsetHeight || window.innerHeight;
    cv.width = w; cv.height = h;
    gl.viewport(0, 0, w, h);
    gl.uniform2f(uR, w, h);
  }
  shaderResize();
  window.addEventListener('resize', shaderResize);

  var shaderTime = 18.0;
  function renderShader(){
    requestAnimationFrame(renderShader);
    shaderTime += 0.016;
    gl.clearColor(0,0,0,0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(uT, shaderTime);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  renderShader();

/* ── FORMULAIRE DE CONTACT ── */
window.addEventListener('load', function(){
  var _cfData = { sector:'', need:'', budget:'' };

  window.cfSelect = function(el, field){
    var parent = el.parentNode;
    parent.querySelectorAll('.cf-option').forEach(function(o){ o.classList.remove('selected'); });
    el.classList.add('selected');
    _cfData[field] = el.textContent.trim();
    // Activer le bouton suivant
    var step = el.closest('.cf-step');
    if(step){
      var btn = step.querySelector('.cf-btn-next');
      if(btn) btn.disabled = false;
    }
  };

  window.cfNext = function(step){
    // Validation step 1
    if(step === 1){
      var nom = document.getElementById('cf-nombre').value.trim();
      var email = document.getElementById('cf-email').value.trim();
      if(!nom || !email){ 
        document.getElementById('cf-nombre').style.borderColor = nom ? '' : 'rgba(239,68,68,.6)';
        document.getElementById('cf-email').style.borderColor = email ? '' : 'rgba(239,68,68,.6)';
        return;
      }
    }
    document.getElementById('cf-step-'+step).classList.remove('active');
    document.getElementById('cf-step-'+(step+1)).classList.add('active');
    cfUpdateProgress(step+1);
    // Pré-remplir le message de succès avec le prénom
    if(step === 1){
      var prenom = document.getElementById('cf-nombre').value.trim().split(' ')[0];
      document.getElementById('cf-success-name').textContent = '¡Gracias, '+prenom+'!';
    }
  };

  window.cfBack = function(step){
    document.getElementById('cf-step-'+step).classList.remove('active');
    document.getElementById('cf-step-'+(step-1)).classList.add('active');
    cfUpdateProgress(step-1);
  };

  function cfUpdateProgress(activeStep){
    var dots = document.querySelectorAll('.cf-progress-dot');
    dots.forEach(function(d,i){
      d.classList.remove('active','done');
      if(i+1 < activeStep) d.classList.add('done');
      else if(i+1 === activeStep) d.classList.add('active');
    });
  }

  window.cfSubmit = function(){
    var nombre  = document.getElementById('cf-nombre').value.trim();
    var email   = document.getElementById('cf-email').value.trim();
    var mensaje = document.getElementById('cf-mensaje').value.trim();

    var whatsapp = document.getElementById('cf-whatsapp').value.trim();
    var emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    var waValid    = whatsapp === '' ? false : /^\+/.test(whatsapp);
    var valid = nombre && emailValid && mensaje && waValid;

    if(!valid){
      if(!nombre)       document.getElementById('cf-nombre').style.borderColor='#f87171';
      if(!emailValid)   document.getElementById('cf-email').style.borderColor='#f87171';
      if(!mensaje)      document.getElementById('cf-mensaje').style.borderColor='#f87171';
      if(!waValid)      document.getElementById('cf-whatsapp').style.borderColor='#f87171';
      return;
    }

    var btn = document.querySelector('#cf-simple .cf-btn-next');
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    var payload = {
      nombre:   nombre,
      empresa:  document.getElementById('cf-empresa').value.trim(),
      email:    email,
      whatsapp: document.getElementById('cf-whatsapp').value.trim(),
      mensaje:  mensaje,
      fuente:   'CCentre.website — Formulario de contacto',
      fecha:    (function(){var d=new Date(new Date().toLocaleString('en-US',{timeZone:'America/Asuncion'}));var pad=function(n){return n<10?'0'+n:n};return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())+' '+pad(d.getHours())+':'+pad(d.getMinutes())+' (PY)'})()
    };

    var WEBHOOK = 'https://hook.us2.make.com/iv3fcage0cn339rr4mksiwp671sjutrz';

    fetch(WEBHOOK, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(payload)
    })
    .then(function(){ cfShowSuccess(payload); })
    .catch(function(){ cfShowSuccess(payload); });
  };

  function cfShowSuccess(payload){
    document.getElementById('cf-simple').style.display = 'none';
    var prenom = payload.nombre.split(' ')[0];
    document.getElementById('cf-success-name').textContent = '¡Gracias, '+prenom+'!';
    document.getElementById('cf-success-msg').innerHTML =
      'Hemos recibido su mensaje y le responderemos en <strong style="color:#a5b4fc">'+payload.email+'</strong>.';
    document.getElementById('cf-success').classList.add('active');
  }

  // Resetear borde rojo al escribir
  ['cf-nombre','cf-email','cf-mensaje'].forEach(function(id){
    var el = document.getElementById(id);
    if(el) el.addEventListener('input', function(){ this.style.borderColor=''; });
  });
});


/* ── MAQUETTE FORM ── */
window.addEventListener('load', function(){
  var _maq = { sector:'', objetivo:'', estilo:'', contenido:[], referencia:'' };
  var _maqStep = 1;
  var _maqTotal = 6;

  function maqProgress(step){
    document.getElementById('maq-progress').style.width = (step / _maqTotal * 100) + '%';
  }

  window.maqSel = function(el, field){
    var parent = el.closest('.maq-options');
    parent.querySelectorAll('.maq-option').forEach(function(o){ o.classList.remove('selected'); });
    el.classList.add('selected');
    var isOtro = el.classList.contains('maq-option-otro');
    // Gérer le champ libre
    var freeInput = document.getElementById('maq-'+field+'-otro');
    if(freeInput){
      freeInput.classList.toggle('visible', isOtro);
      if(isOtro){ freeInput.focus(); _maq[field] = ''; }
      else { _maq[field] = el.textContent.trim(); }
    } else {
      _maq[field] = el.textContent.trim();
    }
    // Référence — afficher champ URL
    if(field === 'referencia'){
      var refUrl = document.getElementById('maq-ref-url');
      if(refUrl) refUrl.style.display = el.textContent.includes('Sí') ? 'block' : 'none';
      _maq.referencia = el.textContent.trim();
    }
    var btn = el.closest('.maq-step').querySelector('.maq-btn-next');
    if(btn && !isOtro) btn.disabled = false;
    else if(btn && isOtro) btn.disabled = true;
  };

  window.maqOtroInput = function(field){
    var inp = document.getElementById('maq-'+field+'-otro');
    if(!inp) return;
    _maq[field] = inp.value.trim();
    var step = inp.closest('.maq-step');
    var btn = step ? step.querySelector('.maq-btn-next') : null;
    if(btn) btn.disabled = !inp.value.trim();
  };

  window.maqMulti = function(el, field){
    el.classList.toggle('selected');
    _maq[field] = Array.from(el.closest('.maq-options').querySelectorAll('.maq-option.selected'))
      .map(function(o){ return o.textContent.trim(); });
  };

  window.maqNext = function(step){
    document.getElementById('maq-s'+step).classList.remove('active');
    var next = step + 1;
    document.getElementById('maq-s'+next).classList.add('active');
    _maqStep = next;
    maqProgress(next);
  };

  window.maqBack = function(step){
    document.getElementById('maq-s'+step).classList.remove('active');
    var prev = step - 1;
    document.getElementById('maq-s'+prev).classList.add('active');
    _maqStep = prev;
    maqProgress(prev);
  };

  // Étape 5 — activer next si référence sélectionnée
  document.querySelectorAll('#maq-s5 .maq-option').forEach(function(opt){
    opt.addEventListener('click', function(){
      var btn = document.getElementById('maq-n5');
      if(btn) btn.disabled = false;
    });
  });

  window.maqSubmit = function(){
    var nombre  = document.getElementById('maq-nombre').value.trim();
    var empresa = document.getElementById('maq-empresa').value.trim();
    var email   = document.getElementById('maq-email').value.trim();
    var wp      = document.getElementById('maq-wp').value.trim();
    var nombreEl  = document.getElementById('maq-nombre');
    var empresaEl = document.getElementById('maq-empresa');
    var emailEl   = document.getElementById('maq-email');
    var wpEl      = document.getElementById('maq-wp');
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var wpRegex    = /^\+\d{6,15}$/;
    var valid = true;
    function setErr(el, errId, msg){
      var errEl = document.getElementById(errId);
      if(msg){ el.classList.add('error'); if(errEl) errEl.textContent = msg; }
      else    { el.classList.remove('error'); if(errEl) errEl.textContent = ''; }
    }
    setErr(nombreEl,  'err-nombre',  !nombre  ? 'Por favor, ingrese su nombre.'       : '');
    setErr(empresaEl, 'err-empresa', !empresa ? 'Por favor, ingrese su negocio.'      : '');
    setErr(emailEl,   'err-email',   !email   ? 'El correo es obligatorio.'           : !emailRegex.test(email) ? 'Formato incorrecto. Ej: nombre@mail.com' : '');
    setErr(wpEl,      'err-wp',      !wp      ? 'El WhatsApp es obligatorio.'         : !wpRegex.test(wp)       ? 'Debe comenzar con + seguido de números. Ej: +595991234567' : '');
    if(!nombre || !empresa || !email || !emailRegex.test(email) || !wp || !wpRegex.test(wp)){ valid = false; }
    if(!valid) return;

    var btn = document.getElementById('maq-n6');
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    var payload = {
      nombre:    document.getElementById('maq-nombre').value.trim(),
      empresa:   document.getElementById('maq-empresa').value.trim(),
      email:     email,
      whatsapp:  wp,
      sector:    _maq.sector,
      objetivo:  _maq.objetivo,
      estilo:    _maq.estilo,
      contenido: _maq.contenido.join(', '),
      referencia:_maq.referencia,
      ref_url:   document.getElementById('maq-ref-url') ? document.getElementById('maq-ref-url').value : '',
      notas:     document.getElementById('maq-ref-notas').value.trim(),
      fuente:    'CCentre.website — Solicitud maqueta gratuita',
      fecha:     (function(){var d=new Date(new Date().toLocaleString('en-US',{timeZone:'America/Asuncion'}));var pad=function(n){return n<10?'0'+n:n};return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())+' '+pad(d.getHours())+':'+pad(d.getMinutes())+' (PY)'})()
    };

    var WEBHOOK = 'https://hook.us2.make.com/hr29fsrmcksx62kts4nsyvu2m0x4jbri';
    var prenom = payload.nombre ? payload.nombre.split(' ')[0] : 'aquí';

    function showSuccess(){
      document.querySelectorAll('.maq-step').forEach(function(s){ s.classList.remove('active'); });
      document.getElementById('maq-progress').style.width = '100%';
      var t = document.getElementById('maq-success-title');
      var m = document.getElementById('maq-success-msg');
      if(t) t.textContent = prenom !== 'aquí' ? '¡'+prenom+', su maqueta está en camino!' : '¡Su maqueta está en camino!';
      if(m) m.innerHTML = 'Nuestro equipo ya está diseñando su sitio de <strong>'+( payload.sector||'su sector')+'</strong>.<br>La recibirá en <strong>'+email+'</strong> en menos de 24 horas.';
      document.getElementById('maq-success').classList.add('active');
    }

    if(WEBHOOK === 'WEBHOOK_URL_PLACEHOLDER'){
      setTimeout(showSuccess, 900);
      return;
    }
    fetch(WEBHOOK,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
      .then(showSuccess).catch(showSuccess);
  };
});

})();




/* Lightbox */
function openLightbox(src, title) {
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox-caption').textContent = title;
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeLightbox();
});

/* ══════════════════════════════════════════════
   ANIMATIONS CARDS SERVICES
══════════════════════════════════════════════ */
(function() {
  function initCardAnimations() {
    const cards = document.querySelectorAll('.svc-card');
    if (!cards.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const card = entry.target;
          card.classList.add('is-visible');
          // Lancer le compteur de likes si présent
          card.querySelectorAll('.anim-likes').forEach(el => {
            animateLikes(el);
          });
          observer.unobserve(card);
        }
      });
    }, { threshold: 0.3 });

    cards.forEach(card => observer.observe(card));

    // Re-déclencher au hover pour rejouer l'animation
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.classList.remove('is-visible');
        // Reset likes
        card.querySelectorAll('.anim-likes').forEach(el => {
          el.textContent = '❤️ 0';
        });
        void card.offsetWidth; // force reflow
        card.classList.add('is-visible');
        card.querySelectorAll('.anim-likes').forEach(el => {
          animateLikes(el);
        });
      });
    });
  }

  function animateLikes(el) {
    const target = parseInt(el.dataset.target || 0);
    const duration = 1200;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = '❤️ ' + current;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCardAnimations);
  } else {
    initCardAnimations();
  }
})();
