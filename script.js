// ===== MOBILE NAV =====
function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('open');
    document.getElementById('navHamburger').classList.toggle('open');
}
function closeMenu() {
    document.getElementById('navLinks').classList.remove('open');
    document.getElementById('navHamburger').classList.remove('open');
}

// ===== HERO PARTICLES =====
(function() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
        W = canvas.width  = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Particle types: dot, cross (✦), diamond (◆)
    const TYPES = ['dot', 'cross', 'diamond'];

    function rand(min, max) { return Math.random() * (max - min) + min; }

    function createParticle() {
        const type = TYPES[Math.floor(Math.random() * TYPES.length)];
        return {
            x: rand(0, W),
            y: rand(0, H),
            size: rand(1, type === 'dot' ? 2.5 : 6),
            speedX: rand(-0.15, 0.15),
            speedY: rand(-0.4, -0.1),
            opacity: rand(0.1, 0.7),
            fadeSpeed: rand(0.002, 0.006),
            growing: true,
            maxOpacity: rand(0.3, 0.8),
            type,
            twinkle: Math.random() > 0.5,
            twinkleSpeed: rand(0.01, 0.03),
            twinklePhase: rand(0, Math.PI * 2),
        };
    }

    for (let i = 0; i < 120; i++) particles.push(createParticle());

    function drawDiamond(ctx, x, y, size) {
        ctx.beginPath();
        ctx.moveTo(x, y - size);
        ctx.lineTo(x + size * 0.6, y);
        ctx.lineTo(x, y + size);
        ctx.lineTo(x - size * 0.6, y);
        ctx.closePath();
        ctx.fill();
    }

    function drawCross(ctx, x, y, size) {
        const s = size * 0.5;
        ctx.beginPath();
        ctx.moveTo(x, y - size); ctx.lineTo(x, y + size);
        ctx.moveTo(x - size, y); ctx.lineTo(x + size, y);
        ctx.moveTo(x - s, y - s); ctx.lineTo(x + s, y + s);
        ctx.moveTo(x + s, y - s); ctx.lineTo(x - s, y + s);
        ctx.stroke();
    }

    function animate() {
        ctx.clearRect(0, 0, W, H);

        particles.forEach((p, i) => {
            // Twinkle
            if (p.twinkle) {
                p.twinklePhase += p.twinkleSpeed;
                p.opacity = p.maxOpacity * (0.4 + 0.6 * Math.abs(Math.sin(p.twinklePhase)));
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

            p.x += p.speedX;
            p.y += p.speedY;
            if (p.y < -20) { particles[i] = createParticle(); return; }

            const gold = `rgba(201,168,76,${p.opacity})`;
            const white = `rgba(255,255,255,${p.opacity * 0.6})`;
            const color = Math.random() > 0.85 ? white : gold;

            ctx.fillStyle = color;
            ctx.strokeStyle = color;
            ctx.lineWidth = 0.8;

            if (p.type === 'dot') {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                // Glow
                if (p.size > 1.5) {
                    ctx.beginPath();
                    const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
                    grd.addColorStop(0, `rgba(201,168,76,${p.opacity * 0.3})`);
                    grd.addColorStop(1, 'transparent');
                    ctx.fillStyle = grd;
                    ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
                    ctx.fill();
                }
            } else if (p.type === 'cross') {
                drawCross(ctx, p.x, p.y, p.size);
            } else {
                ctx.fillStyle = color;
                drawDiamond(ctx, p.x, p.y, p.size);
            }
        });

        requestAnimationFrame(animate);
    }
    animate();
})();

// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
if (cursor && ring) {
    document.addEventListener('mousemove', e => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        setTimeout(() => {
            ring.style.left = e.clientX + 'px';
            ring.style.top = e.clientY + 'px';
        }, 80);
    });
    document.querySelectorAll('button, a, .gallery-item, .blog-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            ring.style.width = '60px';
            ring.style.height = '60px';
            ring.style.opacity = '0.3';
        });
        el.addEventListener('mouseleave', () => {
            ring.style.width = '36px';
            ring.style.height = '36px';
            ring.style.opacity = '0.6';
        });
    });
}

// ===== PAGE NAVIGATION =====
function showPage(name) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const page = document.getElementById(name);
    page.classList.add('active', 'page-enter');
    setTimeout(() => page.classList.remove('page-enter'), 600);

    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active-link'));
    const navEl = document.getElementById('nav-' + name);
    if (navEl) navEl.classList.add('active-link');

    // Render gallery whenever the gallery page is opened
    if (name === 'gallery') {
        renderGallery('all');
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        const allBtn = document.querySelector('.filter-btn');
        if (allBtn) allBtn.classList.add('active');
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
    return false;
}

