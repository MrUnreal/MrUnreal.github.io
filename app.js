// Portfolio Landing Page — app.js
(function () {
    'use strict';

    // ─── Config ───
    const GITHUB_USER = 'MrUnreal';
    const CACHE_KEY = 'portfolio_repos';
    const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

    // Featured projects — curated list with metadata overrides
    const FEATURED = [
        {
            repo: 'hAIvemind',
            icon: '🧠',
            tagline: 'Parallel AI coding orchestrator — multi-agent DAG execution with speculative scheduling',
            tags: ['flagship'],
            pagesUrl: null,
        },
        {
            repo: 'ModelForest',
            icon: '🌲',
            tagline: 'Interactive 3D tree visualization of the AI model ecosystem — explore 50+ models',
            tags: ['visualization', 'live'],
            pagesUrl: 'https://mrunreal.github.io/ModelForest',
        },
        {
            repo: 'LLMTracker',
            icon: '📈',
            tagline: 'Real-time LLM benchmark tracker with historical trends and model comparison',
            tags: ['data', 'live'],
            pagesUrl: 'https://mrunreal.github.io/LLMTracker',
        },
        {
            repo: 'AIGraveyard',
            icon: '🪦',
            tagline: 'Interactive graveyard of discontinued AI products — explore the fallen',
            tags: ['visualization', 'live'],
            pagesUrl: 'https://mrunreal.github.io/AIGraveyard',
        },
        {
            repo: 'ContextScale',
            icon: '📏',
            tagline: 'Visualize LLM context windows at human scale — how big is 128K tokens really?',
            tags: ['visualization', 'live'],
            pagesUrl: 'https://mrunreal.github.io/ContextScale',
        },
        {
            repo: 'ReasonTrace',
            icon: '🔬',
            tagline: 'Step-by-step reasoning chain visualizer — see how LLMs think through problems',
            tags: ['visualization', 'live'],
            pagesUrl: 'https://mrunreal.github.io/ReasonTrace',
        },
        {
            repo: 'DeadInternet',
            icon: '☠️',
            tagline: 'Interactive visualization of the Dead Internet phenomenon — watch the bot takeover',
            tags: ['visualization', 'live'],
            pagesUrl: 'https://mrunreal.github.io/DeadInternet',
        },
        {
            repo: 'ContextTetris',
            icon: '🧱',
            tagline: 'Tetris meets LLM context windows — pack tokens into the context window',
            tags: ['game', 'live'],
            pagesUrl: 'https://mrunreal.github.io/ContextTetris',
        },
        {
            repo: 'ConditionLog',
            icon: '🏠',
            tagline: 'AI-powered rental property condition docs — protect your deposit with GPT-4o Vision',
            tags: ['app', 'ai'],
            pagesUrl: null,
        },
        {
            repo: 'codemind',
            icon: '🧠',
            tagline: 'MCP server giving GitHub Copilot 20 tools for codebase memory and understanding',
            tags: ['tool', 'ai'],
            pagesUrl: null,
        },
        {
            repo: 'copilot-wiggum',
            icon: '�',
            tagline: 'Multi-agent orchestrator for GitHub Copilot — breaks big tasks into subtasks',
            tags: ['tool', 'ai'],
            pagesUrl: null,
        },
    ];

    // Language colors (GitHub style)
    const LANG_COLORS = {
        JavaScript: '#f1e05a',
        TypeScript: '#3178c6',
        Python: '#3572A5',
        HTML: '#e34c26',
        CSS: '#563d7c',
        Vue: '#41b883',
        Shell: '#89e051',
        Dockerfile: '#384d54',
        'C#': '#178600',
        Java: '#b07219',
    };

    // ─── SVG Icon System ───
    const ICON_SVGS = {
        network: '<circle cx="12" cy="4" r="2"/><circle cx="4" cy="20" r="2"/><circle cx="20" cy="20" r="2"/><circle cx="12" cy="13" r="2.5"/><line x1="12" y1="6" x2="12" y2="10.5"/><line x1="10" y1="14.7" x2="5.5" y2="18.5"/><line x1="14" y1="14.7" x2="18.5" y2="18.5"/>',
        tree: '<path d="M12 3v18"/><path d="M5 10l7-4 7 4"/><path d="M7 15l5-3 5 3"/>',
        chart: '<polyline points="3 17 8 12 12 15 21 5"/><polyline points="17 5 21 5 21 9"/>',
        tombstone: '<path d="M7 22V9a5 5 0 0 1 10 0v13"/><line x1="5" y1="22" x2="19" y2="22"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>',
        layers: '<polygon points="12 2 2 7 12 12 22 7"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
        flow: '<circle cx="6" cy="5" r="2"/><circle cx="18" cy="5" r="2"/><circle cx="12" cy="20" r="2"/><path d="M6 7c0 5 6 7 6 11"/><path d="M18 7c0 5-6 7-6 11"/>',
        globe: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2"/>',
        blocks: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="17" y="17" width="4" height="4" rx="0.5"/>',
        pulse: '<path d="M3 12h3l3-7 4 14 3-7h5"/>',
        code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
        shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>',
    };

    const ICON_GRADIENTS = {
        network: { bg: 'linear-gradient(135deg, #58a6ff, #1f6feb)', glow: 'rgba(88, 166, 255, 0.4)' },
        tree: { bg: 'linear-gradient(135deg, #22c55e, #15803d)', glow: 'rgba(34, 197, 94, 0.35)' },
        chart: { bg: 'linear-gradient(135deg, #06b6d4, #0e7490)', glow: 'rgba(6, 182, 212, 0.35)' },
        tombstone: { bg: 'linear-gradient(135deg, #6b7280, #4b5563)', glow: 'rgba(107, 114, 128, 0.3)' },
        layers: { bg: 'linear-gradient(135deg, #79b8ff, #388bfd)', glow: 'rgba(121, 184, 255, 0.35)' },
        flow: { bg: 'linear-gradient(135deg, #f472b6, #db2777)', glow: 'rgba(244, 114, 182, 0.35)' },
        globe: { bg: 'linear-gradient(135deg, #ef4444, #b91c1c)', glow: 'rgba(239, 68, 68, 0.3)' },
        blocks: { bg: 'linear-gradient(135deg, #f97316, #c2410c)', glow: 'rgba(249, 115, 22, 0.35)' },
        pulse: { bg: 'linear-gradient(135deg, #10b981, #047857)', glow: 'rgba(16, 185, 129, 0.35)' },
        code: { bg: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', glow: 'rgba(59, 130, 246, 0.35)' },
        shield: { bg: 'linear-gradient(135deg, #eab308, #a16207)', glow: 'rgba(234, 179, 8, 0.3)' },
    };

    const REPO_ICON_MAP = {
        'hAIvemind': 'network',
        'ModelForest': 'tree',
        'LLMTracker': 'chart',
        'AIGraveyard': 'tombstone',
        'ContextScale': 'layers',
        'ReasonTrace': 'flow',
        'DeadInternet': 'globe',
        'ContextTetris': 'blocks',
        'ConditionLog': 'pulse',
        'codemind': 'code',
        'copilot-wiggum': 'shield',
    };

    // ─── Skills ───
    const SKILL_CATEGORIES = [
        {
            label: 'Systems & Low-Level',
            accent: 'purple',
            subtitle: 'Go deep',
            skills: ['C/C++', 'Rust', 'x86 ASM'],
        },
        {
            label: 'Enterprise & Backend',
            accent: 'cyan',
            subtitle: 'Build at scale',
            skills: ['C#', 'Java', 'Kotlin', 'Go'],
        },
        {
            label: 'Scripting & Automation',
            accent: 'green',
            subtitle: 'Move fast',
            skills: ['Python', 'Perl', 'Bash', 'Lua'],
        },
        {
            label: 'Web & Interactive',
            accent: 'orange',
            subtitle: 'Ship products',
            skills: ['JavaScript', 'TypeScript', 'SQL'],
        },
        {
            label: 'Domains',
            accent: 'pink',
            subtitle: 'Right stack for the right problem',
            skills: ['Full-Stack Development', 'Cloud & Infrastructure', 'Data Engineering', 'AI & LLM Systems', 'Agent Orchestration', 'Reverse Engineering', 'Fintech & ESG'],
        },
    ];

    // Rotating hero text
    const HERO_PHRASES = [
        'agentic era',
        'AI ecosystem',
        'next generation',
        'open source',
        'dev tooling',
    ];

    // ─── DOM refs ───
    const projectsGrid = document.getElementById('projects-grid');
    const projectsLoading = document.getElementById('projects-loading');
    const skillsContainer = document.getElementById('skills-container');
    const statRepos = document.getElementById('stat-repos');
    const statLanguages = document.getElementById('stat-languages');
    const statFeatured = document.getElementById('stat-featured');
    const statActivity = document.getElementById('stat-activity');
    const tickerTrack = document.getElementById('ticker-track');
    const rotatingText = document.getElementById('rotating-text');
    const nav = document.getElementById('nav');
    const bgCanvas = document.getElementById('bg-canvas');
    const bgCtx = bgCanvas.getContext('2d');

    // ─── GitHub API fetch with caching ───
    async function fetchRepos() {
        // Check cache
        try {
            const cached = sessionStorage.getItem(CACHE_KEY);
            if (cached) {
                const { data, ts } = JSON.parse(cached);
                if (Date.now() - ts < CACHE_TTL) return data;
            }
        } catch (e) { /* no cache */ }

        const url = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`GitHub API: ${res.status}`);
        const data = await res.json();

        try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
        } catch (e) { /* storage full */ }

        return data;
    }

    // ─── Render projects ───
    function renderProjects(repos) {
        const repoMap = {};
        repos.forEach(r => { repoMap[r.name] = r; });

        projectsGrid.innerHTML = '';

        FEATURED.forEach(project => {
            const repo = repoMap[project.repo];
            const desc = project.tagline || (repo ? repo.description : '') || 'No description';
            const lang = repo ? repo.language : null;
            const stars = repo ? repo.stargazers_count : 0;
            const url = project.pagesUrl || (repo ? repo.html_url : `https://github.com/${GITHUB_USER}/${project.repo}`);

            const card = document.createElement('a');
            card.href = url;
            card.target = '_blank';
            card.rel = 'noopener';
            card.className = 'project-card fade-in';

            const tagsHTML = project.tags.map(t => {
                if (t === 'live') return '<span class="project-tag live">Live Demo</span>';
                if (t === 'flagship') return '<span class="project-tag">Flagship</span>';
                return `<span class="project-tag">${t}</span>`;
            }).join('');

            const iconKey = REPO_ICON_MAP[project.repo] || 'network';
            const iconGrad = ICON_GRADIENTS[iconKey];
            const iconSvg = ICON_SVGS[iconKey];

            card.innerHTML = `
                <div class="project-icon-wrap" style="background:${iconGrad.bg};box-shadow:0 4px 16px ${iconGrad.glow}">
                    <svg viewBox="0 0 24 24">${iconSvg}</svg>
                </div>
                <div class="project-name">${project.repo} <span class="arrow">→</span></div>
                <div class="project-desc">${desc}</div>
                <div class="project-meta">
                    ${lang ? `<span class="project-lang"><span class="lang-dot" style="background:${LANG_COLORS[lang] || '#8b8b8b'}"></span>${lang}</span>` : ''}
                    ${stars > 0 ? `<span class="project-stars">★ ${stars}</span>` : ''}
                    ${tagsHTML}
                </div>
            `;

            projectsGrid.appendChild(card);
        });

        projectsLoading.classList.add('hidden');

        // Stagger fade-in
        requestAnimationFrame(() => {
            document.querySelectorAll('.project-card.fade-in').forEach((el, i) => {
                setTimeout(() => el.classList.add('visible'), i * 80);
            });
        });
    }

    // ─── Render skills ───
    function renderSkills(repos) {
        // Collect repo languages to add any detected ones not already listed
        const repoLangs = new Set();
        repos.forEach(r => { if (r.language) repoLangs.add(r.language); });

        skillsContainer.innerHTML = '';
        let badgeIdx = 0;

        SKILL_CATEGORIES.forEach((cat, catIdx) => {
            const group = document.createElement('div');
            group.className = 'skill-group fade-in';
            group.style.transitionDelay = `${catIdx * 60}ms`;

            // Merge detected repo languages into the Languages category
            let skills = [...cat.skills];
            if (cat.label === 'Languages') {
                repoLangs.forEach(lang => {
                    if (!skills.includes(lang)) skills.push(lang);
                });
            }

            group.innerHTML = `
                <div class="skill-group-header">
                    <span class="skill-group-dot accent-${cat.accent}"></span>
                    <span class="skill-group-label">${cat.label}</span>
                    ${cat.subtitle ? `<span class="skill-group-subtitle">${cat.subtitle}</span>` : ''}
                </div>
                <div class="skill-group-badges">
                    ${skills.map((s, i) => {
                        badgeIdx++;
                        return `<span class="skill-badge accent-${cat.accent} fade-in" style="transition-delay:${badgeIdx * 25}ms"><span class="skill-dot"></span>${s}</span>`;
                    }).join('')}
                </div>
            `;

            skillsContainer.appendChild(group);
        });
    }

    // ─── Render stats ───
    function renderStats(repos) {
        const langSet = new Set();
        repos.forEach(r => { if (r.language) langSet.add(r.language); });

        animateNumber(statRepos, repos.length);
        animateNumber(statLanguages, langSet.size);
        animateNumber(statFeatured, FEATURED.length);

        // Last active
        if (repos.length > 0) {
            const latest = new Date(repos[0].pushed_at);
            const days = Math.floor((Date.now() - latest) / (1000 * 60 * 60 * 24));
            statActivity.textContent = days === 0 ? 'Today' : days === 1 ? '1d ago' : `${days}d ago`;
        }
    }

    function animateNumber(el, target) {
        let current = 0;
        const duration = 1200;
        const start = performance.now();
        function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            current = Math.round(eased * target);
            el.textContent = current;
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    // ─── Ticker ───
    function buildTicker(repos) {
        const items = [];
        FEATURED.slice(0, 8).forEach(p => {
            items.push(`› ${p.repo}`);
        });
        // Add some stats
        items.push(`${repos.length} repos`);
        const langSet = new Set();
        repos.forEach(r => { if (r.language) langSet.add(r.language); });
        items.push(`${langSet.size} languages`);
        items.push('auto-updated via GitHub API');

        // Duplicate for seamless scroll
        const html = items.map((t, i) => {
            return `<span${i % 3 === 0 ? ' class="highlight"' : ''}>${t}</span>`;
        }).join('');
        tickerTrack.innerHTML = html + html;
    }

    // ─── Rotating hero text ───
    let phraseIndex = 0;
    function rotateHeroText() {
        phraseIndex = (phraseIndex + 1) % HERO_PHRASES.length;
        rotatingText.style.opacity = '0';
        rotatingText.style.transform = 'translateY(10px)';
        setTimeout(() => {
            rotatingText.textContent = HERO_PHRASES[phraseIndex];
            rotatingText.style.opacity = '1';
            rotatingText.style.transform = 'translateY(0)';
        }, 300);
    }
    rotatingText.style.transition = 'opacity 0.3s, transform 0.3s';
    setInterval(rotateHeroText, 3000);

    // ─── Nav scroll effect ───
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    });

    // ─── Intersection observer for fade-ins ───
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    function observeFadeIns() {
        document.querySelectorAll('.fade-in:not(.visible)').forEach(el => observer.observe(el));
    }

    // ─── Ambient background particles (neural-net style) ───
    let particles = [];
    let canvasW, canvasH;
    const dpr = window.devicePixelRatio || 1;
    const PARTICLE_COUNT = 80;
    const CONNECTION_DIST = 160;
    const MOUSE_BOOST_DIST = 200;
    let mouse = { x: -9999, y: -9999 };

    document.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    document.addEventListener('mouseleave', () => {
        mouse.x = -9999;
        mouse.y = -9999;
    });

    function resizeCanvas() {
        canvasW = window.innerWidth;
        canvasH = window.innerHeight;
        bgCanvas.width = canvasW * dpr;
        bgCanvas.height = canvasH * dpr;
        bgCanvas.style.width = canvasW + 'px';
        bgCanvas.style.height = canvasH + 'px';
        bgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvasW;
            this.y = Math.random() * canvasH;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.baseRadius = 1.2 + Math.random() * 1.3;
            this.radius = this.baseRadius;
            this.alpha = 0.2 + Math.random() * 0.3;
            this.hue = Math.random() < 0.7 ? 215 : 190;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvasW) this.vx *= -1;
            if (this.y < 0 || this.y > canvasH) this.vy *= -1;

            // Enlarge near cursor
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const md = Math.sqrt(dx * dx + dy * dy);
            this.radius = md < MOUSE_BOOST_DIST
                ? this.baseRadius + (1 - md / MOUSE_BOOST_DIST) * 2
                : this.baseRadius;
        }

        draw(ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 60%, 65%, ${this.alpha})`;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }
    }

    function animateBackground() {
        bgCtx.clearRect(0, 0, canvasW, canvasH);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
        }

        // Draw connections — proximity-based like a neural net
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECTION_DIST) {
                    const t = 1 - dist / CONNECTION_DIST;   // 1 = touching, 0 = at edge

                    // Boost connections near cursor
                    const mx = (particles[i].x + particles[j].x) / 2;
                    const my = (particles[i].y + particles[j].y) / 2;
                    const md = Math.sqrt((mx - mouse.x) ** 2 + (my - mouse.y) ** 2);
                    const cursorBoost = md < MOUSE_BOOST_DIST
                        ? 1 + (1 - md / MOUSE_BOOST_DIST) * 3
                        : 1;

                    const alpha = Math.min(t * 0.15 * cursorBoost, 0.45);
                    const width = Math.min(0.5 + t * 0.8 * cursorBoost, 2);

                    bgCtx.beginPath();
                    bgCtx.moveTo(particles[i].x, particles[i].y);
                    bgCtx.lineTo(particles[j].x, particles[j].y);
                    bgCtx.strokeStyle = `rgba(88, 166, 255, ${alpha})`;
                    bgCtx.lineWidth = width;
                    bgCtx.stroke();
                }
            }
        }

        // Draw particles on top
        for (let i = 0; i < particles.length; i++) {
            particles[i].draw(bgCtx);
        }

        requestAnimationFrame(animateBackground);
    }

    // ─── Init ───
    async function init() {
        // Canvas
        resizeCanvas();
        initParticles();
        requestAnimationFrame(animateBackground);

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                resizeCanvas();
                initParticles();
            }, 200);
        });

        // Fetch and render
        try {
            const repos = await fetchRepos();
            renderProjects(repos);
            renderSkills(repos);
            renderStats(repos);
            buildTicker(repos);
        } catch (err) {
            console.error('GitHub API error:', err);
            // Fallback: render with empty repo data
            renderProjects([]);
            renderSkills([]);
            statRepos.textContent = '—';
            statLanguages.textContent = '—';
            statFeatured.textContent = FEATURED.length;
            statActivity.textContent = '—';
            buildTicker([]);
            projectsLoading.innerHTML = '<span style="color:#ef4444">Could not fetch GitHub data — showing cached info</span>';
            projectsLoading.classList.remove('hidden');
        }

        // Observe fade-ins after a tick
        requestAnimationFrame(observeFadeIns);
        // Re-observe on scroll (for dynamically added elements)
        let scrollTimer;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(observeFadeIns, 100);
        });
    }

    init();
})();
