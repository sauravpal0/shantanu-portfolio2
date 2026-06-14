/*
  SHANTANU PAL - Clinical Research Coordinator
  Portfolio Script - All code runs after window load
  so Three.js and GSAP (defer-loaded) are ready.
*/
 
'use strict';
 
window.addEventListener('load', function () {
 
  /* ==================================================
     1. CUSTOM CURSOR
  ================================================== */
  (function initCursor() {
    var dot  = document.getElementById('cursorDot');
    var ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;
 
    document.addEventListener('mousemove', function(e) {
      dot.style.left = e.clientX + 'px';
      dot.style.top  = e.clientY + 'px';
      ring.style.left = e.clientX + 'px';
      ring.style.top  = e.clientY + 'px';
    });
 
    document.querySelectorAll('a, button, .glass-card').forEach(function(el) {
      el.addEventListener('mouseenter', function() {
        ring.style.width  = '58px';
        ring.style.height = '58px';
        ring.style.borderColor = 'rgba(0,245,212,0.9)';
      });
      el.addEventListener('mouseleave', function() {
        ring.style.width  = '34px';
        ring.style.height = '34px';
        ring.style.borderColor = 'rgba(0,245,212,0.55)';
      });
    });
  })();
 
 
  /* ==================================================
     2. NAVBAR SCROLL + MOBILE MENU
  ================================================== */
  (function initNavbar() {
    var nav = document.getElementById('navbar');
    if (!nav) return;
 
    window.addEventListener('scroll', function() {
      if (window.scrollY > 60) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, { passive: true });
 
    var hamburger   = document.getElementById('hamburger');
    var mobileMenu  = document.getElementById('mobileMenu');
    var mobileClose = document.getElementById('mobileClose');
 
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', function() {
        mobileMenu.classList.add('open');
      });
    }
    if (mobileClose && mobileMenu) {
      mobileClose.addEventListener('click', function() {
        mobileMenu.classList.remove('open');
      });
    }
    document.querySelectorAll('.mob-link').forEach(function(l) {
      l.addEventListener('click', function() {
        if (mobileMenu) mobileMenu.classList.remove('open');
      });
    });
  })();
 
 
  /* ==================================================
     3. THREE.JS - DNA HELIX (violet/purple, not cyan)
  ================================================== */
  (function initThreeJS() {
    var canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    if (typeof THREE === 'undefined') return;
 
    // Hide canvas on phones (<=600px) - CSS also does this but double-safe
    if (window.innerWidth <= 600) {
      canvas.style.display = 'none';
      return;
    }
 
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.parentElement.offsetWidth, canvas.parentElement.offsetHeight);
 
    var scene  = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 0.1, 1000);
    camera.position.set(0, 0, 18);
 
    var group = new THREE.Group();
    scene.add(group);
 
    var totalPoints = 120;
    var helixRadius = 3.5;
    var helixHeight = 22;
    var helixTurns  = 5;
 
    // Violet/purple colors - clearly different from cyan text
    var mat1 = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6, emissive: 0x8b5cf6, emissiveIntensity: 0.7, roughness: 0.2
    });
    var mat2 = new THREE.MeshStandardMaterial({
      color: 0xc084fc, emissive: 0xc084fc, emissiveIntensity: 0.5, roughness: 0.3
    });
    var matBridge = new THREE.MeshStandardMaterial({
      color: 0x6366f1, emissive: 0x6366f1, emissiveIntensity: 0.3, roughness: 0.5
    });
 
    var sphereGeo = new THREE.SphereGeometry(0.18, 10, 10);
    var cylGeo    = new THREE.CylinderGeometry(0.06, 0.06, 1, 8);
 
    for (var i = 0; i < totalPoints; i++) {
      var t     = i / totalPoints;
      var angle = t * Math.PI * 2 * helixTurns;
      var y     = t * helixHeight - helixHeight / 2;
 
      var x1 = Math.cos(angle) * helixRadius;
      var z1 = Math.sin(angle) * helixRadius;
      var s1 = new THREE.Mesh(sphereGeo, mat1);
      s1.position.set(x1, y, z1);
      group.add(s1);
 
      var x2 = Math.cos(angle + Math.PI) * helixRadius;
      var z2 = Math.sin(angle + Math.PI) * helixRadius;
      var s2 = new THREE.Mesh(sphereGeo, mat2);
      s2.position.set(x2, y, z2);
      group.add(s2);
 
      if (i % 4 === 0) {
        var bridge = new THREE.Mesh(cylGeo, matBridge);
        var dx = x2 - x1, dz = z2 - z1;
        bridge.scale.y = Math.sqrt(dx * dx + dz * dz + 0.01);
        bridge.position.set((x1 + x2) / 2, y, (z1 + z2) / 2);
        bridge.lookAt(new THREE.Vector3(x2, y, z2));
        bridge.rotateX(Math.PI / 2);
        group.add(bridge);
      }
    }
 
    // Lights
    var ambLight = new THREE.AmbientLight(0x1a0033, 2.5);
    scene.add(ambLight);
    var ptLight1 = new THREE.PointLight(0x8b5cf6, 4, 40);
    ptLight1.position.set(8, 5, 8);
    scene.add(ptLight1);
    var ptLight2 = new THREE.PointLight(0xc084fc, 2.5, 30);
    ptLight2.position.set(-8, -5, 6);
    scene.add(ptLight2);
 
    // Floating molecules
    var molGeo = new THREE.SphereGeometry(0.35, 12, 12);
    var molMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6, emissive: 0x8b5cf6,
      emissiveIntensity: 0.4, transparent: true, opacity: 0.45
    });
    var molecules = [];
    for (var j = 0; j < 20; j++) {
      var m = new THREE.Mesh(molGeo, molMat.clone());
      m.position.set(
        (Math.random() - 0.5) * 28,
        (Math.random() - 0.5) * 22,
        (Math.random() - 0.5) * 14 - 4
      );
      m.userData.speed  = 0.002 + Math.random() * 0.004;
      m.userData.offset = Math.random() * Math.PI * 2;
      scene.add(m);
      molecules.push(m);
    }
 
    var mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', function(e) {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });
 
    window.addEventListener('resize', function() {
      if (window.innerWidth <= 600) {
        canvas.style.display = 'none';
        return;
      }
      canvas.style.display = 'block';
      var w = canvas.parentElement.offsetWidth;
      var h = canvas.parentElement.offsetHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
 
    var clock = 0;
    function animate() {
      requestAnimationFrame(animate);
      clock += 0.006;
      group.rotation.y = clock * 0.35 + mouseX * 0.12;
      group.rotation.x = mouseY * 0.06;
      molecules.forEach(function(mol) {
        mol.position.y += Math.sin(clock + mol.userData.offset) * mol.userData.speed;
        mol.position.x += Math.cos(clock * 0.7 + mol.userData.offset) * mol.userData.speed * 0.6;
        mol.rotation.x += 0.01;
        mol.rotation.z += 0.008;
        if (mol.position.y >  12) mol.position.y = -12;
        if (mol.position.y < -12) mol.position.y =  12;
      });
      renderer.render(scene, camera);
    }
    animate();
  })();
 
 
  /* ==================================================
     4. FLOATING PARTICLES
  ================================================== */
  (function initParticles() {
    var container = document.getElementById('particles');
    if (!container) return;
    var colors = ['#00f5d4', '#00b4d8', '#0077b6', '#8b5cf6'];
 
    for (var i = 0; i < 40; i++) {
      var p    = document.createElement('div');
      var size = 2 + Math.random() * 5;
      p.className = 'particle';
      p.style.width    = size + 'px';
      p.style.height   = size + 'px';
      p.style.left     = (Math.random() * 100) + '%';
      p.style.background       = colors[Math.floor(Math.random() * colors.length)];
      p.style.opacity          = (0.2 + Math.random() * 0.5).toString();
      p.style.animationDuration = (8 + Math.random() * 18) + 's';
      p.style.animationDelay   = (-Math.random() * 18) + 's';
      container.appendChild(p);
    }
  })();
 
 
  /* ==================================================
     5. TYPING EFFECT
  ================================================== */
  (function initTyping() {
    var el = document.getElementById('typedTitle');
    if (!el) return;
 
    var lines = [
      'Clinical Research Coordinator',
      'Oncology & Rheumatology',
      'Real World Studies',
      'PharmD | Hyderabad, India'
    ];
    var li = 0, ci = 0, deleting = false;
 
    function type() {
      var full = lines[li];
      if (!deleting) {
        el.textContent = full.slice(0, ci + 1);
        ci++;
        if (ci === full.length) {
          deleting = true;
          setTimeout(type, 1800);
          return;
        }
      } else {
        el.textContent = full.slice(0, ci - 1);
        ci--;
        if (ci === 0) {
          deleting = false;
          li = (li + 1) % lines.length;
        }
      }
      setTimeout(type, deleting ? 45 : 75);
    }
    type();
  })();
 
 
  /* ==================================================
     6. SCROLL REVEAL
  ================================================== */
  (function initReveal() {
    var items = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry, i) {
        if (entry.isIntersecting) {
          setTimeout(function() {
            entry.target.classList.add('revealed');
          }, i * 80);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function(item) { io.observe(item); });
 
    // Therapeutic area fill bars
    var thCards = document.querySelectorAll('.th-card');
    var thIo = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          thIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    thCards.forEach(function(c) { thIo.observe(c); });
 
    // Skill bars
    var skillCards = document.querySelectorAll('.skill-card');
    var skIo = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var fill = entry.target.querySelector('.sk-fill');
          if (fill) {
            var w = fill.getAttribute('data-w');
            fill.style.width = w + '%';
          }
          entry.target.classList.add('revealed');
          skIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    skillCards.forEach(function(c) { skIo.observe(c); });
  })();
 
 
  /* ==================================================
     7. STAT COUNTER ANIMATION
  ================================================== */
  (function initCounters() {
    var nums = document.querySelectorAll('.stat-num[data-target]');
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var target   = parseInt(entry.target.getAttribute('data-target'), 10);
          var count    = 0;
          var step     = Math.max(1, Math.ceil(target / 40));
          var el       = entry.target;
          var interval = setInterval(function() {
            count = Math.min(count + step, target);
            el.textContent = count;
            if (count >= target) clearInterval(interval);
          }, 40);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    nums.forEach(function(n) { io.observe(n); });
  })();
 
 
  /* ==================================================
     8. RESEARCH DONUT CHARTS
  ================================================== */
  (function initCharts() {
    function drawDonut(id, percent, color) {
      var canvas = document.getElementById(id);
      if (!canvas) return;
      var ctx   = canvas.getContext('2d');
      var cx    = 60, cy = 60, r = 46, lineW = 8;
      var start = -Math.PI / 2;
      var end   = start + (2 * Math.PI * percent / 100);
 
      ctx.clearRect(0, 0, 120, 120);
 
      // Background ring
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0,180,216,0.1)';
      ctx.lineWidth   = lineW;
      ctx.stroke();
 
      // Progress arc
      ctx.beginPath();
      ctx.arc(cx, cy, r, start, end);
      ctx.strokeStyle = color;
      ctx.lineWidth   = lineW;
      ctx.lineCap     = 'round';
      ctx.shadowColor = color;
      ctx.shadowBlur  = 14;
      ctx.stroke();
    }
 
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var v1 = 0, v2 = 0;
          var t1 = setInterval(function() {
            v1 = Math.min(v1 + 2, 72);
            drawDonut('esrChart', v1, '#00f5d4');
            if (v1 >= 72) clearInterval(t1);
          }, 20);
          var t2 = setInterval(function() {
            v2 = Math.min(v2 + 2, 85);
            drawDonut('das28Chart', v2, '#00b4d8');
            if (v2 >= 85) clearInterval(t2);
          }, 20);
          io.disconnect();
        }
      });
    }, { threshold: 0.3 });
 
    var rc = document.querySelector('.research-card');
    if (rc) io.observe(rc);
  })();
 
 
  /* ==================================================
     9. CERTIFICATIONS CAROUSEL
  ================================================== */
  (function initCarousel() {
    var carousel = document.getElementById('certCarousel');
    var prevBtn  = document.getElementById('certPrev');
    var nextBtn  = document.getElementById('certNext');
    var dotsWrap = document.getElementById('certDots');
    if (!carousel || !prevBtn || !nextBtn || !dotsWrap) return;
 
    var cards = carousel.querySelectorAll('.cert-card');
    var total = cards.length;
    var index = 0;
 
    function visibleCount() {
      if (window.innerWidth < 600)  return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    }
 
    function maxIndex() {
      return Math.max(0, Math.ceil(total / visibleCount()) - 1);
    }
 
    function getCardWidth() {
      if (!cards[0]) return 260;
      return cards[0].offsetWidth + 24;
    }
 
    function buildDots() {
      dotsWrap.innerHTML = '';
      var pages = maxIndex() + 1;
      for (var i = 0; i < pages; i++) {
        var d = document.createElement('button');
        d.className = 'cert-dot' + (i === index ? ' active' : '');
        d.setAttribute('aria-label', 'Page ' + (i + 1));
        (function(idx) {
          d.addEventListener('click', function() { index = idx; update(); });
        })(i);
        dotsWrap.appendChild(d);
      }
    }
 
    function update() {
      index = Math.min(index, maxIndex());
      var offset = index * getCardWidth() * visibleCount();
      carousel.style.transform = 'translateX(-' + offset + 'px)';
      var dots = dotsWrap.querySelectorAll('.cert-dot');
      dots.forEach(function(d, i) {
        d.classList.toggle('active', i === index);
      });
    }
 
    prevBtn.addEventListener('click', function() {
      index = (index <= 0) ? maxIndex() : index - 1;
      update();
    });
    nextBtn.addEventListener('click', function() {
      index = (index >= maxIndex()) ? 0 : index + 1;
      update();
    });
 
    buildDots();
 
    window.addEventListener('resize', function() {
      index = 0;
      buildDots();
      update();
    });
 
    setInterval(function() {
      index = (index >= maxIndex()) ? 0 : index + 1;
      update();
    }, 4500);
  })();
 
 
  /* ==================================================
     10. GSAP ANIMATIONS (only if GSAP loaded)
  ================================================== */
  (function initGSAP() {
    if (typeof gsap === 'undefined') return;
    if (typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);
 
    gsap.from('.hero-left > *', {
      y: 50, opacity: 0, stagger: 0.12, duration: 1,
      ease: 'power3.out', delay: 0.3
    });
    gsap.from('.hero-right', {
      x: 60, opacity: 0, duration: 1.2,
      ease: 'power3.out', delay: 0.5
    });
 
    gsap.utils.toArray('.section-title').forEach(function(title) {
      gsap.from(title, {
        scrollTrigger: { trigger: title, start: 'top 85%' },
        y: 30, opacity: 0, duration: 0.9, ease: 'power2.out'
      });
    });
 
    gsap.utils.toArray('.metric-card').forEach(function(card, i) {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 88%' },
        y: 40, opacity: 0, scale: 0.95,
        duration: 0.7, delay: i * 0.1, ease: 'back.out(1.5)'
      });
    });
  })();
 
 
  /* ==================================================
     11. 3D CARD TILT (desktop only)
  ================================================== */
  (function initTilt() {
    if (window.innerWidth <= 1024) return; // skip on mobile/tablet
    document.querySelectorAll('.glass-card').forEach(function(card) {
      card.addEventListener('mousemove', function(e) {
        var rect = card.getBoundingClientRect();
        var dx   = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
        var dy   = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
        card.style.transform = 'perspective(800px) rotateY(' + (dx * 5) + 'deg) rotateX(' + (-dy * 4) + 'deg) translateZ(6px)';
      });
      card.addEventListener('mouseleave', function() {
        card.style.transform = '';
      });
    });
  })();
 
 
  /* ==================================================
     12. ACTIVE NAV HIGHLIGHT ON SCROLL
  ================================================== */
  (function initActiveNav() {
    var sections = document.querySelectorAll('section[id]');
    var links    = document.querySelectorAll('.nav-links a');
 
    window.addEventListener('scroll', function() {
      var curr = '';
      sections.forEach(function(s) {
        if (window.scrollY >= s.offsetTop - 120) curr = s.id;
      });
      links.forEach(function(l) {
        l.style.color = (l.getAttribute('href') === '#' + curr) ? 'var(--cyan)' : '';
      });
    }, { passive: true });
  })();
 
 
  /* ==================================================
     13. VIDEO LAZY LOAD
  ================================================== */
  (function initVideo() {
    var video = document.getElementById('introVideo');
    if (!video) return;
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          video.load();
          io.disconnect();
        }
      });
    }, { threshold: 0.1 });
    io.observe(video);
  })();
 
}); // end window load
 
