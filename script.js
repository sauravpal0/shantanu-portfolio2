/* ═══════════════════════════════════════════════════
   SHANTANU PAL — Clinical Research Coordinator
   Portfolio Script
   ═══════════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────────────────
   1. CUSTOM CURSOR
────────────────────────────────────────────────── */
(function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    dot.style.left  = e.clientX + 'px';
    dot.style.top   = e.clientY + 'px';
    // Smooth lag for ring
    rx += (e.clientX - rx) * 0.18;
    ry += (e.clientY - ry) * 0.18;
    ring.style.left = e.clientX + 'px';
    ring.style.top  = e.clientY + 'px';
  });

  // Scale ring on hover of interactive elements
  document.querySelectorAll('a, button, .glass-card, .skill-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width  = '58px';
      ring.style.height = '58px';
      ring.style.borderColor = 'rgba(0,245,212,0.9)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width  = '34px';
      ring.style.height = '34px';
      ring.style.borderColor = 'rgba(0,245,212,0.55)';
    });
  });
})();

/* ──────────────────────────────────────────────────
   2. NAVBAR SCROLL EFFECT
────────────────────────────────────────────────── */
(function initNavbar() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // Mobile menu
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  const mobLinks    = document.querySelectorAll('.mob-link');

  hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
  mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
  mobLinks.forEach(l => l.addEventListener('click', () => mobileMenu.classList.remove('open')));
})();

/* ──────────────────────────────────────────────────
   3. THREE.JS — HERO DNA HELIX
────────────────────────────────────────────────── */
(function initThreeJS() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.parentElement.offsetWidth, canvas.parentElement.offsetHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 0.1, 1000);
  camera.position.set(0, 0, 18);

  // ─── DNA Helix ───
  const group = new THREE.Group();
  scene.add(group);

  const totalPoints = 120;
  const helixRadius  = 3.5;
  const helixHeight  = 22;
  const helixTurns   = 5;

  const mat1 = new THREE.MeshStandardMaterial({ color: 0x00f5d4, emissive: 0x00f5d4, emissiveIntensity: 0.6, roughness: 0.3 });
  const mat2 = new THREE.MeshStandardMaterial({ color: 0x00b4d8, emissive: 0x00b4d8, emissiveIntensity: 0.5, roughness: 0.3 });
  const matBridge = new THREE.MeshStandardMaterial({ color: 0x0077b6, emissive: 0x0077b6, emissiveIntensity: 0.3, roughness: 0.5 });

  const sphereGeo = new THREE.SphereGeometry(0.18, 10, 10);
  const cyl = new THREE.CylinderGeometry(0.06, 0.06, 1, 8);

  for (let i = 0; i < totalPoints; i++) {
    const t = i / totalPoints;
    const angle = t * Math.PI * 2 * helixTurns;
    const y = t * helixHeight - helixHeight / 2;

    // Strand 1
    const x1 = Math.cos(angle) * helixRadius;
    const z1 = Math.sin(angle) * helixRadius;
    const s1 = new THREE.Mesh(sphereGeo, mat1);
    s1.position.set(x1, y, z1);
    group.add(s1);

    // Strand 2
    const x2 = Math.cos(angle + Math.PI) * helixRadius;
    const z2 = Math.sin(angle + Math.PI) * helixRadius;
    const s2 = new THREE.Mesh(sphereGeo, mat2);
    s2.position.set(x2, y, z2);
    group.add(s2);

    // Bridge (every 4 nodes)
    if (i % 4 === 0) {
      const bridge = new THREE.Mesh(cyl, matBridge);
      bridge.scale.y = Math.sqrt((x2-x1)**2 + (z2-z1)**2 + 0.01);
      bridge.position.set((x1+x2)/2, y, (z1+z2)/2);
      bridge.lookAt(new THREE.Vector3(x2, y, z2));
      bridge.rotateX(Math.PI/2);
      group.add(bridge);
    }
  }

  // Lighting
  const ambLight = new THREE.AmbientLight(0x002244, 2);
  scene.add(ambLight);
  const ptLight1 = new THREE.PointLight(0x00f5d4, 3, 40);
  ptLight1.position.set(8, 5, 8);
  scene.add(ptLight1);
  const ptLight2 = new THREE.PointLight(0x00b4d8, 2, 30);
  ptLight2.position.set(-8, -5, 6);
  scene.add(ptLight2);

  // Floating molecule spheres
  const moleculeGeo  = new THREE.SphereGeometry(0.35, 12, 12);
  const moleculeMat  = new THREE.MeshStandardMaterial({ color: 0x00f5d4, emissive: 0x00f5d4, emissiveIntensity: 0.4, transparent: true, opacity: 0.55 });
  const molecules = [];
  for (let i = 0; i < 20; i++) {
    const m = new THREE.Mesh(moleculeGeo, moleculeMat.clone());
    m.position.set(
      (Math.random() - 0.5) * 28,
      (Math.random() - 0.5) * 22,
      (Math.random() - 0.5) * 14 - 4
    );
    m.userData = { speed: 0.002 + Math.random() * 0.004, offset: Math.random() * Math.PI * 2 };
    scene.add(m);
    molecules.push(m);
  }

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener('resize', () => {
    const w = canvas.parentElement.offsetWidth;
    const h = canvas.parentElement.offsetHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });

  let clock = 0;
  function animate() {
    requestAnimationFrame(animate);
    clock += 0.006;
    group.rotation.y = clock * 0.35 + mouseX * 0.12;
    group.rotation.x = mouseY * 0.06;
    molecules.forEach((m, i) => {
      m.position.y += Math.sin(clock + m.userData.offset) * m.userData.speed;
      m.position.x += Math.cos(clock * 0.7 + m.userData.offset) * m.userData.speed * 0.6;
      m.rotation.x += 0.01;
      m.rotation.z += 0.008;
      if (m.position.y > 12)  m.position.y = -12;
      if (m.position.y < -12) m.position.y = 12;
    });
    renderer.render(scene, camera);
  }
  animate();
})();