// ===== FORM SUBMIT (Formspree — emails to anthemjewelsin@gmail.com) =====
async function submitForm() {
    const fname = document.getElementById('fname').value.trim();
    const lname = document.getElementById('lname').value.trim();
    const email = document.getElementById('email').value.trim();
    const inquiry = document.getElementById('inquiry-type').value;
    const budget = document.getElementById('budget').value;
    const message = document.getElementById('message').value.trim();

    if (!fname || !email) {
        alert('Please fill in your name and email.');
        return;
    }

    const btn = document.querySelector('.submit-btn');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    try {
        const res = await fetch('https://formspree.io/f/myklgqnw', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                name: fname + ' ' + lname,
                email: email,
                inquiry_type: inquiry,
                budget: budget,
                message: message
            })
        });

        if (res.ok) {
            document.getElementById('form-success').style.display = 'block';
            document.getElementById('fname').value = '';
            document.getElementById('lname').value = '';
            document.getElementById('email').value = '';
            document.getElementById('inquiry-type').value = '';
            document.getElementById('budget').value = '';
            document.getElementById('message').value = '';
            setTimeout(() => { document.getElementById('form-success').style.display = 'none'; }, 5000);
        } else {
            alert('Something went wrong. Please try again.');
        }
    } catch (err) {
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
    });
}

