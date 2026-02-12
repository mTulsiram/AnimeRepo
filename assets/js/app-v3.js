/**
 * Anime Database V3 - Complete Rewrite
 * Features: Individual anime pages, improved UI, better data loading
 */

class AnimeDatabase {
    constructor() {
        this.allAnime = [];
        this.filteredAnime = [];
        this.currentPage = 1;
        this.itemsPerPage = 50;
        this.viewMode = 'grid';
        
        this.filters = {
            search: '',
            genres: new Set(),
            yearMax: 2026,
            types: new Set()
        };
        
        this.init();
    }

    async init() {
        console.log('🎬 Initializing Anime Database V3...');
        
        await this.loadData();
        this.setupEventListeners();
        this.populateFilters();
        this.render();
        
        console.log('✅ Database ready!');
    }

    async loadData() {
        try {
            console.log('📥 Loading anime data...');
            
            // Try to load from anime-offline-database-minified.json
            let data = await this.fetchJSON('anime-offline-database-minified.json');
            
            if (data && data.data) {
                this.allAnime = data.data;
            } else {
                console.warn('Could not load main database, using fallback...');
                this.allAnime = [];
            }
            
            console.log(`✅ Loaded ${this.allAnime.length} anime`);
        } catch (error) {
            console.error('❌ Error loading data:', error);
            this.allAnime = [];
        }
    }

    async fetchJSON(url) {
        try {
            const response = await fetch(url);
            if (response.ok) {
                return await response.json();
            }
        } catch (e) {
            console.log(`Could not load ${url}`);
        }
        return null;
    }

    populateFilters() {
        const genres = new Set();
        const types = new Set();
        
        this.allAnime.forEach(anime => {
            (anime.tags || []).slice(0, 1).forEach(tag => genres.add(tag));
            if (anime.type) types.add(anime.type);
        });
        
        this.renderGenreChips(Array.from(genres).sort().slice(0, 20));
        this.renderTypeChips(Array.from(types).sort());
    }

    renderGenreChips(genres) {
        const container = document.getElementById('genreFilters');
        container.innerHTML = '';
        genres.forEach(genre => {
            const chip = document.createElement('button');
            chip.className = 'chip';
            chip.textContent = genre;
            chip.onclick = () => this.toggleFilter('genres', genre, chip);
            container.appendChild(chip);
        });
    }

    renderTypeChips(types) {
        const container = document.getElementById('typeFilters');
        container.innerHTML = '';
        types.forEach(type => {
            const chip = document.createElement('button');
            chip.className = 'chip';
            chip.textContent = type;
            chip.onclick = () => this.toggleFilter('types', type, chip);
            container.appendChild(chip);
        });
    }

    toggleFilter(filterType, value, element) {
        if (this.filters[filterType].has(value)) {
            this.filters[filterType].delete(value);
            element.classList.remove('active');
        } else {
            this.filters[filterType].add(value);
            element.classList.add('active');
        }
        this.currentPage = 1;
        this.applyFilters();
        this.render();
    }

