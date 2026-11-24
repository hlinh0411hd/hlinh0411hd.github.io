const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Mobile navigation toggle
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Dynamic copyright year
const yearEl = document.querySelector('#year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Top scroll progress bar & sticky header state
const header = document.querySelector('.site-header');
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.prepend(progressBar);

const updateScrollUI = () => {
  const scrollY = window.scrollY;
  if (header) {
    header.classList.toggle('scrolled', scrollY > 12);
  }
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0;
  progressBar.style.transform = `scaleX(${progress})`;
};

updateScrollUI();
window.addEventListener('scroll', updateScrollUI, { passive: true });
window.addEventListener('resize', updateScrollUI, { passive: true });

// Remotion-style kinetic word reveal for headings (h1, h2)
const prepareKineticHeading = (heading) => {
  if (heading.dataset.kineticReady) return;
  heading.dataset.kineticReady = 'true';

  const walk = (node, wordIndexRef) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const parts = node.textContent.split(/(\s+)/);
      const frag = document.createDocumentFragment();
      parts.forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
        } else {
          const wrap = document.createElement('span');
          wrap.className = 'kinetic-word-wrap';
          const inner = document.createElement('span');
          inner.className = 'kinetic-word';
          inner.textContent = part;
          inner.style.setProperty('--word-delay', `${wordIndexRef.count * 0.055}s`);
          wordIndexRef.count += 1;
          wrap.appendChild(inner);
          frag.appendChild(wrap);
        }
      });
      node.parentNode.replaceChild(frag, node);
    } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'BR') {
      Array.from(node.childNodes).forEach((child) => walk(child, wordIndexRef));
    }
  };

  walk(heading, { count: 0 });
};

const kineticHeadings = document.querySelectorAll('main h1, main h2');
kineticHeadings.forEach((h) => prepareKineticHeading(h));

// Scroll-triggered reveal for [data-reveal] and kinetic headings
const revealTargets = document.querySelectorAll('[data-reveal], main h1, main h2');
if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target.hasAttribute('data-reveal')) {
            entry.target.classList.add('is-visible');
          }
          if (entry.target.matches('h1, h2')) {
            entry.target.classList.add('is-kinetic-in');
          }
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -24px 0px' }
  );

  revealTargets.forEach((el) => observer.observe(el));

  // Immediately trigger above-the-fold hero heading
  requestAnimationFrame(() => {
    document.querySelectorAll('.hero h1, .page-heading h1, .detail-hero h1').forEach((h) => {
      h.classList.add('is-kinetic-in');
    });
  });
} else {
  revealTargets.forEach((el) => {
    el.classList.add('is-visible', 'is-kinetic-in');
  });
}

// 3D perspective tilt + cursor glow on game cards
if (!prefersReducedMotion) {
  document.querySelectorAll('.game-card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);

      const rotateY = ((x / rect.width) - 0.5) * 6;
      const rotateX = ((y / rect.height) - 0.5) * -5;
      card.style.transform = `translateY(-6px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
    });

    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}

// Subtle hero image parallax + ambient floating particles (Remotion motion-graphics vibe)
const hero = document.querySelector('.hero');
const heroImg = document.querySelector('.hero-media img');

if (hero && !prefersReducedMotion) {
  if (heroImg) {
    let ticking = false;
    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const y = Math.min(window.scrollY, 650);
            heroImg.style.transform = `scale(1.05) translateY(${y * 0.08}px)`;
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  const canvas = document.createElement('canvas');
  canvas.className = 'hero-particles';
  canvas.setAttribute('aria-hidden', 'true');
  hero.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (ctx) {
    let width = 0;
    let height = 0;
    const particles = Array.from({ length: 24 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      r: 1.2 + Math.random() * 2.2,
      vx: (Math.random() - 0.5) * 0.00025,
      vy: -0.00015 - Math.random() * 0.0003,
      phase: i * 0.7,
      isSquare: i % 5 === 0,
    }));

    const resize = () => {
      width = canvas.width = hero.clientWidth;
      height = canvas.height = hero.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    let t = 0;
    const draw = () => {
      t += 0.018;
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -0.05) p.y = 1.05;
        if (p.x < -0.05) p.x = 1.05;
        if (p.x > 1.05) p.x = -0.05;

        const alpha = 0.16 + 0.22 * (0.5 + 0.5 * Math.sin(t + p.phase));
        const px = p.x * width;
        const py = p.y * height;

        ctx.fillStyle = `rgba(112, 185, 240, ${alpha.toFixed(3)})`;
        if (p.isSquare) {
          ctx.fillRect(px, py, p.r * 2.1, p.r * 2.1);
        } else {
          ctx.beginPath();
          ctx.arc(px, py, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  }
}

// Lazy YouTube embed player
document.querySelectorAll('[data-video]').forEach((frame) => {
  const btn = frame.querySelector('button');
  btn?.addEventListener('click', () => {
    const id = frame.dataset.video;
    if (!/^[\w-]{11}$/.test(id)) return;
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    iframe.title = 'YouTube video player';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    frame.replaceChildren(iframe);
  });
});