// ===== GALLERY DATA — 50 UNIQUE DIAMONDS =====
const diamonds = [
    // ROUND
    { id: 1,  name: 'Celestial Round',       cat: 'round',   sub: 'Round Brilliant · 2.10 ct · D/IF',       img: './images/Brillian cut round.png' },
    { id: 2,  name: 'Classic Solitaire',      cat: 'round',   sub: 'Round Brilliant · 1.50 ct · E/VS2',      img: './images/loose round brilliant.png' },
    { id: 3,  name: 'Arctic Light',           cat: 'round',   sub: 'Round Brilliant · 3.00 ct · D/VVS1',     img: './images/arctic light.png' },
    { id: 4,  name: 'Solar Blaze',            cat: 'round',   sub: 'Round Brilliant · 1.75 ct · F/VS1',      img: '' },
    { id: 5,  name: 'Polar Star',             cat: 'round',   sub: 'Round Brilliant · 2.40 ct · E/VVS2',     img: '' },
    { id: 6,  name: 'Ivory Halo',             cat: 'round',   sub: 'Round Brilliant · 1.20 ct · G/VS1',      img: '' },
    { id: 7,  name: 'Zenith Round',           cat: 'round',   sub: 'Round Brilliant · 4.10 ct · D/FL',       img: '' },
    { id: 8,  name: 'Silver Moon',            cat: 'round',   sub: 'Round Brilliant · 0.90 ct · E/VS2',      img: '' },
    { id: 9,  name: 'Nova Spark',             cat: 'round',   sub: 'Round Brilliant · 2.80 ct · F/VVS1',     img: '' },
    { id: 10, name: 'Eternal White',          cat: 'round',   sub: 'Round Brilliant · 1.60 ct · D/IF',       img: '' },

    // FANCY CUTS
    { id: 11, name: 'Empress Cut',            cat: 'fancy',   sub: 'Princess Cut · 1.80 ct · E/VVS1',        img: '' },
    { id: 12, name: 'Ocean Oval',             cat: 'fancy',   sub: 'Oval Shape · 2.50 ct · G/VS1',           img: '' },
    { id: 13, name: 'Pear Blossom',           cat: 'fancy',   sub: 'Pear Shape · 1.70 ct · F/VS1',           img: '' },
    { id: 14, name: 'Emerald Isle',           cat: 'fancy',   sub: 'Emerald Cut · 3.00 ct · G/VVS1',         img: '' },
    { id: 15, name: 'Marquise Mirage',        cat: 'fancy',   sub: 'Marquise Cut · 2.20 ct · E/VS2',         img: '' },
    { id: 16, name: 'Radiant Dawn',           cat: 'fancy',   sub: 'Radiant Cut · 2.70 ct · D/VVS2',         img: '' },
    { id: 17, name: 'Cushion Cloud',          cat: 'fancy',   sub: 'Cushion Cut · 3.10 ct · F/VS1',          img: './images/Cushion Cloud Cushion Cut.png' },
    { id: 18, name: 'Asscher Royale',         cat: 'fancy',   sub: 'Asscher Cut · 1.90 ct · E/VVS1',         img: './images/asscher-royale-diamond.png' },
    { id: 19, name: 'Trillion Dream',         cat: 'fancy',   sub: 'Trillion Cut · 1.40 ct · G/VS2',         img: './images/triangle.png' },
    { id: 20, name: 'Baguette Grace',         cat: 'fancy',   sub: 'Baguette Cut · 0.80 ct · F/VS1',         img: '' },
    { id: 21, name: 'Teardrop Serenity',      cat: 'fancy',   sub: 'Pear Shape · 2.10 ct · D/IF',            img: '' },
    { id: 22, name: 'Princess Aurora',        cat: 'fancy',   sub: 'Princess Cut · 2.60 ct · E/VVS2',        img: '' },

    // COLORED
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
    { id: 34, name: 'Rose Lumiere',           cat: 'colored', sub: 'Fancy Pink · 1.40 ct · Vivid',            img: './images/rose-lumiere.png' },

    // RARE
    { id: 35, name: 'The Koh-i-Noor Reserve', cat: 'rare',   sub: 'Cushion · 5.20 ct · D/Flawless',          img: './images/kohinoor reserve.png' },
    { id: 36, name: 'Eternal Marquise',        cat: 'rare',   sub: 'Marquise Cut · 3.10 ct · F/VVS2',         img: './images/photorealistic.png' },
    { id: 37, name: 'Heart of Eternity',       cat: 'rare',   sub: 'Heart Shape · 1.00 ct · E/VS2',           img: '' },
    { id: 38, name: 'The Regent',              cat: 'rare',   sub: 'Cushion · 8.00 ct · D/IF',                img: '' },
    { id: 39, name: 'Golconda Legacy',         cat: 'rare',   sub: 'Round Brilliant · 6.50 ct · D/FL',        img: '' },
    { id: 40, name: 'The Florentine',          cat: 'rare',   sub: 'Antique Oval · 7.20 ct · E/VVS1',         img: '' },
    { id: 41, name: 'Orlov Star',              cat: 'rare',   sub: 'Rose Cut · 4.80 ct · D/IF',               img: '' },
    { id: 42, name: 'The Darya-i-Nur',        cat: 'rare',   sub: 'Table Cut · 9.10 ct · Fancy Pink',         img: '' },
    { id: 43, name: 'Sancy Reserve',           cat: 'rare',   sub: 'Shield Cut · 3.70 ct · F/VVS1',           img: '' },
    { id: 44, name: 'The Idol\'s Eye',         cat: 'rare',   sub: 'Pear Shape · 5.50 ct · D/FL',             img: '' },
    { id: 45, name: 'Dresden Green',           cat: 'rare',   sub: 'Antique Pear · 4.20 ct · Fancy Green',    img: '' },
    { id: 46, name: 'Hope Heritage',           cat: 'rare',   sub: 'Cushion · 6.00 ct · Fancy Blue',          img: '' },
    { id: 47, name: 'The Steinmetz',           cat: 'rare',   sub: 'Oval · 5.11 ct · Fancy Red',              img: '' },
    { id: 48, name: 'Jubilee Crown',           cat: 'rare',   sub: 'Cushion · 4.50 ct · D/IF',                img: '' },
    { id: 49, name: 'The Agra',               cat: 'rare',   sub: 'Cushion · 3.90 ct · Fancy Pink',           img: '' },
    { id: 50, name: 'Victoria Sovereign',      cat: 'rare',   sub: 'Round · 11.00 ct · D/Flawless',           img: '' },
];

// Shape icons for placeholder
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
    filtered.forEach(d => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.setAttribute('data-cat', d.cat);
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
    });
}

