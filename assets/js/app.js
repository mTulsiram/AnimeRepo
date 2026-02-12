/**
 * Anime Database - Main Application
 * Pure HTML5/CSS3/JavaScript - No Server Required
 */

class AnimeDatabase {
    constructor() {
        this.allAnime = [];
        this.filteredAnime = [];
        this.currentPage = 1;
        this.itemsPerPage = 50;
        this.filters = {
            search: '',
            genres: [],
            year: { min: 1970, max: 2026 },
            types: [],
            rating: 0,
            languages: []
        };
        this.init();
    }

    async init() {
        console.log('🎬 Initializing Anime Database...');
        await this.loadData();
        this.setupEventListeners();
        this.populateFilterOptions();
        this.applyFilters();
        this.render();
    }

    async loadData() {
        try {
            console.log('📥 Loading anime data...');
            
            // Try to load JSON first
            let data = await this.tryLoadJSON();
            
            // Fallback to parsing markdown
            if (!data || data.length === 0) {
                data = await this.parseMarkdownData();
            }
            
            this.allAnime = data;
            console.log(`✅ Loaded ${this.allAnime.length} anime`);
        } catch (error) {
            console.error('❌ Error loading data:', error);
            this.showError('Failed to load anime database');
        }
    }

    async tryLoadJSON() {
        try {
            const response = await fetch('data/anime_data.json');
            if (response.ok) {
                return await response.json();
            }
        } catch (e) {
            console.log('JSON not available, falling back to markdown');
        }
        return [];
    }

