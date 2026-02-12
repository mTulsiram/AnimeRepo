/**
 * Anime Database V2 - Advanced Application
 * Features: Multi-source data, advanced filtering, detail pages, card/list views
 */

class AnimeDatabaseV2 {
    constructor() {
        this.allAnime = [];
        this.filteredAnime = [];
        this.currentPage = 1;
        this.itemsPerPage = 50;
        this.viewMode = 'list'; // 'list' or 'card'
        this.startTime = Date.now();
        
        this.filters = {
            search: '',
            genres: [],
            yearMin: 1970,
            yearMax: 2026,
            types: [],
            rating: 0,
            languages: []
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
        
        console.log('✅ Database ready!');
    }

    async loadData() {
        try {
            console.log('📥 Loading anime data...');
            
            // Try merged data first
            let data = await this.tryLoad('data/anime_merged.json');
            
            // Fallback to JSON
            if (!data) {
                data = await this.tryLoad('data/anime_data.json');
            }
            
            // Fallback to markdown
            if (!data) {
                data = await this.parseMarkdown('data/anime_database.md');
            }
            
            this.allAnime = data || [];
            console.log(`✅ Loaded ${this.allAnime.length} anime`);
            
        } catch (error) {
            console.error('❌ Error loading data:', error);
            this.showError('Failed to load anime database');
        }
    }

    async tryLoad(url) {
        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                if (data.data) return data.data;
                if (Array.isArray(data)) return data;
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
        container.innerHTML = '';
        
        genres.forEach(genre => {
            const chip = this.createChip(genre, 'genre');
            container.appendChild(chip);
        });
    }

    renderLanguageChips(languages) {
        const container = document.getElementById('languageFilters');
        container.innerHTML = '';
        
        languages.forEach(lang => {
            const chip = this.createChip(lang, 'language');
            container.appendChild(chip);
        });
    }

    renderTypeChips(types) {
        const container = document.getElementById('typeFilters');
        container.innerHTML = '';
        
        types.forEach(type => {
            const chip = this.createChip(type, 'type');
            container.appendChild(chip);
        });
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
        this.applyFilters();
        this.render();
    }

    getActiveChips(filterType) {
        const chips = document.querySelectorAll(`.chip[data-filter-type="${filterType}"].active`);
        return Array.from(chips).map(c => c.dataset.value);
    }

    setupEventListeners() {
        // Search
        const searchInput = document.getElementById('searchInput');
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.filters.search = e.target.value.toLowerCase();
                this.currentPage = 1;
                this.applyFilters();
                this.render();
            }, 300);
        });

        // Year range
        document.getElementById('yearRange').addEventListener('change', (e) => {
            this.filters.yearMax = parseInt(e.target.value);
            document.getElementById('yearMax').textContent = e.target.value;
            this.currentPage = 1;
            this.applyFilters();
            this.render();
        });

        // Rating
        document.getElementById('ratingFilter').addEventListener('change', (e) => {
            this.filters.rating = parseFloat(e.target.value);
            this.currentPage = 1;
            this.applyFilters();
            this.render();
        });

        // Sort
        document.getElementById('sortBy').addEventListener('change', () => this.render());

        // Items per page
        document.getElementById('itemsPerPageSelect').addEventListener('change', (e) => {
            this.itemsPerPage = parseInt(e.target.value);
            this.currentPage = 1;
            this.render();
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

        // Modal close
        document.querySelector('.modal-close').addEventListener('click', () => {
            document.getElementById('detailModal').style.display = 'none';
        });
    }

    switchView(mode) {
        this.viewMode = mode;
        
        document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`view${mode.charAt(0).toUpperCase() + mode.slice(1)}`).classList.add('active');
        
        document.getElementById('listView').classList.remove('active');
        document.getElementById('cardView').classList.remove('active');
        document.getElementById(`${mode}View`).classList.add('active');
        
        this.render();
    }

    applyFilters() {
        this.filteredAnime = this.allAnime.filter(anime => {
            // Search
            if (this.filters.search && !anime.title.toLowerCase().includes(this.filters.search)) {
                return false;
            }

            // Genres (OR logic)
            if (this.filters.genres.length > 0) {
                const hasGenre = this.filters.genres.some(g =>
                    (anime.genres || []).some(ag => ag.toLowerCase().includes(g.toLowerCase()))
                );
                if (!hasGenre) return false;
            }

            // Year
            if (anime.year > this.filters.yearMax) {
                return false;
            }

            // Type (OR logic)
            if (this.filters.types.length > 0) {
                if (!this.filters.types.includes(anime.type)) {
                    return false;
                }
            }

            // Rating
            if (anime.rating < this.filters.rating) {
                return false;
            }

            // Languages (OR logic)
            if (this.filters.languages.length > 0) {
                const hasLanguage = this.filters.languages.some(l =>
                    (anime.languages || []).some(al => al.toLowerCase().includes(l.toLowerCase()))
                );
                if (!hasLanguage) return false;
            }

            return true;
        });

        this.updateResultCount();
    }

    updateResultCount() {
        const count = this.filteredAnime.length;
        const time = ((Date.now() - this.startTime) / 1000).toFixed(2);
        
        document.getElementById('resultCount').textContent = `${count.toLocaleString()} results`;
        document.getElementById('resultTime').textContent = `(${time}s)`;
        
        const noResults = document.getElementById('noResults');
        if (count === 0) {
            noResults.style.display = 'block';
            document.getElementById('listView').style.display = 'none';
            document.getElementById('cardView').style.display = 'none';
        } else {
            noResults.style.display = 'none';
            if (this.viewMode === 'list') document.getElementById('listView').style.display = 'block';
            else document.getElementById('cardView').style.display = 'block';
        }
    }

    getSortedData() {
        const sortBy = document.getElementById('sortBy').value;
        const data = [...this.filteredAnime];

        switch (sortBy) {
            case 'title':
                data.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'year-desc':
                data.sort((a, b) => b.year - a.year);
                break;
            case 'rating-desc':
                data.sort((a, b) => b.rating - a.rating);
                break;
        }

        return data;
    }

    render() {
        if (this.viewMode === 'list') {
            this.renderList();
        } else {
            this.renderCards();
        }
    }

    renderList() {
        const sortedData = this.getSortedData();
        const pageStart = (this.currentPage - 1) * this.itemsPerPage;
        const pageEnd = pageStart + this.itemsPerPage;
        const pageData = sortedData.slice(pageStart, pageEnd);

        const tbody = document.getElementById('animeTableBody');
        tbody.innerHTML = '';

        pageData.forEach(anime => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <a href="#" class="anime-title" data-id="${anime.title}">
                        ${this.escapeHtml(anime.title)}
                    </a>
                </td>
                <td>
                    <div class="genre-tags">
                        ${(anime.genres || []).slice(0, 3).map(g => 
                            `<span class="genre-tag">${this.escapeHtml(g)}</span>`
                        ).join('')}
                    </div>
                </td>
                <td>${(anime.languages || ['Unknown']).join(', ')}</td>
                <td>${anime.year}</td>
                <td>${anime.type}</td>
                <td><span class="rating-badge">${anime.rating}</span></td>
                <td>
                    <button class="btn-view" data-title="${this.escapeHtml(anime.title)}">
                        View
                    </button>
                </td>
            `;
            
            row.querySelector('.btn-view').addEventListener('click', () => {
                this.showDetail(anime);
            });
            
            tbody.appendChild(row);
        });

        this.renderPagination(sortedData.length);
        this.showLoading(false);
    }

    renderCards() {
        const sortedData = this.getSortedData();
        const pageStart = (this.currentPage - 1) * this.itemsPerPage;
        const pageEnd = pageStart + this.itemsPerPage;
        const pageData = sortedData.slice(pageStart, pageEnd);

        const container = document.getElementById('cardsContainer');
        container.innerHTML = '';

        pageData.forEach(anime => {
            const card = document.createElement('div');
            card.className = 'anime-card';
            
            const imageUrl = anime.image || '';
            const imageHtml = imageUrl ? 
                `<img src="${imageUrl}" alt="${this.escapeHtml(anime.title)}">` :
                `📺`;
            
            card.innerHTML = `
                <div class="anime-card-image">
                    ${imageHtml}
                </div>
                <div class="anime-card-body">
                    <div class="anime-card-title">${this.escapeHtml(anime.title)}</div>
                    <div class="anime-card-meta">
                        <span>${anime.year}</span>
                        <span class="anime-card-rating">${anime.rating}⭐</span>
                    </div>
                    <div class="anime-card-genres">
                        ${(anime.genres || []).slice(0, 2).map(g =>
                            `<span class="anime-card-genre">${this.escapeHtml(g)}</span>`
                        ).join('')}
                    </div>
                </div>
            `;
            
            card.addEventListener('click', () => this.showDetail(anime));
            container.appendChild(card);
        });

        this.renderPagination(sortedData.length);
        this.showLoading(false);
    }

    showDetail(anime) {
        const modal = document.getElementById('detailModal');
        const content = document.getElementById('detailContent');
        
        const imageUrl = anime.image || '';
        const imageHtml = imageUrl ?
            `<img src="${imageUrl}" alt="${this.escapeHtml(anime.title)}">` :
            `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:60px;">📺</div>`;
        
        content.innerHTML = `
            <div class="anime-detail">
                <div class="anime-detail-image">
                    ${imageHtml}
                </div>
                <div class="anime-detail-body">
                    <h1 class="detail-title">${this.escapeHtml(anime.title)}</h1>
                    
                    <div class="detail-meta">
                        <div class="detail-meta-item">
                            <div class="detail-meta-label">Year</div>
                            <div class="detail-meta-value">${anime.year}</div>
                        </div>
                        <div class="detail-meta-item">
                            <div class="detail-meta-label">Type</div>
                            <div class="detail-meta-value">${anime.type}</div>
                        </div>
                        <div class="detail-meta-item">
                            <div class="detail-meta-label">Rating</div>
                            <div class="detail-meta-value">${anime.rating} / 10</div>
                        </div>
                        <div class="detail-meta-item">
                            <div class="detail-meta-label">Languages</div>
                            <div class="detail-meta-value">${(anime.languages || ['Unknown']).join(', ')}</div>
                        </div>
                    </div>
                    
                    <div>
                        <div class="detail-meta-label">Genres</div>
                        <div class="detail-genres">
                            ${(anime.genres || []).map(g =>
                                `<span class="detail-genre">${this.escapeHtml(g)}</span>`
                            ).join('')}
                        </div>
                    </div>
                    
                    ${anime.synopsis ? `
                        <div>
                            <div class="detail-meta-label">Synopsis</div>
                            <div class="detail-synopsis">${this.escapeHtml(anime.synopsis)}</div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        modal.style.display = 'flex';
    }

    renderPagination(total) {
        const totalPages = Math.ceil(total / this.itemsPerPage);
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';

        if (totalPages <= 1) return;

        // Previous
        const prevBtn = document.createElement('button');
        prevBtn.textContent = '← Previous';
        prevBtn.disabled = this.currentPage === 1;
        prevBtn.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.render();
                window.scrollTo(0, 0);
            }
        });
        pagination.appendChild(prevBtn);

        // Page numbers
        const start = Math.max(1, this.currentPage - 2);
        const end = Math.min(totalPages, this.currentPage + 2);

        for (let i = start; i <= end; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            if (i === this.currentPage) btn.classList.add('active');
            btn.addEventListener('click', () => {
                this.currentPage = i;
                this.render();
                window.scrollTo(0, 0);
            });
            pagination.appendChild(btn);
        }

        // Next
        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Next →';
        nextBtn.disabled = this.currentPage === totalPages;
        nextBtn.addEventListener('click', () => {
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.render();
                window.scrollTo(0, 0);
            }
        });
        pagination.appendChild(nextBtn);
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
        this.applyFilters();
        this.render();
    }

    showLoading(show) {
        document.getElementById('loadingIndicator').style.display = show ? 'block' : 'none';
    }

    showError(message) {
        console.error(message);
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

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('detailModal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});