function filterGallery(cat, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderGallery(cat);
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
        <div style="width:200px;height:200px;display:flex;flex-direction:column;align-items:center;justify-content:center;border:1px dashed rgba(201,168,76,0.3);gap:12px;">
            <div style="font-size:4rem;color:${c.icon};opacity:0.7;">${icon}</div>
            <div style="font-size:0.6rem;letter-spacing:0.25em;color:rgba(201,168,76,0.5);text-transform:uppercase;">Photo Coming Soon</div>
            <div style="font-size:0.55rem;letter-spacing:0.15em;color:rgba(153,153,153,0.4);">img_${d.id}.jpg</div>
        </div>`;
    }
    document.getElementById('lightbox').classList.add('open');
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('open');
}

// ===== INIT =====
// Pre-render gallery so it's ready when the user first visits
document.addEventListener('DOMContentLoaded', function() {
    renderGallery('all');
});

// Close lightbox on backdrop click
document.addEventListener('click', function(e) {
    const lb = document.getElementById('lightbox');
    if (lb && lb.classList.contains('open') && e.target === lb) {
        closeLightbox();
    }
});

// ===== PRELOADER =====
window.addEventListener('load', function() {
    setTimeout(function() {
        const pre = document.getElementById('preloader');
        if (pre) {
            pre.classList.add('done');
            setTimeout(() => pre.remove(), 600);
        }
    }, 1300);
});

// ===== NAV SCROLL GLASSMORPHISM =====
(function() {
    const nav = document.querySelector('nav');
    function handleScroll() {
        if (window.scrollY > 40) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
})();

// ===== SCROLL REVEAL =====
(function() {
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    function attachReveal() {
        document.querySelectorAll('.feature-card, .value-item, .team-card-new, .blog-card, .contact-info-item, .about-text p, .about-text h2').forEach(function(el, i) {
            if (!el.classList.contains('reveal')) {
                el.classList.add('reveal');
                if (i % 3 === 1) el.classList.add('reveal-delay-1');
                if (i % 3 === 2) el.classList.add('reveal-delay-2');
                observer.observe(el);
            }
        });
    }
    attachReveal();
    // Re-attach when page switches
    document.addEventListener('pageChanged', attachReveal);
    setTimeout(attachReveal, 400);
    setInterval(attachReveal, 1000); // keep watching for dynamically-shown pages
})();

// ===== CLICK SPARKLE EFFECT =====
document.addEventListener('click', function(e) {
    // Don't sparkle on buttons or nav to avoid confusion
    const burst = document.createElement('div');
    burst.className = 'sparkle-burst';
    burst.style.left = e.clientX + 'px';
    burst.style.top = e.clientY + 'px';
    const count = 8;
    for (let i = 0; i < count; i++) {
        const s = document.createElement('span');
        const angle = (360 / count) * i;
        const dist = 20 + Math.random() * 20;
        const rad = (angle * Math.PI) / 180;
        s.style.setProperty('--tx', Math.cos(rad) * dist + 'px');
        s.style.setProperty('--ty', Math.sin(rad) * dist + 'px');
        s.style.animationDelay = Math.random() * 0.1 + 's';
        burst.appendChild(s);
    }
    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 700);
});

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
        const duration = 1500;
        const step = duration / target;
        el.classList.add('counting');
        const timer = setInterval(function() {
            current += Math.ceil(target / 60);
            if (current >= target) {
                current = target;
                clearInterval(timer);
                el.classList.remove('counting');
            }
            el.textContent = current + suffix;
        }, step > 16 ? step : 16);
    });
}

// Trigger counter when hero stats come into view
(function() {
    const statsEl = document.querySelector('.hero-stats');
    if (!statsEl) return;
    const obs = new IntersectionObserver(function(entries) {
        if (entries[0].isIntersecting) {
            animateCounters();
            obs.disconnect();
        }
    }, { threshold: 0.5 });
    obs.observe(statsEl);
})();

// ===== TILT EFFECT ON TEAM CARDS =====
(function() {
    function addTilt(cards) {
        cards.forEach(function(card) {
            if (card.dataset.tilt) return;
            card.dataset.tilt = '1';
            card.addEventListener('mousemove', function(e) {
                const r = card.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width - 0.5;
                const y = (e.clientY - r.top) / r.height - 0.5;
                card.style.transform = 'perspective(600px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 8) + 'deg) translateY(-4px)';
            });
            card.addEventListener('mouseleave', function() {
                card.style.transform = '';
            });
        });
    }
    function initTilt() {
        addTilt(document.querySelectorAll('.team-card-new'));
        addTilt(document.querySelectorAll('.feature-card'));
    }
    initTilt();
    setTimeout(initTilt, 800);
})();

// ===== DIAMOND PARALLAX ON SCROLL =====
(function() {
    const diamond = document.querySelector('.hero-diamond');
    if (!diamond) return;
    window.addEventListener('scroll', function() {
        const s = window.scrollY;
        diamond.style.transform = 'translateY(calc(-50% + ' + (s * 0.12) + 'px))';
    }, { passive: true });
})();

// ===== KEYBOARD NAV CLOSE =====
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLightbox();
        closeMenu();
    }
});

// Re-trigger counters when home page is revisited
const _origShowPage = showPage;
// (showPage is already defined above in the file, so we patch the nav links via a listener)
document.querySelectorAll('[onclick*="showPage(\'home\'"]').forEach(function(el) {
    el.addEventListener('click', function() {
        setTimeout(animateCounters, 200);
    });
});