    setupEventListeners() {
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.filters.search = e.target.value.toLowerCase();
            this.currentPage = 1;
            this.applyFilters();
            this.render();
        });

        document.getElementById('yearRange').addEventListener('change', (e) => {
            this.filters.yearMax = parseInt(e.target.value);
            document.getElementById('yearMax').textContent = e.target.value;
            this.currentPage = 1;
            this.applyFilters();
            this.render();
        });

        document.getElementById('itemsPerPage').addEventListener('change', (e) => {
            this.itemsPerPage = parseInt(e.target.value);
            this.currentPage = 1;
            this.render();
        });
    }

    applyFilters() {
        this.filteredAnime = this.allAnime.filter(anime => {
            // Search
            if (this.filters.search && !anime.title.toLowerCase().includes(this.filters.search)) {
                return false;
            }

            // Year
            if (anime.animeSeason?.year && anime.animeSeason.year > this.filters.yearMax) {
                return false;
            }

            // Type
            if (this.filters.types.size > 0 && !this.filters.types.has(anime.type)) {
                return false;
            }

            // Genres
            if (this.filters.genres.size > 0) {
                const hasGenre = Array.from(this.filters.genres).some(g =>
                    (anime.tags || []).some(t => t.toLowerCase().includes(g.toLowerCase()))
                );
                if (!hasGenre) return false;
            }

            return true;
        });

        document.getElementById('resultCount').textContent = this.filteredAnime.length.toLocaleString();
    }

    render() {
        if (this.filteredAnime.length === 0) {
            document.getElementById('noResults').style.display = 'block';
            document.getElementById('gridView').style.display = 'none';
            document.getElementById('listView').style.display = 'none';
            document.getElementById('pagination').innerHTML = '';
            return;
        }

        document.getElementById('noResults').style.display = 'none';

        if (this.viewMode === 'grid') {
            this.renderGrid();
        } else {
            this.renderList();
        }

        this.renderPagination();
    }

    renderGrid() {
        document.getElementById('gridView').style.display = 'grid';
        document.getElementById('listView').style.display = 'none';

        const pageStart = (this.currentPage - 1) * this.itemsPerPage;
        const pageEnd = pageStart + this.itemsPerPage;
        const pageData = this.filteredAnime.slice(pageStart, pageEnd);

        const grid = document.getElementById('gridView');
        grid.innerHTML = '';

        pageData.forEach(anime => {
            const card = document.createElement('a');
            card.href = `anime/${this.sanitizeFilename(anime.title)}.html`;
            card.className = 'anime-card';
            card.target = '_blank';
            card.innerHTML = `
                <div class="anime-poster">
                    ${anime.picture ? `<img src="${anime.picture}" alt="${this.escapeHtml(anime.title)}" onerror="this.style.display='none'">` : '📺'}
                </div>
                <div class="anime-body">
                    <div class="anime-type">${anime.type}</div>
                    <div class="anime-title">${this.escapeHtml(anime.title)}</div>
                    <div class="anime-meta">
                        <span class="anime-year">${anime.animeSeason?.year || 'N/A'}</span>
                        <span class="anime-rating">⭐ ${(anime.score?.arithmeticMean || 0).toFixed(1)}</span>
                    </div>
                    <button class="anime-view-btn">View Details →</button>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    renderList() {
        document.getElementById('gridView').style.display = 'none';
        document.getElementById('listView').style.display = 'block';

        const pageStart = (this.currentPage - 1) * this.itemsPerPage;
        const pageEnd = pageStart + this.itemsPerPage;
        const pageData = this.filteredAnime.slice(pageStart, pageEnd);

        const list = document.getElementById('listView');
        list.innerHTML = '';

        pageData.forEach(anime => {
            const item = document.createElement('a');
            item.href = `anime/${this.sanitizeFilename(anime.title)}.html`;
            item.target = '_blank';
            item.className = 'anime-list-item';
            item.innerHTML = `
                <div class="anime-list-poster">
                    ${anime.picture ? `<img src="${anime.picture}" alt="${this.escapeHtml(anime.title)}" onerror="this.style.display='none'">` : '📺'}
                </div>
                <div class="anime-list-info">
                    <h3>${this.escapeHtml(anime.title)}</h3>
                    <div class="anime-list-meta">
                        <span>📅 ${anime.animeSeason?.year || 'N/A'}</span>
                        <span>📺 ${anime.type}</span>
                        <span>⭐ ${(anime.score?.arithmeticMean || 0).toFixed(1)}/10</span>
                    </div>
                </div>
                <button class="anime-view-btn">View →</button>
            `;
            list.appendChild(item);
        });
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredAnime.length / this.itemsPerPage);
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';

        if (totalPages <= 1) return;

        // Previous
        const prevBtn = document.createElement('button');
        prevBtn.textContent = '← Prev';
        prevBtn.disabled = this.currentPage === 1;
        prevBtn.onclick = () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.render();
                window.scrollTo(0, 0);
            }
        };
        pagination.appendChild(prevBtn);

        // Page numbers
        const start = Math.max(1, this.currentPage - 2);
        const end = Math.min(totalPages, this.currentPage + 2);

        for (let i = start; i <= end; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            if (i === this.currentPage) btn.classList.add('active');
            btn.onclick = () => {
                this.currentPage = i;
                this.render();
                window.scrollTo(0, 0);
            };
            pagination.appendChild(btn);
        }

        // Next
        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Next →';
        nextBtn.disabled = this.currentPage === totalPages;
        nextBtn.onclick = () => {
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.render();
                window.scrollTo(0, 0);
            }
        };
        pagination.appendChild(nextBtn);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    sanitizeFilename(filename) {
        return encodeURIComponent(filename.substring(0, 100));
    }
}

// Global functions for onclick handlers
function applyFilters() {
    window.db?.applyFilters();
    window.db?.render();
}

function clearAllFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('yearRange').value = '2026';
    document.getElementById('yearMax').textContent = '2026';
    
    document.querySelectorAll('.chip.active').forEach(chip => {
        chip.classList.remove('active');
    });
    
    window.db.filters = {
        search: '',
        genres: new Set(),
        yearMax: 2026,
        types: new Set()
    };
    
    window.db.currentPage = 1;
    window.db.applyFilters();
    window.db.render();
}

function switchView(mode) {
    window.db.viewMode = mode;
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    window.db.render();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.db = new AnimeDatabase();
});
