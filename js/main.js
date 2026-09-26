/* ==========================================================================
   Ancoravix — UI
   ========================================================================== */
(() => {
  'use strict';

  const WHATSAPP_NUMBER = '5527998886084';
  const DEFAULT_WA_MSG = 'Olá, Ancoravix! Gostaria de solicitar um orçamento.';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  const waLink = (msg = DEFAULT_WA_MSG) =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

  /* ---------- Links de WhatsApp com mensagem pronta ---------- */
  $$('[data-wa]').forEach((a) => { a.href = waLink(a.dataset.waMsg); });

  /* ---------- Ano no rodapé ---------- */
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* ---------- Menu mobile ---------- */
  const body = document.body;
  const toggle = $('[data-nav-toggle]');
  const nav = $('[data-nav]');

  const setNav = (open) => {
    body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    if (open) $('a', nav)?.focus({ preventScroll: true });
  };

  toggle?.addEventListener('click', () => setNav(!body.classList.contains('nav-open')));
  $$('a', nav).forEach((a) => a.addEventListener('click', () => setNav(false)));
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && body.classList.contains('nav-open')) { setNav(false); toggle.focus(); }
  });
  matchMedia('(min-width: 1080px)').addEventListener('change', (e) => { if (e.matches) setNav(false); });

  /* ---------- Header, barra de progresso, parallax (um único loop de scroll) ---------- */
  const header = $('[data-header]');
  const waFloat = $('.wa-float');
  const progressBar = $('.scroll-progress');
  const needsProgressFallback = !CSS.supports('animation-timeline: scroll()');
  const parallaxEls = reducedMotion ? [] : $$('[data-parallax]');
  const steps = $('[data-steps]');
  let lastY = scrollY;
  let ticking = false;

  const onScroll = () => {
    const y = scrollY;
    const vh = innerHeight;

    header.classList.toggle('is-scrolled', y > 24);
    // Esconde o header ao descer e mostra ao subir
    if (!body.classList.contains('nav-open')) {
      header.classList.toggle('is-hidden', y > lastY && y > vh * 0.9);
    }
    waFloat?.classList.toggle('is-visible', y > vh * 0.5);

    if (needsProgressFallback && progressBar) {
      const max = document.documentElement.scrollHeight - vh;
      progressBar.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
    }

    parallaxEls.forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const offset = (r.top + r.height / 2 - vh / 2) * -0.12;
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    });

    if (steps) {
      const r = steps.getBoundingClientRect();
      const p = clamp((vh * 0.7 - r.top) / (r.height * 0.9), 0, 1);
      steps.style.setProperty('--progress', p.toFixed(3));
    }

    lastY = y;
    ticking = false;
  };

  addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  onScroll();

  /* ---------- Animações de entrada ---------- */
  const revealEls = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Contadores ---------- */
  const fmt = new Intl.NumberFormat('pt-BR');
  const runCounter = (el) => {
    const target = Number(el.dataset.count);
    if (reducedMotion) { el.textContent = fmt.format(target); return; }
    const duration = 1800;
    const start = performance.now();
    const tick = (now) => {
      const t = clamp((now - start) / duration, 0, 1);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t); // easeOutExpo
      el.textContent = fmt.format(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      runCounter(entry.target);
      counterIO.unobserve(entry.target);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach((el) => counterIO.observe(el));

  /* ---------- Micro-interações (apenas com mouse) ---------- */
  if (finePointer && !reducedMotion) {
    // Spotlight que segue o cursor
    $$('[data-spotlight]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });

    // Tilt 3D nos cards de produto
    $$('[data-tilt]').forEach((el) => {
      const MAX = 7;
      el.addEventListener('pointerenter', () => el.classList.add('is-tilting'));
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--ry', `${(px * MAX * 2).toFixed(2)}deg`);
        el.style.setProperty('--rx', `${(-py * MAX * 2).toFixed(2)}deg`);
      });
      el.addEventListener('pointerleave', () => {
        el.classList.remove('is-tilting');
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
      });
    });

    // Botões magnéticos
    $$('[data-magnetic]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--bx', `${((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1)}px`);
        el.style.setProperty('--by', `${((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1)}px`);
      });
      el.addEventListener('pointerleave', () => {
        el.style.setProperty('--bx', '0px');
        el.style.setProperty('--by', '0px');
      });
    });
  }

  /* ---------- Marquee: duplica o conteúdo para loop contínuo ---------- */
  const track = $('.marquee-track');
  if (track) track.append(...[...track.children].map((n) => n.cloneNode(true)));

  /* ---------- Link ativo no menu ---------- */
  const navLinks = $$('.main-nav ul a');
  const sectionIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  navLinks.forEach((a) => {
    const section = $(a.getAttribute('href'));
    if (section) sectionIO.observe(section);
  });

  /* ---------- Vídeo do hero (opcional) ---------- */
  const video = $('.hero-video');
  const saveData = navigator.connection?.saveData;
  if (video?.dataset.src && !reducedMotion && !saveData && matchMedia('(min-width: 768px)').matches) {
    video.src = video.dataset.src;
    video.addEventListener('canplay', () => {
      video.classList.add('is-ready');
      video.play().catch(() => {});
    }, { once: true });
    video.load();
  }

  /* ---------- Portfólio: filtros ---------- */
  const gallery = $('[data-gallery]');
  const chips = $$('[data-filter]');
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const f = chip.dataset.filter;
      chips.forEach((c) => {
        const active = c === chip;
        c.classList.toggle('is-active', active);
        c.setAttribute('aria-pressed', String(active));
      });
      $$('.g-item', gallery).forEach((item) => {
        item.classList.toggle('is-hidden', f !== 'all' && item.dataset.cat !== f);
      });
    });
  });

  /* ---------- Portfólio: lightbox ---------- */
  const lb = $('[data-lightbox]');
  const lbImg = $('[data-lb-img]');
  const lbCap = $('[data-lb-caption]');
  let lbItems = [];
  let lbIndex = 0;

  const showLb = (i) => {
    lbIndex = (i + lbItems.length) % lbItems.length;
    const btn = lbItems[lbIndex];
    const img = $('img', btn);
    lbImg.src = btn.dataset.full || img.src;
    lbImg.alt = img.alt;
    const cap = $('.g-caption', btn);
    const cat = $('small', cap)?.textContent.trim();
    const title = [...cap.childNodes].filter((n) => n.nodeType === Node.TEXT_NODE).map((n) => n.textContent).join('').trim();
    lbCap.textContent = cat ? `${cat} · ${title}` : title;
  };

  if (lb && gallery) {
    gallery.addEventListener('click', (e) => {
      const btn = e.target.closest('.g-btn');
      if (!btn) return;
      lbItems = $$('.g-item:not(.is-hidden) .g-btn', gallery);
      showLb(lbItems.indexOf(btn));
      lb.showModal();
    });
    $('[data-lb-close]', lb).addEventListener('click', () => lb.close());
    $('[data-lb-prev]', lb).addEventListener('click', () => showLb(lbIndex - 1));
    $('[data-lb-next]', lb).addEventListener('click', () => showLb(lbIndex + 1));
    lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
    lb.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') showLb(lbIndex - 1);
      if (e.key === 'ArrowRight') showLb(lbIndex + 1);
    });
    let touchX = null;
    lb.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) showLb(lbIndex + (dx < 0 ? 1 : -1));
      touchX = null;
    });
  }

  /* ---------- Formulário → WhatsApp ---------- */
  const form = $('[data-contact-form]');
  const status = $('[data-form-status]');
  const tel = $('#f-tel');

  // Máscara simples: (27) 99999-9999
  tel?.addEventListener('input', () => {
    const d = tel.value.replace(/\D/g, '').slice(0, 11);
    let out = d;
    if (d.length > 2) out = `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length > 7) out = `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
    tel.value = out;
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const errors = [];

    const mark = (name, bad) => form.elements[name].closest('.field').classList.toggle('is-invalid', bad);
    const nomeOk = data.nome?.trim().length >= 2;
    const telOk = (data.telefone || '').replace(/\D/g, '').length >= 10;
    const servOk = Boolean(data.servico);
    const emailOk = !data.email || form.elements.email.checkValidity();
    mark('nome', !nomeOk); if (!nomeOk) errors.push('nome');
    mark('telefone', !telOk); if (!telOk) errors.push('telefone com DDD');
    mark('servico', !servOk); if (!servOk) errors.push('serviço');
    mark('email', !emailOk); if (!emailOk) errors.push('e-mail válido');

    if (errors.length) {
      status.className = 'form-status is-error';
      status.textContent = `Confira: ${errors.join(', ')}.`;
      form.querySelector('.is-invalid input, .is-invalid select')?.focus();
      return;
    }

    const lines = [
      'Olá, Ancoravix! Gostaria de solicitar um orçamento.',
      '',
      `*Nome:* ${data.nome.trim()}`,
      `*Telefone:* ${data.telefone}`,
      data.email ? `*E-mail:* ${data.email}` : null,
      `*Serviço:* ${data.servico}`,
      data.mensagem?.trim() ? `*Mensagem:* ${data.mensagem.trim()}` : null,
    ].filter((l) => l !== null);

    window.open(waLink(lines.join('\n')), '_blank', 'noopener');
    status.className = 'form-status is-ok';
    status.textContent = 'Tudo certo! Abrimos o WhatsApp com sua mensagem — é só enviar.';
    form.reset();
  });

  form?.addEventListener('input', (e) => e.target.closest('.field')?.classList.remove('is-invalid'));
})();
