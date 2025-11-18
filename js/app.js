// ---------- helpers ----------
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// ---------- splash ----------
(() => {
    const splash = $('#splash');
    const firstVisit = !localStorage.getItem('gagaVisited');
    if (!splash) return;

    if (firstVisit) {
        setTimeout(() => splash.classList.add('hide'), 5000);
        setTimeout(() => localStorage.setItem('gagaVisited', '1'), 5200);
    } else {
        splash.classList.add('hide');
    }
})();

// ---------- mobile nav ----------
(() => {
    const btn = $('.nav-toggle');
    const nav = $('#global-nav');
    if (!btn || !nav) return;
    btn.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(open));
    });
})();

// ---------- reveal on scroll ----------
(() => {
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('show');
                io.unobserve(e.target);
            }
        });
    }, { threshold: .18 });
    $$('.reveal').forEach(el => io.observe(el));
})();

// ---------- back-to-top ----------
(() => {
    const btn = $('#back-to-top');
    if (!btn) return;
    const onScroll = () => {
        if (window.scrollY > 600) btn.classList.add('show');
        else btn.classList.remove('show');
    };
    window.addEventListener('scroll', onScroll);
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// ---------- header progress bar ----------
(() => {
    const bar = $('#scrollbar');
    if (!bar) return;
    const update = () => {
        const h = document.documentElement;
        const scrolled = h.scrollTop || document.body.scrollTop;
        const height = h.scrollHeight - h.clientHeight;
        const p = Math.max(0, Math.min(1, scrolled / height));
        bar.style.width = (p * 100) + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
})();

// ---------- parallax hero ----------
(() => {
    const hero = $('.hero--parallax img');
    if (!hero) return;
    window.addEventListener('scroll', () => {
        const y = window.scrollY * 0.25;
        hero.style.setProperty('--p', y + 'px');
    }, { passive: true });
})();

// ---------- smooth in-page anchor ----------
(() => {
    $$('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const id = a.getAttribute('href');
            if (id.length > 1) {
                const target = $(id);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    history.replaceState(null, '', id);
                }
            }
        });
    });
})();

// ---------- active nav highlight ----------
(() => {
    const navLinks = $$('#global-nav a[href^="#"], .footer-links a[href^="#"]');
    if (!navLinks.length) return;
    const map = navLinks.map(a => {
        const id = a.getAttribute('href');
        const sec = $(id);
        return sec ? { a, sec } : null;
    }).filter(Boolean);
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                map.forEach(m => m.a.classList.toggle('is-active', m.sec === e.target));
            }
        });
    }, { threshold: .5 });
    map.forEach(m => io.observe(m.sec));
})();

// ---------- MV Lightbox ----------
(() => {
    // create lightbox container
    const lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.innerHTML = `
    <div class="lightbox-inner">
      <button class="lightbox-close" aria-label="Close video">Close</button>
      <iframe title="MV player" width="100%" height="100%" src="" frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    </div>`;
    document.body.appendChild(lb);
    const iframe = $('iframe', lb);
    const close = $('.lightbox-close', lb);

    const open = (id) => {
        iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1`;
        lb.classList.add('open');
    };
    const shutdown = () => {
        lb.classList.remove('open');
        iframe.src = '';
    };
    close.addEventListener('click', shutdown);
    lb.addEventListener('click', e => { if (e.target === lb) shutdown(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') shutdown(); });

    // bind thumbs
    $$('.thumb-play').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-yt');
            if (id) open(id);
        });
    });
})();
