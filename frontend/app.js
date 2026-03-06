// frontend/app.js

// Estado global
let currentLang = 'en';
let currentFilter = 'all';
let mediaData = [];

// Inicialización
window.onload = () => {
    initTheme();
    initLanguage();
    updateUI();
    lucide.createIcons();
};

// ------------------ Tema ------------------
function initTheme() {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    updateIcons();
}

function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    updateIcons();
}

function updateIcons() {
    document.getElementById('sun-icon').classList.toggle('hidden', !document.documentElement.classList.contains('dark'));
    document.getElementById('moon-icon').classList.toggle('hidden', document.documentElement.classList.contains('dark'));
}

// ------------------ Idioma ------------------
function initLanguage() {
    const savedLang = localStorage.getItem('lang');
    if (savedLang) currentLang = savedLang;
    updateUI();
}

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'es' : 'en';
    localStorage.setItem('lang', currentLang);
    updateUI();
}

function updateUI() {
    document.getElementById('lang-label').innerText = currentLang === 'en' ? 'ES' : 'EN';

    document.querySelectorAll('[data-en]').forEach(el => {
        el.innerText = el.getAttribute(`data-${currentLang}`);
    });

    const urlInput = document.getElementById('input-url');
    const userInput = document.getElementById('input-user');

    urlInput.placeholder = currentLang === 'en' ? "https://www.instagram.com/reels/..." : "Pega el enlace aquí...";
    userInput.placeholder = currentLang === 'en' ? "@username" : "@nombredeusuario";
}

// ------------------ Descargar Media ------------------
async function fetchMedia() {
    const inputUrl = document.getElementById('input-url').value.trim();
    const inputUser = document.getElementById('input-user').value.trim();
    const loader = document.getElementById('global-loader');

    if (!inputUrl && !inputUser) {
        alert(currentLang === 'en' ? 'Please enter an Instagram URL or username.' : 'Por favor, ingresa una URL o un usuario de Instagram.');
        return;
    }

    // Mostrar loader
    loader.classList.remove('hidden');
    loader.classList.add('flex');

    try {
        // Llamada segura al backend en Vercel
        const response = await fetch('/api/instagram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: inputUrl, username: inputUser })
        });

        if (!response.ok) throw new Error('Error fetching data');

        const data = await response.json();
        mediaData = data.media || [];
        currentFilter = 'all';
        renderGrid();

        document.getElementById('results-section').classList.remove('hidden');
        document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
        console.error(err);
        alert(currentLang === 'en' ? 'Error connecting to server.' : 'Error al conectar con el servidor.');
    } finally {
        loader.classList.add('hidden');
        loader.classList.remove('flex');
    }
}

// ------------------ Filtrado ------------------
function filterContent(type) {
    currentFilter = type;
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('bg-primary-600', btn.getAttribute('data-type') === type);
        btn.classList.toggle('text-white', btn.getAttribute('data-type') === type);
        btn.classList.toggle('shadow-lg', btn.getAttribute('data-type') === type);
        btn.classList.toggle('scale-105', btn.getAttribute('data-type') === type);
        btn.classList.toggle('bg-white', btn.getAttribute('data-type') !== type);
        btn.classList.toggle('dark:bg-slate-800', btn.getAttribute('data-type') !== type);
    });
    renderGrid();
}

// ------------------ Renderizar Grid ------------------
function renderGrid() {
    const grid = document.getElementById('media-grid');
    const noResults = document.getElementById('no-results');
    grid.innerHTML = '';

    const filtered = currentFilter === 'all' ? mediaData : mediaData.filter(item => item.type === currentFilter);

    if (!filtered.length) {
        noResults.classList.remove('hidden');
        return;
    } else {
        noResults.classList.add('hidden');
    }

    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = "group relative glass rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-200 dark:border-slate-800";

        card.innerHTML = `
            <div class="aspect-[4/5] overflow-hidden relative">
                <img src="${item.thumbnail}" alt="Thumbnail" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <p class="text-white text-sm font-medium line-clamp-2">${item.caption}</p>
                </div>
                <div class="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                    ${item.quality || 'HD'}
                </div>
                <div class="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1">
                    ${getTypeIcon(item.type)} ${item.type}
                </div>
            </div>
            <div class="p-5">
                <a href="${item.url}" target="_blank" class="w-full bg-slate-900 dark:bg-slate-800 hover:bg-primary-600 dark:hover:bg-primary-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                    <i data-lucide="download" class="w-4 h-4"></i>
                    <span>${currentLang === 'en' ? 'Download' : 'Descargar'}</span>
                </a>
            </div>
        `;
        grid.appendChild(card);
    });
    lucide.createIcons();
}

// ------------------ Iconos ------------------
function getTypeIcon(type) {
    switch(type) {
        case 'photo': return '<i data-lucide="image" class="w-3 h-3"></i>';
        case 'video': return '<i data-lucide="video" class="w-3 h-3"></i>';
        case 'reel': return '<i data-lucide="clapperboard" class="w-3 h-3"></i>';
        case 'story': return '<i data-lucide="circle-dashed" class="w-3 h-3"></i>';
        case 'highlight': return '<i data-lucide="star" class="w-3 h-3"></i>';
        default: return '';
    }
}
