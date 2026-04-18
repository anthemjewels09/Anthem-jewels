/* ============================================================
   ANTHEM JEWELS — ENHANCED SCRIPT
   New: ambient light, magnetic cursor, constellation particles,
   split-text reveal, smooth page transitions, parallax layers
   ============================================================ */

// ===== MOBILE NAV =====
function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('open');
    document.getElementById('navHamburger').classList.toggle('open');
}
function closeMenu() {
    document.getElementById('navLinks').classList.remove('open');
    document.getElementById('navHamburger').classList.remove('open');
}

// ===== AMBIENT MOUSE LIGHT =====
(function() {
    const light = document.createElement('div');
    light.id = 'ambient-light';
    document.body.appendChild(light);

    let tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    let cx = tx, cy = ty;

    document.addEventListener('mousemove', e => {
        tx = e.clientX; ty = e.clientY;
    });

    function animateLight() {
        cx += (tx - cx) * 0.06;
        cy += (ty - cy) * 0.06;
        light.style.left = cx + 'px';
        light.style.top  = cy + 'px';
        requestAnimationFrame(animateLight);
    }
    animateLight();
})();

// ===== ENHANCED CURSOR (magnetic) =====
(function() {
    const cursor = document.getElementById('cursor');
    const ring   = document.getElementById('cursorRing');
    if (!cursor || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0;
    let isHover = false;

    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        cursor.style.left = mx + 'px';
        cursor.style.top  = my + 'px';
    });

    function animateRing() {
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        ring.style.left = rx + 'px';
        ring.style.top  = ry + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(0.7)';
        ring.style.transform   = 'translate(-50%,-50%) scale(0.85)';
    });
    document.addEventListener('mouseup', () => {
        cursor.style.transform = '';
        ring.style.transform   = '';
    });

    function attachCursorHover() {
        document.querySelectorAll('button, a, .gallery-item, .blog-card, .filter-btn, .team-card-new, .value-item').forEach(el => {
            if (el.dataset.cursorBound) return;
            el.dataset.cursorBound = '1';
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-hover');
                ring.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
                ring.classList.remove('cursor-hover');
            });
        });
    }
    attachCursorHover();
    setInterval(attachCursorHover, 1200);
})();