    async parseMarkdownData() {
        try {
            const response = await fetch('data/anime_database.md');
            const text = await response.text();
            
            const lines = text.split('\n');
            const data = [];
            
            // Skip header and separator lines
            for (let i = 5; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line || !line.startsWith('|')) continue;
                
                const parts = line.split('|').map(p => p.trim()).filter(p => p);
                if (parts.length < 6) continue;
                
                data.push({
                    title: parts[0] || 'Unknown',
                    languages: parts[1] || 'Unknown',
                    genre: parts[2] || 'Anime',
                    year: parseInt(parts[3]) || 2024,
                    type: parts[4] || 'TV',
                    rating: parseFloat(parts[5]) || 7.0
                });
            }
            
            return data;
        } catch (error) {
            console.error('Error parsing markdown:', error);
            return [];
        }
    }

    populateFilterOptions() {
        // Extract unique genres
        const genres = new Set();
        const languages = new Set();
        
        this.allAnime.forEach(anime => {
            anime.genre.split(',').forEach(g => {
                const genre = g.trim();
                if (genre && genre !== 'Anime') genres.add(genre);
            });
            
            anime.languages.split(',').forEach(l => {
                const lang = l.trim();
                if (lang && lang !== 'Unknown') languages.add(lang);
            });
        });
        
        this.populateGenreFilters(Array.from(genres).sort());
        this.populateLanguageFilters(Array.from(languages).sort());
    }

    populateGenreFilters(genres) {
        const container = document.getElementById('genreFilters');
        container.innerHTML = '';
        
        genres.forEach(genre => {
            const label = document.createElement('label');
            label.className = 'checkbox';
            label.innerHTML = `
                <input type="checkbox" value="${genre}" class="filter-checkbox" data-filter="genre">
                <span>${genre}</span>
            `;
            container.appendChild(label);
        });
    }

    populateLanguageFilters(languages) {
        const container = document.getElementById('languageFilters');
        container.innerHTML = '';
        
        languages.forEach(lang => {
            const label = document.createElement('label');
            label.className = 'checkbox';
            label.innerHTML = `
                <input type="checkbox" value="${lang}" class="filter-checkbox" data-filter="language">
                <span>${lang}</span>
            `;
            container.appendChild(label);
        });
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

        // Checkbox filters
        document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.handleCheckboxChange());
        });

        // Year range
        const yearRange = document.getElementById('yearRange');
        yearRange.addEventListener('change', (e) => {
            this.filters.year.max = parseInt(e.target.value);
            document.getElementById('yearMax').textContent = e.target.value;
            this.currentPage = 1;
            this.applyFilters();
            this.render();
        });

        // Rating filter
        const ratingFilter = document.getElementById('ratingFilter');
        ratingFilter.addEventListener('change', (e) => {
            this.filters.rating = parseFloat(e.target.value);
            this.currentPage = 1;
            this.applyFilters();
            this.render();
        });

        // Sort
        const sortBy = document.getElementById('sortBy');
        sortBy.addEventListener('change', () => this.render());

        // Clear filters
        const clearBtn = document.getElementById('clearFilters');
        clearBtn.addEventListener('click', () => this.clearAllFilters());
    }

    handleCheckboxChange() {
        this.filters.genres = [];
        this.filters.types = [];
        this.filters.languages = [];

        document.querySelectorAll('.filter-checkbox:checked').forEach(checkbox => {
            const filterType = checkbox.dataset.filter;
            const value = checkbox.value;

            if (filterType === 'genre') {
                this.filters.genres.push(value);
            } else if (filterType === 'type') {
                this.filters.types.push(value);
            } else if (filterType === 'language') {
                this.filters.languages.push(value);
            }
        });

        this.currentPage = 1;
        this.applyFilters();
        this.render();
    }

    applyFilters() {
        this.filteredAnime = this.allAnime.filter(anime => {
            // Search filter
            if (this.filters.search) {
                const searchTerm = this.filters.search;
                if (!anime.title.toLowerCase().includes(searchTerm)) {
                    return false;
                }
            }

            // Genre filter (OR logic)
            if (this.filters.genres.length > 0) {
                const hasGenre = this.filters.genres.some(genre =>
                    anime.genre.toLowerCase().includes(genre.toLowerCase())
                );
                if (!hasGenre) return false;
            }

            // Year filter
            if (anime.year > this.filters.year.max) {
                return false;
            }

            // Type filter (OR logic)
            if (this.filters.types.length > 0) {
                if (!this.filters.types.includes(anime.type)) {
                    return false;
                }
            }

            // Rating filter
            if (anime.rating < this.filters.rating) {
                return false;
            }

            // Language filter (OR logic)
            if (this.filters.languages.length > 0) {
                const hasLanguage = this.filters.languages.some(lang =>
                    anime.languages.toLowerCase().includes(lang.toLowerCase())
                );
                if (!hasLanguage) return false;
            }

            return true;
        });

        this.updateResultCount();
    }

    updateResultCount() {
        const count = this.filteredAnime.length;
        document.getElementById('resultCount').textContent = `${count.toLocaleString()} results`;
        
        // Show/hide no results message
        const noResults = document.getElementById('noResults');
        const tbody = document.getElementById('animeTableBody');
        
        if (count === 0) {
            noResults.style.display = 'block';
            tbody.innerHTML = '';
        } else {
            noResults.style.display = 'none';
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
            case 'year-asc':
                data.sort((a, b) => a.year - b.year);
                break;
            case 'rating-desc':
                data.sort((a, b) => b.rating - a.rating);
                break;
            case 'rating-asc':
                data.sort((a, b) => a.rating - b.rating);
                break;
        }

        return data;
    }

    render() {
        const sortedData = this.getSortedData();
        const pageStart = (this.currentPage - 1) * this.itemsPerPage;
        const pageEnd = pageStart + this.itemsPerPage;
        const pageData = sortedData.slice(pageStart, pageEnd);

        this.renderTable(pageData);
        this.renderPagination(sortedData.length);
    }

    renderTable(data) {
        const tbody = document.getElementById('animeTableBody');
        tbody.innerHTML = '';

        if (data.length === 0) return;

        data.forEach(anime => {
            const row = document.createElement('tr');
            const ratingClass = anime.rating >= 8 ? 'high' : '';
            
            row.innerHTML = `
                <td>${this.escapeHtml(anime.title)}</td>
                <td>${this.escapeHtml(anime.languages)}</td>
                <td>${this.escapeHtml(anime.genre)}</td>
                <td>${anime.year}</td>
                <td>${this.escapeHtml(anime.type)}</td>
                <td><span class="rating ${ratingClass}">${anime.rating}</span></td>
            `;
            
            tbody.appendChild(row);
        });
    }

    renderPagination(total) {
        const totalPages = Math.ceil(total / this.itemsPerPage);
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';

        if (totalPages <= 1) return;

        // Previous button
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
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);

        if (startPage > 1) {
            const btn = document.createElement('button');
            btn.textContent = '1';
            btn.addEventListener('click', () => {
                this.currentPage = 1;
                this.render();
                window.scrollTo(0, 0);
            });
            pagination.appendChild(btn);

            if (startPage > 2) {
                const dots = document.createElement('span');
                dots.textContent = '...';
                dots.style.padding = '8px';
                pagination.appendChild(dots);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            if (i === this.currentPage) {
                btn.classList.add('active');
            }
            btn.addEventListener('click', () => {
                this.currentPage = i;
                this.render();
                window.scrollTo(0, 0);
            });
            pagination.appendChild(btn);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const dots = document.createElement('span');
                dots.textContent = '...';
                dots.style.padding = '8px';
                pagination.appendChild(dots);
            }

            const btn = document.createElement('button');
            btn.textContent = totalPages;
            btn.addEventListener('click', () => {
                this.currentPage = totalPages;
                this.render();
                window.scrollTo(0, 0);
            });
            pagination.appendChild(btn);
        }

        // Next button
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
        // Reset search
        document.getElementById('searchInput').value = '';
        
        // Reset checkboxes
        document.querySelectorAll('.filter-checkbox').forEach(cb => cb.checked = false);
        
        // Reset year
        document.getElementById('yearRange').value = '2026';
        document.getElementById('yearMax').textContent = '2026';
        
        // Reset rating
        document.getElementById('ratingFilter').value = '0';
        
        // Reset filters object
        this.filters = {
            search: '',
            genres: [],
            year: { min: 1970, max: 2026 },
            types: [],
            rating: 0,
            languages: []
        };
        
        this.currentPage = 1;
        this.applyFilters();
        this.render();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showError(message) {
        const tbody = document.getElementById('animeTableBody');
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 40px;">❌ ${message}</td></tr>`;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    window.animeDB = new AnimeDatabase();
});

// Hide loading indicator when data is ready
window.addEventListener('load', () => {
    const loader = document.getElementById('loadingIndicator');
    if (loader && document.getElementById('animeTableBody').children.length > 0) {
        loader.style.display = 'none';
    }
});