/* ──────────────────────────────────────────────────
   4. FLOATING PARTICLES (CSS-based)
────────────────────────────────────────────────── */
(function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const colors = ['#00f5d4','#00b4d8','#0077b6','#023e8a'];

  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = 2 + Math.random() * 5;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      opacity: ${0.2 + Math.random() * 0.5};
      animation-duration: ${8 + Math.random() * 18}s;
      animation-delay: ${-Math.random() * 18}s;
    `;
    container.appendChild(p);
  }
})();

/* ──────────────────────────────────────────────────
   5. TYPING EFFECT (Hero title)
────────────────────────────────────────────────── */
(function initTyping() {
  const el = document.getElementById('typedTitle');
  if (!el) return;
  const lines = [
    'Clinical Research Coordinator',
    'ICH-GCP Specialist',
    'Oncology RWE Expert',
    'PharmD | Hyderabad, India'
  ];
  let li = 0, ci = 0, deleting = false;

  function type() {
    const full = lines[li];
    if (!deleting) {
      el.textContent = full.slice(0, ci + 1);
      ci++;
      if (ci === full.length) { deleting = true; setTimeout(type, 1800); return; }
    } else {
      el.textContent = full.slice(0, ci - 1);
      ci--;
      if (ci === 0) { deleting = false; li = (li + 1) % lines.length; }
    }
    setTimeout(type, deleting ? 45 : 75);
  }
  type();
})();

/* ──────────────────────────────────────────────────
   6. SCROLL-TRIGGERED REVEAL
────────────────────────────────────────────────── */
(function initReveal() {
  const items = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('revealed'), i * 80);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(item => io.observe(item));

  // Trigger th-fill and skill bars when card is revealed
  const thCards = document.querySelectorAll('.th-card');
  const thIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        thIo.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  thCards.forEach(c => thIo.observe(c));

  // Skill fill bars
  const skillCards = document.querySelectorAll('.skill-card');
  const skIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.sk-fill');
        const w    = fill.dataset.w;
        fill.style.setProperty('--w', w);
        entry.target.classList.add('revealed');
        fill.style.width = w + '%';
        skIo.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  skillCards.forEach(c => skIo.observe(c));
})();

/* ──────────────────────────────────────────────────
   7. STAT COUNTER ANIMATION
────────────────────────────────────────────────── */
(function initCounters() {
  const nums = document.querySelectorAll('.stat-num[data-target]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = +entry.target.dataset.target;
        let count = 0;
        const step = Math.max(1, Math.ceil(target / 40));
        const interval = setInterval(() => {
          count = Math.min(count + step, target);
          entry.target.textContent = count;
          if (count >= target) clearInterval(interval);
        }, 40);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  nums.forEach(n => io.observe(n));
})();

/* ──────────────────────────────────────────────────
   8. RESEARCH CHARTS (Canvas 2D donut charts)
────────────────────────────────────────────────── */
(function initCharts() {
  function drawDonut(id, percent, color) {
    const canvas = document.getElementById(id);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cx = 60, cy = 60, r = 46, lineW = 8;
    const start = -Math.PI / 2;
    const end   = start + (2 * Math.PI * percent / 100);

    // Background ring
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0,180,216,0.1)';
    ctx.lineWidth = lineW;
    ctx.stroke();

    // Progress arc
    ctx.beginPath();
    ctx.arc(cx, cy, r, start, end);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineW;
    ctx.lineCap = 'round';
    ctx.shadowColor = color;
    ctx.shadowBlur = 14;
    ctx.stroke();
  }

  // Animate on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Animate ESR chart (improvement %)
        let v = 0;
        const t1 = setInterval(() => {
          v = Math.min(v + 2, 72);
          drawDonut('esrChart', v, '#00f5d4');
          if (v >= 72) clearInterval(t1);
        }, 20);

        // Animate DAS28 chart
        let v2 = 0;
        const t2 = setInterval(() => {
          v2 = Math.min(v2 + 2, 85);
          drawDonut('das28Chart', v2, '#00b4d8');
          if (v2 >= 85) clearInterval(t2);
        }, 20);
        io.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const rc = document.querySelector('.research-card');
  if (rc) io.observe(rc);
})();

/* ──────────────────────────────────────────────────
   9. CERTIFICATIONS CAROUSEL
────────────────────────────────────────────────── */
(function initCarousel() {
  const carousel = document.getElementById('certCarousel');
  const prevBtn  = document.getElementById('certPrev');
  const nextBtn  = document.getElementById('certNext');
  const dotsWrap = document.getElementById('certDots');
  if (!carousel || !prevBtn || !nextBtn) return;

  const cards   = carousel.querySelectorAll('.cert-card');
  const total   = cards.length;
  let index     = 0;
  const visible = () => window.innerWidth < 600 ? 1 : window.innerWidth < 1024 ? 2 : 3;

  // Build dots
  function buildDots() {
    dotsWrap.innerHTML = '';
    const pages = Math.ceil(total / visible());
    for (let i = 0; i < pages; i++) {
      const d = document.createElement('button');
      d.className = 'cert-dot' + (i === 0 ? ' active' : '');
      d.addEventListener('click', () => { index = i; update(); });
      dotsWrap.appendChild(d);
    }
  }

  function update() {
    const cardW = 260 + 24;
    carousel.style.transform = `translateX(-${index * cardW * visible()}px)`;
    carousel.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
    dotsWrap.querySelectorAll('.cert-dot').forEach((d, i) => d.classList.toggle('active', i === index));
  }

  prevBtn.addEventListener('click', () => {
    const pages = Math.ceil(total / visible());
    index = (index - 1 + pages) % pages;
    update();
  });
  nextBtn.addEventListener('click', () => {
    const pages = Math.ceil(total / visible());
    index = (index + 1) % pages;
    update();
  });

  buildDots();
  window.addEventListener('resize', () => { index = 0; buildDots(); update(); });

  // Auto-play
  setInterval(() => {
    const pages = Math.ceil(total / visible());
    index = (index + 1) % pages;
    update();
  }, 4500);
})();

/* ──────────────────────────────────────────────────
   10. GSAP SCROLL ANIMATIONS (if GSAP available)
────────────────────────────────────────────────── */
(function initGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Hero content entrance
  gsap.from('.hero-left > *', {
    y: 50, opacity: 0,
    stagger: 0.12,
    duration: 1,
    ease: 'power3.out',
    delay: 0.4
  });
  gsap.from('.hero-right', {
    x: 60, opacity: 0,
    duration: 1.2,
    ease: 'power3.out',
    delay: 0.6
  });

  // Section titles parallax
  gsap.utils.toArray('.section-title').forEach(title => {
    gsap.from(title, {
      scrollTrigger: { trigger: title, start: 'top 85%', end: 'top 40%', scrub: false },
      y: 30, opacity: 0,
      duration: 0.9,
      ease: 'power2.out'
    });
  });

  // Metric cards stagger
  gsap.utils.toArray('.metric-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 88%' },
      y: 40, opacity: 0, scale: 0.95,
      duration: 0.7,
      delay: i * 0.1,
      ease: 'back.out(1.5)'
    });
  });

  // Skill cards stagger
  gsap.utils.toArray('.skill-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 90%' },
      y: 30, opacity: 0,
      duration: 0.5,
      delay: (i % 4) * 0.08,
      ease: 'power2.out'
    });
  });

  // Contact cards stagger
  gsap.utils.toArray('.contact-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 88%' },
      y: 30, opacity: 0,
      duration: 0.6,
      delay: i * 0.1,
      ease: 'power2.out'
    });
  });
})();

/* ──────────────────────────────────────────────────
   11. 3D CARD TILT (mouse-follow)
────────────────────────────────────────────────── */
(function initTilt() {
  const cards = document.querySelectorAll('.glass-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width / 2;
      const cy     = rect.top + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `perspective(800px) rotateY(${dx * 5}deg) rotateX(${-dy * 4}deg) translateZ(6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ──────────────────────────────────────────────────
   12. SMOOTH ACTIVE NAV LINK on scroll
────────────────────────────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let curr = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) curr = s.id;
    });
    links.forEach(l => {
      l.style.color = l.getAttribute('href') === '#' + curr ? 'var(--cyan)' : '';
    });
  }, { passive: true });
})();

/* ──────────────────────────────────────────────────
   13. VIDEO section — lazy load
────────────────────────────────────────────────── */
(function initVideo() {
  const video = document.getElementById('introVideo');
  if (!video) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { video.load(); io.disconnect(); }
    });
  }, { threshold: 0.1 });
  io.observe(video);
})();

/* ──────────────────────────────────────────────────
   14. Page-load screen shimmer (fade in)
────────────────────────────────────────────────── */
(function initPageLoad() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.7s ease';
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });
  // Fallback
  setTimeout(() => { document.body.style.opacity = '1'; }, 800);
})();
