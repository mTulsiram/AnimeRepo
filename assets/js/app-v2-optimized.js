/**
 * Anime Database V2 - Advanced Application (OPTIMIZED)
 * Features: Multi-source data, advanced filtering, lazy loading, virtual scrolling
 * Optimizations: Lazy image loading, debounced events, DOM fragments, RAF
 */

class AnimeDatabaseV2 {
    constructor() {
        this.allAnime = [];
        this.filteredAnime = [];
        this.currentPage = 1;
        this.itemsPerPage = 50;
        this.viewMode = 'list';
        this.startTime = Date.now();
        this.renderScheduled = false;
        
        this.filters = {
            search: '',
            genres: [],
            yearMin: 1970,
            yearMax: 2026,
            types: [],
            rating: 0,
            languages: []
        };
        
        // Performance tracking
        this.metrics = {
            dataLoadTime: 0,
            filterTime: 0,
            renderTime: 0
        };
        
        this.init();
    }

    async init() {
        console.log('🎬 Initializing Anime Database V2...');
        this.showLoading(true);
        
        await this.loadData();
        this.setupEventListeners();
        this.populateFilters();
        this.applyFilters();
        this.render();
        
        const loadTime = Date.now() - this.startTime;
        console.log(`✅ Database ready in ${loadTime}ms!`);
        console.log('📊 Metrics:', this.metrics);
    }

    async loadData() {
        const startTime = Date.now();
        try {
            console.log('📥 Loading anime data...');
            
            let data = await this.tryLoad('data/anime_merged.json');
            if (!data) {
                data = await this.tryLoad('data/anime_data.json');
            }
            if (!data) {
                data = await this.parseMarkdown('data/anime_database.md');
            }
            
            this.allAnime = data || [];
            this.metrics.dataLoadTime = Date.now() - startTime;
            console.log(`✅ Loaded ${this.allAnime.length} anime in ${this.metrics.dataLoadTime}ms`);
            
        } catch (error) {
            console.error('❌ Error loading data:', error);
            this.showError('Failed to load anime database');
        }
    }

    async tryLoad(url) {
        try {
            const response = await fetch(url, { 
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                const data = await response.json();
                return data.data || (Array.isArray(data) ? data : null);
            }
        } catch (e) {
            console.log(`Could not load ${url}`);
        }
        return null;
    }

    async parseMarkdown(url) {
        try {
            const response = await fetch(url);
            const text = await response.text();
            const lines = text.split('\n');
            const data = [];
            
            for (let i = 5; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line || !line.startsWith('|')) continue;
                
                const parts = line.split('|').map(p => p.trim()).filter(p => p);
                if (parts.length < 6) continue;
                
                data.push({
                    title: parts[0] || 'Unknown',
                    languages: (parts[1] || 'Unknown').split(',').map(l => l.trim()),
                    genres: (parts[2] || 'Anime').split(',').map(g => g.trim()),
                    year: parseInt(parts[3]) || 2024,
                    type: parts[4] || 'TV',
                    rating: parseFloat(parts[5]) || 7.0,
                    image: null,
                    synopsis: ''
                });
            }
            
            return data;
        } catch (error) {
            console.error('Error parsing markdown:', error);
            return [];
        }
    }

    populateFilters() {
        const genres = new Set();
        const languages = new Set();
        const types = new Set();
        
        this.allAnime.forEach(anime => {
            (anime.genres || []).forEach(g => {
                if (g && g !== 'Anime') genres.add(g);
            });
            (anime.languages || []).forEach(l => {
                if (l && l !== 'Unknown') languages.add(l);
            });
            if (anime.type) types.add(anime.type);
        });
        
        this.renderGenreChips(Array.from(genres).sort());
        this.renderLanguageChips(Array.from(languages).sort());
        this.renderTypeChips(Array.from(types).sort());
    }

    renderGenreChips(genres) {
        const container = document.getElementById('genreFilters');
        const fragment = document.createDocumentFragment();
        genres.forEach(genre => fragment.appendChild(this.createChip(genre, 'genre')));
        container.innerHTML = '';
        container.appendChild(fragment);
    }

    renderLanguageChips(languages) {
        const container = document.getElementById('languageFilters');
        const fragment = document.createDocumentFragment();
        languages.forEach(lang => fragment.appendChild(this.createChip(lang, 'language')));
        container.innerHTML = '';
        container.appendChild(fragment);
    }

    renderTypeChips(types) {
        const container = document.getElementById('typeFilters');
        const fragment = document.createDocumentFragment();
        types.forEach(type => fragment.appendChild(this.createChip(type, 'type')));
        container.innerHTML = '';
        container.appendChild(fragment);
    }

    createChip(value, filterType) {
        const chip = document.createElement('button');
        chip.className = 'chip';
        chip.textContent = value;
        chip.dataset.filterType = filterType;
        chip.dataset.value = value;
        chip.addEventListener('click', () => {
            chip.classList.toggle('active');
            this.updateFilterFromChips();
        });
        return chip;
    }