// ===== HERO PARTICLE CANVAS — enhanced with constellation lines =====
(function() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];
    let mouseX = -9999, mouseY = -9999;

    function resize() {
        W = canvas.width  = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    document.addEventListener('mousemove', e => {
        const r = canvas.getBoundingClientRect();
        mouseX = e.clientX - r.left;
        mouseY = e.clientY - r.top;
    });

    const TYPES = ['dot', 'cross', 'diamond'];
    function rand(a, b) { return Math.random() * (b - a) + a; }

    function createParticle() {
        const type = TYPES[Math.floor(Math.random() * TYPES.length)];
        return {
            x: rand(0, W), y: rand(0, H),
            ox: 0, oy: 0,
            size: rand(1, type === 'dot' ? 2.5 : 6),
            speedX: rand(-0.12, 0.12),
            speedY: rand(-0.35, -0.08),
            opacity: rand(0.1, 0.65),
            fadeSpeed: rand(0.002, 0.005),
            growing: true,
            maxOpacity: rand(0.3, 0.75),
            type,
            twinkle: Math.random() > 0.45,
            twinkleSpeed: rand(0.008, 0.025),
            twinklePhase: rand(0, Math.PI * 2),
        };
    }

    for (let i = 0; i < 130; i++) particles.push(createParticle());

    function drawDiamond(ctx, x, y, s) {
        ctx.beginPath();
        ctx.moveTo(x, y - s); ctx.lineTo(x + s * 0.6, y);
        ctx.lineTo(x, y + s); ctx.lineTo(x - s * 0.6, y);
        ctx.closePath(); ctx.fill();
    }

    function drawCross(ctx, x, y, s) {
        const h = s * 0.5;
        ctx.beginPath();
        ctx.moveTo(x, y - s); ctx.lineTo(x, y + s);
        ctx.moveTo(x - s, y); ctx.lineTo(x + s, y);
        ctx.moveTo(x - h, y - h); ctx.lineTo(x + h, y + h);
        ctx.moveTo(x + h, y - h); ctx.lineTo(x - h, y + h);
        ctx.stroke();
    }

    function animate() {
        ctx.clearRect(0, 0, W, H);

        // Draw constellation lines between nearby particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const p = particles[i], q = particles[j];
                const dx = p.x - q.x, dy = p.y - q.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 110) {
                    const alpha = (1 - dist / 110) * 0.08;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(201,168,76,${alpha})`;
                    ctx.lineWidth = 0.4;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.stroke();
                }
            }
        }

        particles.forEach((p, i) => {
            // Twinkle / fade
            if (p.twinkle) {
                p.twinklePhase += p.twinkleSpeed;
                p.opacity = p.maxOpacity * (0.35 + 0.65 * Math.abs(Math.sin(p.twinklePhase)));
            } else {
                if (p.growing) {
                    p.opacity += p.fadeSpeed;
                    if (p.opacity >= p.maxOpacity) p.growing = false;
                } else {
                    p.opacity -= p.fadeSpeed;
                    if (p.opacity <= 0) {
                        particles[i] = createParticle();
                        particles[i].y = H + 10;
                        return;
                    }
                }
            }

            // Subtle mouse repulsion
            const dx = p.x - mouseX, dy = p.y - mouseY;
            const d = Math.sqrt(dx*dx + dy*dy);
            if (d < 120) {
                const force = (120 - d) / 120;
                p.x += dx / d * force * 1.2;
                p.y += dy / d * force * 1.2;
            }

            p.x += p.speedX;
            p.y += p.speedY;
            if (p.y < -20) { particles[i] = createParticle(); return; }
            if (p.x < -10)  p.x = W + 10;
            if (p.x > W+10) p.x = -10;

            const useWhite = Math.random() > 0.88;
            const gold  = `rgba(201,168,76,${p.opacity})`;
            const white = `rgba(255,255,255,${p.opacity * 0.5})`;
            const color = useWhite ? white : gold;

            ctx.fillStyle = color;
            ctx.strokeStyle = color;
            ctx.lineWidth = 0.7;

            if (p.type === 'dot') {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                if (p.size > 1.5) {
                    const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4.5);
                    grd.addColorStop(0, `rgba(201,168,76,${p.opacity * 0.28})`);
                    grd.addColorStop(1, 'transparent');
                    ctx.beginPath();
                    ctx.fillStyle = grd;
                    ctx.arc(p.x, p.y, p.size * 4.5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = color;
                }
            } else if (p.type === 'cross') {
                drawCross(ctx, p.x, p.y, p.size);
            } else {
                drawDiamond(ctx, p.x, p.y, p.size);
            }
        });

        requestAnimationFrame(animate);
    }
    animate();
})();

// ===== PAGE NAVIGATION — with cinematic transition =====
function showPage(name) {
    const outgoing = document.querySelector('.page.active');

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active', 'page-enter'));

    const page = document.getElementById(name);
    page.classList.add('active', 'page-enter');
    setTimeout(() => page.classList.remove('page-enter'), 750);

    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active-link'));
    const navEl = document.getElementById('nav-' + name);
    if (navEl) navEl.classList.add('active-link');

    if (name === 'gallery') {
        renderGallery('all');
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        const allBtn = document.querySelector('.filter-btn');
        if (allBtn) allBtn.classList.add('active');
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
    setTimeout(attachReveal, 300);
    return false;
}

// ===== FORM SUBMIT =====
async function submitForm() {
    const fname   = document.getElementById('fname').value.trim();
    const lname   = document.getElementById('lname').value.trim();
    const email   = document.getElementById('email').value.trim();
    const inquiry = document.getElementById('inquiry-type').value;
    const budget  = document.getElementById('budget').value;
    const message = document.getElementById('message').value.trim();

    if (!fname || !email) {
        alert('Please fill in your name and email.');
        return;
    }

    const btn = document.querySelector('.submit-btn');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    try {
        const res = await fetch('https://formspree.io/f/myklgqnw', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ name: fname + ' ' + lname, email, inquiry_type: inquiry, budget, message })
        });

        if (res.ok) {
            const suc = document.getElementById('form-success');
            suc.style.display = 'block';
            suc.style.animation = 'fadeInUp 0.5s ease forwards';
            ['fname','lname','email','inquiry-type','budget','message'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = '';
            });
            setTimeout(() => { suc.style.display = 'none'; }, 5500);
        } else {
            alert('Something went wrong. Please try again.');
        }
    } catch(err) {
        alert('Network error. Please check your connection.');
    } finally {
        btn.textContent = 'Send Inquiry ◆';
        btn.disabled = false;
    }
}

// ===== SCROLL TO TOP =====
const scrollTopBtn = document.getElementById('scrollTop');
if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
}

// ===== GALLERY DATA — 50 UNIQUE DIAMONDS =====
const diamonds = [
    { id: 1,  name: 'Celestial Round',       cat: 'round',   sub: 'Round Brilliant · 2.10 ct · D/IF',       img: '' },
    { id: 2,  name: 'Classic Solitaire',      cat: 'round',   sub: 'Round Brilliant · 1.50 ct · E/VS2',      img: '' },
    { id: 3,  name: 'Arctic Light',           cat: 'round',   sub: 'Round Brilliant · 3.00 ct · D/VVS1',     img: '' },
    { id: 4,  name: 'Solar Blaze',            cat: 'round',   sub: 'Round Brilliant · 1.75 ct · F/VS1',      img: '' },
    { id: 5,  name: 'Polar Star',             cat: 'round',   sub: 'Round Brilliant · 2.40 ct · E/VVS2',     img: '' },
    { id: 6,  name: 'Ivory Halo',             cat: 'round',   sub: 'Round Brilliant · 1.20 ct · G/VS1',      img: '' },
    { id: 7,  name: 'Zenith Round',           cat: 'round',   sub: 'Round Brilliant · 4.10 ct · D/FL',       img: '' },
    { id: 8,  name: 'Silver Moon',            cat: 'round',   sub: 'Round Brilliant · 0.90 ct · E/VS2',      img: '' },
    { id: 9,  name: 'Nova Spark',             cat: 'round',   sub: 'Round Brilliant · 2.80 ct · F/VVS1',     img: '' },
    { id: 10, name: 'Eternal White',          cat: 'round',   sub: 'Round Brilliant · 1.60 ct · D/IF',       img: '' },
    { id: 11, name: 'Empress Cut',            cat: 'fancy',   sub: 'Princess Cut · 1.80 ct · E/VVS1',        img: '' },
    { id: 12, name: 'Ocean Oval',             cat: 'fancy',   sub: 'Oval Shape · 2.50 ct · G/VS1',           img: '' },
    { id: 13, name: 'Pear Blossom',           cat: 'fancy',   sub: 'Pear Shape · 1.70 ct · F/VS1',           img: '' },
    { id: 14, name: 'Emerald Isle',           cat: 'fancy',   sub: 'Emerald Cut · 3.00 ct · G/VVS1',         img: '' },
    { id: 15, name: 'Marquise Mirage',        cat: 'fancy',   sub: 'Marquise Cut · 2.20 ct · E/VS2',         img: '' },
    { id: 16, name: 'Radiant Dawn',           cat: 'fancy',   sub: 'Radiant Cut · 2.70 ct · D/VVS2',         img: '' },
    { id: 17, name: 'Cushion Cloud',          cat: 'fancy',   sub: 'Cushion Cut · 3.10 ct · F/VS1',          img: '' },
    { id: 18, name: 'Asscher Royale',         cat: 'fancy',   sub: 'Asscher Cut · 1.90 ct · E/VVS1',         img: '' },
    { id: 19, name: 'Trillion Dream',         cat: 'fancy',   sub: 'Trillion Cut · 1.40 ct · G/VS2',         img: '' },
    { id: 20, name: 'Baguette Grace',         cat: 'fancy',   sub: 'Baguette Cut · 0.80 ct · F/VS1',         img: '' },
    { id: 21, name: 'Teardrop Serenity',      cat: 'fancy',   sub: 'Pear Shape · 2.10 ct · D/IF',            img: '' },
    { id: 22, name: 'Princess Aurora',        cat: 'fancy',   sub: 'Princess Cut · 2.60 ct · E/VVS2',        img: '' },
    { id: 23, name: 'Sahara Rose',            cat: 'colored', sub: 'Fancy Pink · 1.20 ct · Intense',          img: '' },
    { id: 24, name: 'Midnight Blue',          cat: 'colored', sub: 'Fancy Blue · 0.90 ct · Vivid',            img: '' },
    { id: 25, name: 'Canary Dream',           cat: 'colored', sub: 'Fancy Yellow · 2.20 ct · VVS1',           img: '' },
    { id: 26, name: 'Forest Green',           cat: 'colored', sub: 'Fancy Green · 1.10 ct · Intense',         img: '' },
    { id: 27, name: 'Blush Eternal',          cat: 'colored', sub: 'Fancy Pink · 0.75 ct · Deep',             img: '' },
    { id: 28, name: 'Cobalt Prince',          cat: 'colored', sub: 'Fancy Blue · 1.50 ct · Deep',             img: '' },
    { id: 29, name: 'Sunset Orange',          cat: 'colored', sub: 'Fancy Orange · 0.65 ct · Vivid',          img: '' },
    { id: 30, name: 'Champagne Glow',         cat: 'colored', sub: 'Fancy Brown · 2.30 ct · Light',           img: '' },
    { id: 31, name: 'Lavender Mist',          cat: 'colored', sub: 'Fancy Purple · 0.55 ct · Intense',        img: '' },
    { id: 32, name: 'Cognac Reserve',         cat: 'colored', sub: 'Fancy Brown · 3.10 ct · Deep',            img: '' },
    { id: 33, name: 'Goldenrod',              cat: 'colored', sub: 'Fancy Yellow · 1.80 ct · Vivid',          img: '' },
    { id: 34, name: 'Rose Lumiere',           cat: 'colored', sub: 'Fancy Pink · 1.40 ct · Vivid',            img: '' },
    { id: 35, name: 'The Koh-i-Noor Reserve', cat: 'rare',    sub: 'Cushion · 5.20 ct · D/Flawless',          img: '' },
    { id: 36, name: 'Eternal Marquise',        cat: 'rare',    sub: 'Marquise Cut · 3.10 ct · F/VVS2',         img: '' },
    { id: 37, name: 'Heart of Eternity',       cat: 'rare',    sub: 'Heart Shape · 1.00 ct · E/VS2',           img: '' },
    { id: 38, name: 'The Regent',              cat: 'rare',    sub: 'Cushion · 8.00 ct · D/IF',                img: '' },
    { id: 39, name: 'Golconda Legacy',         cat: 'rare',    sub: 'Round Brilliant · 6.50 ct · D/FL',        img: '' },
    { id: 40, name: 'The Florentine',          cat: 'rare',    sub: 'Antique Oval · 7.20 ct · E/VVS1',         img: '' },
    { id: 41, name: 'Orlov Star',              cat: 'rare',    sub: 'Rose Cut · 4.80 ct · D/IF',               img: '' },
    { id: 42, name: 'The Darya-i-Nur',        cat: 'rare',    sub: 'Table Cut · 9.10 ct · Fancy Pink',         img: '' },
    { id: 43, name: 'Sancy Reserve',           cat: 'rare',    sub: 'Shield Cut · 3.70 ct · F/VVS1',           img: '' },
    { id: 44, name: "The Idol's Eye",          cat: 'rare',    sub: 'Pear Shape · 5.50 ct · D/FL',             img: '' },
    { id: 45, name: 'Dresden Green',           cat: 'rare',    sub: 'Antique Pear · 4.20 ct · Fancy Green',    img: '' },
    { id: 46, name: 'Hope Heritage',           cat: 'rare',    sub: 'Cushion · 6.00 ct · Fancy Blue',          img: '' },
    { id: 47, name: 'The Steinmetz',           cat: 'rare',    sub: 'Oval · 5.11 ct · Fancy Red',              img: '' },
    { id: 48, name: 'Jubilee Crown',           cat: 'rare',    sub: 'Cushion · 4.50 ct · D/IF',                img: '' },
    { id: 49, name: 'The Agra',               cat: 'rare',    sub: 'Cushion · 3.90 ct · Fancy Pink',           img: '' },
    { id: 50, name: 'Victoria Sovereign',      cat: 'rare',    sub: 'Round · 11.00 ct · D/Flawless',           img: '' },
];

const shapeIcons = {
    round: '⬤', princess: '◼', oval: '⬭', marquise: '◈', cushion: '◆',
    pear: '💧', heart: '♥', emerald: '▬', asscher: '⬛', radiant: '◇',
    trillion: '△', baguette: '▭', default: '◆'
};

const catColors = {
    round:   { bg: 'rgba(232,201,122,0.08)', border: 'rgba(232,201,122,0.25)', icon: '#E8C97A' },
    fancy:   { bg: 'rgba(180,210,255,0.06)', border: 'rgba(180,210,255,0.2)',  icon: '#aaddff' },
    colored: { bg: 'rgba(255,170,200,0.06)', border: 'rgba(255,170,200,0.2)',  icon: '#f4a0c0' },
    rare:    { bg: 'rgba(201,168,76,0.12)',  border: 'rgba(201,168,76,0.4)',   icon: '#C9A84C' },
};

function getShapeFromSub(sub) {
    const s = sub.toLowerCase();
    if (s.includes('round'))    return 'round';
    if (s.includes('princess')) return 'princess';
    if (s.includes('oval'))     return 'oval';
    if (s.includes('marquise')) return 'marquise';
    if (s.includes('cushion'))  return 'cushion';
    if (s.includes('pear'))     return 'pear';
    if (s.includes('heart'))    return 'heart';
    if (s.includes('emerald'))  return 'emerald';
    if (s.includes('asscher'))  return 'asscher';
    if (s.includes('radiant'))  return 'radiant';
    if (s.includes('trillion')) return 'trillion';
    if (s.includes('baguette')) return 'baguette';
    return 'default';
}

function makePlaceholder(d) {
    const c = catColors[d.cat] || catColors.rare;
    const shape = getShapeFromSub(d.sub);
    const icon = shapeIcons[shape] || shapeIcons.default;
    const ct = d.sub.match(/[\d.]+\s*ct/)?.[0] || '';
    return `
    <div class="placeholder-card" style="background:${c.bg};border-color:${c.border};">
      <div class="placeholder-icon" style="color:${c.icon};">${icon}</div>
      <div class="placeholder-label" style="color:${c.icon};">Add Photo</div>
      <div class="placeholder-filename">img_${d.id}.jpg</div>
      ${ct ? `<div class="placeholder-ct">${ct}</div>` : ''}
    </div>`;
}

function renderGallery(filter = 'all') {
    const grid = document.getElementById('galleryGrid');
    grid.innerHTML = '';
    const filtered = filter === 'all' ? diamonds : diamonds.filter(d => d.cat === filter);
    filtered.forEach((d, idx) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.setAttribute('data-cat', d.cat);
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        const content = d.img
            ? `<img src="${d.img}" style="width:100%;height:100%;object-fit:cover;" alt="${d.name}" />`
            : makePlaceholder(d);
        item.innerHTML = `
        <div class="gallery-item-inner">
            ${content}
            <div class="gallery-overlay">
                <div class="gallery-overlay-title">${d.name}</div>
                <div class="gallery-overlay-sub">${d.sub}</div>
            </div>
        </div>`;
        item.onclick = () => openLightbox(d);
        grid.appendChild(item);

        // Staggered entry animation
        setTimeout(() => {
            item.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1)';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, idx * 30);
    });
}

function filterGallery(cat, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Fade out grid, swap, fade in
    const grid = document.getElementById('galleryGrid');
    grid.style.transition = 'opacity 0.25s ease';
    grid.style.opacity = '0';
    setTimeout(() => {
        renderGallery(cat);
        grid.style.opacity = '1';
    }, 250);
}

function openLightbox(d) {
    document.getElementById('lightbox-title').textContent = d.name;
    document.getElementById('lightbox-sub').textContent = d.sub;
    const imgEl = document.getElementById('lightbox-img');
    if (d.img) {
        imgEl.innerHTML = `<img src="${d.img}" style="max-width:280px;max-height:280px;object-fit:contain;" alt="${d.name}" />`;
    } else {
        const c = catColors[d.cat] || catColors.rare;
        const shape = getShapeFromSub(d.sub);
        const icon = shapeIcons[shape] || shapeIcons.default;
        imgEl.innerHTML = `
        <div style="width:220px;height:220px;display:flex;flex-direction:column;align-items:center;justify-content:center;border:1px dashed rgba(201,168,76,0.3);gap:14px;background:rgba(201,168,76,0.04);">
            <div style="font-size:4.5rem;color:${c.icon};opacity:0.75;filter:drop-shadow(0 0 12px ${c.icon});">${icon}</div>
            <div style="font-size:0.58rem;letter-spacing:0.28em;color:rgba(201,168,76,0.5);text-transform:uppercase;">Photo Coming Soon</div>
        </div>`;
    }
    document.getElementById('lightbox').classList.add('open');
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('open');
}

// Close lightbox on backdrop click
document.addEventListener('click', function(e) {
    const lb = document.getElementById('lightbox');
    if (lb && lb.classList.contains('open') && e.target === lb) closeLightbox();
});

// ===== PRELOADER =====
window.addEventListener('load', function() {
    setTimeout(function() {
        const pre = document.getElementById('preloader');
        if (pre) {
            pre.classList.add('done');
            setTimeout(() => pre.remove(), 900);
        }
    }, 1500);
});

// ===== NAV SCROLL GLASSMORPHISM =====
(function() {
    const nav = document.querySelector('nav');
    function handleScroll() {
        nav.classList.toggle('scrolled', window.scrollY > 40);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
})();

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

function attachReveal() {
    document.querySelectorAll('.feature-card, .value-item, .team-card-new, .blog-card, .contact-info-item, .about-text p, .about-text h2, .gallery-item').forEach(function(el, i) {
        if (!el.classList.contains('reveal')) {
            el.classList.add('reveal');
            if (i % 3 === 1) el.classList.add('reveal-delay-1');
            if (i % 3 === 2) el.classList.add('reveal-delay-2');
            revealObserver.observe(el);
        }
    });
}
attachReveal();
setTimeout(attachReveal, 500);
setInterval(attachReveal, 1200);

// ===== CLICK SPARKLE — gold burst =====
document.addEventListener('click', function(e) {
    const burst = document.createElement('div');
    burst.className = 'sparkle-burst';
    burst.style.left = e.clientX + 'px';
    burst.style.top  = e.clientY + 'px';
    const count = 10;
    for (let i = 0; i < count; i++) {
        const s = document.createElement('span');
        const angle = (360 / count) * i + rand(-15, 15);
        const dist  = 24 + Math.random() * 28;
        const rad   = (angle * Math.PI) / 180;
        s.style.setProperty('--tx', Math.cos(rad) * dist + 'px');
        s.style.setProperty('--ty', Math.sin(rad) * dist + 'px');
        s.style.animationDelay = Math.random() * 0.08 + 's';
        // Vary sparkle color slightly
        s.style.background = Math.random() > 0.5 ? '#C9A84C' : '#E8C97A';
        s.style.width  = (2 + Math.random() * 4) + 'px';
        s.style.height = s.style.width;
        burst.appendChild(s);
    }
    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 800);
});

function rand(a, b) { return Math.random() * (b - a) + a; }

// ===== ANIMATED STAT COUNTERS =====
function animateCounters() {
    document.querySelectorAll('.stat-num').forEach(function(el) {
        if (el.dataset.counted) return;
        el.dataset.counted = '1';
        const text = el.textContent.trim();
        const match = text.match(/^(\d+)([K+%]*)$/);
        if (!match) return;
        const target = parseInt(match[1]);
        const suffix = match[2] || '';
        let current = 0;
        const duration = 1800;
        const step = duration / target;
        el.classList.add('counting');
        const timer = setInterval(function() {
            current += Math.ceil(target / 70);
            if (current >= target) {
                current = target;
                clearInterval(timer);
                el.classList.remove('counting');
            }
            el.textContent = current + suffix;
        }, Math.max(step, 16));
    });
}

(function() {
    const statsEl = document.querySelector('.hero-stats');
    if (!statsEl) return;
    const obs = new IntersectionObserver(function(entries) {
        if (entries[0].isIntersecting) { animateCounters(); obs.disconnect(); }
    }, { threshold: 0.5 });
    obs.observe(statsEl);
})();

// ===== 3D TILT EFFECT — feature cards & team cards =====
(function() {
    function addTilt(cards) {
        cards.forEach(function(card) {
            if (card.dataset.tilt) return;
            card.dataset.tilt = '1';
            card.addEventListener('mousemove', function(e) {
                const r = card.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width  - 0.5;
                const y = (e.clientY - r.top)  / r.height - 0.5;
                card.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(6px)`;
            });
            card.addEventListener('mouseleave', function() {
                card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
                card.style.transform = '';
                setTimeout(() => card.style.transition = '', 500);
            });
            card.addEventListener('mouseenter', function() {
                card.style.transition = 'transform 0.1s ease';
            });
        });
    }

    function initTilt() {
        addTilt(document.querySelectorAll('.team-card-new'));
        addTilt(document.querySelectorAll('.feature-card'));
    }
    initTilt();
    setTimeout(initTilt, 900);
})();

// ===== DIAMOND PARALLAX ON SCROLL =====
(function() {
    const diamond = document.querySelector('.hero-diamond');
    if (!diamond) return;
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(() => {
                const s = window.scrollY;
                diamond.style.transform = `translateY(calc(-50% + ${s * 0.14}px))`;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
})();

// ===== KEYBOARD NAV =====
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') { closeLightbox(); closeMenu(); }
});

// ===== GALLERY INIT =====
document.addEventListener('DOMContentLoaded', function() {
    renderGallery('all');
});

// ===== RE-TRIGGER COUNTERS ON HOME REVISIT =====
document.querySelectorAll('[onclick*="showPage(\'home\'"]').forEach(function(el) {
    el.addEventListener('click', function() {
        setTimeout(animateCounters, 250);
    });
});

// ===== HERO TITLE SHIMMER (data-text mirror) =====
document.addEventListener('DOMContentLoaded', function() {
    const em = document.querySelector('.hero-title em');
    if (em) em.setAttribute('data-text', em.textContent);
});