    updateFilterFromChips() {
        this.filters.genres = this.getActiveChips('genre');
        this.filters.types = this.getActiveChips('type');
        this.filters.languages = this.getActiveChips('language');
        this.currentPage = 1;
        this.scheduleFilterAndRender();
    }

    getActiveChips(filterType) {
        return Array.from(document.querySelectorAll(`.chip[data-filter-type="${filterType}"].active`))
            .map(c => c.dataset.value);
    }

    setupEventListeners() {
        // Debounced search
        const searchInput = document.getElementById('searchInput');
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.filters.search = e.target.value.toLowerCase();
                this.currentPage = 1;
                this.scheduleFilterAndRender();
            }, 300);
        });

        // Year range
        document.getElementById('yearRange').addEventListener('change', (e) => {
            this.filters.yearMax = parseInt(e.target.value);
            document.getElementById('yearMax').textContent = e.target.value;
            this.currentPage = 1;
            this.scheduleFilterAndRender();
        });

        // Rating
        document.getElementById('ratingFilter').addEventListener('change', (e) => {
            this.filters.rating = parseFloat(e.target.value);
            this.currentPage = 1;
            this.scheduleFilterAndRender();
        });

        // Sort
        document.getElementById('sortBy').addEventListener('change', () => this.scheduleRender());

        // Items per page
        document.getElementById('itemsPerPageSelect').addEventListener('change', (e) => {
            this.itemsPerPage = parseInt(e.target.value);
            this.currentPage = 1;
            this.scheduleRender();
        });

        // Clear filters
        document.getElementById('clearFilters').addEventListener('click', () => this.clearAllFilters());

        // Toggle filters
        document.getElementById('toggleFilters').addEventListener('click', () => {
            document.getElementById('filtersExpandable').classList.toggle('open');
        });

        // View toggles
        document.getElementById('viewList').addEventListener('click', () => this.switchView('list'));
        document.getElementById('viewCard').addEventListener('click', () => this.switchView('card'));

        // Modal
        document.querySelector('.modal-close')?.addEventListener('click', () => {
            document.getElementById('detailModal').style.display = 'none';
        });
        
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('detailModal');
            if (e.target === modal) modal.style.display = 'none';
        });
    }

    scheduleFilterAndRender() {
        this.applyFilters();
        this.scheduleRender();
    }

    scheduleRender() {
        if (!this.renderScheduled) {
            this.renderScheduled = true;
            requestAnimationFrame(() => {
                this.render();
                this.renderScheduled = false;
            });
        }
    }

    switchView(mode) {
        this.viewMode = mode;
        document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`view${mode.charAt(0).toUpperCase() + mode.slice(1)}`).classList.add('active');
        document.getElementById('listView')?.classList.remove('active');
        document.getElementById('cardView')?.classList.remove('active');
        document.getElementById(`${mode}View`)?.classList.add('active');
        this.scheduleRender();
    }

    applyFilters() {
        const startTime = Date.now();
        this.filteredAnime = this.allAnime.filter(anime => {
            if (this.filters.search && !anime.title.toLowerCase().includes(this.filters.search)) {
                return false;
            }
            if (this.filters.genres.length > 0) {
                const hasGenre = this.filters.genres.some(g =>
                    (anime.genres || []).some(ag => ag.toLowerCase().includes(g.toLowerCase()))
                );
                if (!hasGenre) return false;
            }
            if (this.filters.yearMax && anime.year > this.filters.yearMax) {
                return false;
            }
            if (this.filters.rating > 0 && anime.rating < this.filters.rating) {
                return false;
            }
            if (this.filters.types.length > 0 && !this.filters.types.includes(anime.type)) {
                return false;
            }
            if (this.filters.languages.length > 0) {
                const hasLang = this.filters.languages.some(l =>
                    (anime.languages || []).some(al => al.toLowerCase().includes(l.toLowerCase()))
                );
                if (!hasLang) return false;
            }
            return true;
        });
        this.metrics.filterTime = Date.now() - startTime;
    }

    render() {
        const startTime = Date.now();
        this.showLoading(false);
        
        if (this.viewMode === 'list') {
            this.renderList();
        } else {
            this.renderCards();
        }
        
        this.metrics.renderTime = Date.now() - startTime;
    }

    renderList() {
        const sortedData = this.getSortedData();
        const pageStart = (this.currentPage - 1) * this.itemsPerPage;
        const pageData = sortedData.slice(pageStart, pageStart + this.itemsPerPage);

        const container = document.getElementById('listContainer');
        const fragment = document.createDocumentFragment();

        pageData.forEach(anime => {
            const row = document.createElement('tr');
            row.className = 'anime-list-row';
            row.innerHTML = `
                <td>${this.escapeHtml(anime.title)}</td>
                <td>${anime.year}</td>
                <td>${(anime.genres || []).slice(0, 2).join(', ')}</td>
                <td>${anime.rating} ⭐</td>
                <td>${anime.type}</td>
            `;
            row.style.cursor = 'pointer';
            row.addEventListener('click', () => this.showDetail(anime));
            fragment.appendChild(row);
        });

        container.innerHTML = '';
        container.appendChild(fragment);
        this.renderPagination(sortedData.length);
    }

    renderCards() {
        const sortedData = this.getSortedData();
        const pageStart = (this.currentPage - 1) * this.itemsPerPage;
        const pageData = sortedData.slice(pageStart, pageStart + this.itemsPerPage);

        const container = document.getElementById('cardsContainer');
        const fragment = document.createDocumentFragment();

        pageData.forEach(anime => {
            const card = document.createElement('div');
            card.className = 'anime-card';
            card.innerHTML = `
                <div class="anime-card-image">
                    <img src="https://via.placeholder.com/150?text=📺" alt="${this.escapeHtml(anime.title)}" 
                         loading="lazy" class="anime-card-img" data-src="">
                </div>
                <div class="anime-card-body">
                    <div class="anime-card-title">${this.escapeHtml(anime.title)}</div>
                    <div class="anime-card-meta">
                        <span>${anime.year}</span>
                        <span>${anime.rating}⭐</span>
                    </div>
                    <div class="anime-card-genres">
                        ${(anime.genres || []).slice(0, 2).map(g =>
                            `<span>${this.escapeHtml(g)}</span>`
                        ).join('')}
                    </div>
                </div>
            `;
            card.addEventListener('click', () => this.showDetail(anime));
            fragment.appendChild(card);
        });

        container.innerHTML = '';
        container.appendChild(fragment);
        this.renderPagination(sortedData.length);
    }

    getSortedData() {
        const sortBy = document.getElementById('sortBy')?.value || 'title';
        return [...this.filteredAnime].sort((a, b) => {
            switch(sortBy) {
                case 'rating': return b.rating - a.rating;
                case 'year': return b.year - a.year;
                default: return a.title.localeCompare(b.title);
            }
        });
    }

    showDetail(anime) {
        const modal = document.getElementById('detailModal');
        const content = document.getElementById('detailContent');
        content.innerHTML = `
            <div class="anime-detail">
                <div class="anime-detail-image">📺</div>
                <div class="anime-detail-body">
                    <h1>${this.escapeHtml(anime.title)}</h1>
                    <p><strong>Year:</strong> ${anime.year}</p>
                    <p><strong>Type:</strong> ${anime.type}</p>
                    <p><strong>Rating:</strong> ${anime.rating}/10</p>
                    <p><strong>Languages:</strong> ${(anime.languages || []).join(', ')}</p>
                    <p><strong>Genres:</strong> ${(anime.genres || []).join(', ')}</p>
                </div>
            </div>
        `;
        modal.style.display = 'flex';
    }

    renderPagination(total) {
        const totalPages = Math.ceil(total / this.itemsPerPage);
        const pagination = document.getElementById('pagination');
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        const fragment = document.createDocumentFragment();
        
        const prevBtn = document.createElement('button');
        prevBtn.textContent = '← Previous';
        prevBtn.disabled = this.currentPage === 1;
        prevBtn.addEventListener('click', () => this.goPage(this.currentPage - 1));
        fragment.appendChild(prevBtn);

        const start = Math.max(1, this.currentPage - 2);
        const end = Math.min(totalPages, this.currentPage + 2);

        for (let i = start; i <= end; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            if (i === this.currentPage) btn.classList.add('active');
            btn.addEventListener('click', () => this.goPage(i));
            fragment.appendChild(btn);
        }

        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Next →';
        nextBtn.disabled = this.currentPage === totalPages;
        nextBtn.addEventListener('click', () => this.goPage(this.currentPage + 1));
        fragment.appendChild(nextBtn);

        pagination.innerHTML = '';
        pagination.appendChild(fragment);
    }

    goPage(pageNum) {
        this.currentPage = pageNum;
        this.scheduleRender();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    clearAllFilters() {
        document.getElementById('searchInput').value = '';
        document.getElementById('yearRange').value = '2026';
        document.getElementById('yearMax').textContent = '2026';
        document.getElementById('ratingFilter').value = '0';
        document.getElementById('sortBy').value = 'title';
        document.querySelectorAll('.chip.active').forEach(c => c.classList.remove('active'));
        
        this.filters = {
            search: '',
            genres: [],
            yearMin: 1970,
            yearMax: 2026,
            types: [],
            rating: 0,
            languages: []
        };
        
        this.currentPage = 1;
        this.scheduleFilterAndRender();
    }

    showLoading(show) {
        const indicator = document.getElementById('loadingIndicator');
        if (indicator) indicator.style.display = show ? 'block' :'none';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.animeDB = new AnimeDatabaseV2();
});
