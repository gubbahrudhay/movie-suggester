
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const WATCHMODE_API_KEY = import.meta.env.VITE_WATCHMODE_API_KEY;
const WATCHMODE_BASE_URL = 'https://api.watchmode.com/v1';

const moviesContainer = document.getElementById('movies-container');
const loadingState = document.getElementById('loading');
const errorState = document.getElementById('error');
const retryBtn = document.getElementById('retry-btn');
const searchInput = document.getElementById('search-input');
const filterSelect = document.getElementById('filter-select');
const sortSelect = document.getElementById('sort-select');

const modal = document.getElementById('movie-modal');
const closeModalBtn = document.getElementById('close-modal');
const modalBody = document.getElementById('modal-body');

let allMovies = [];
let fetchTimeout;

async function initApp() {
    retryBtn.addEventListener('click', loadMovies);
    searchInput.addEventListener('input', handleSearchInput);
    filterSelect.addEventListener('change', applyFilters);
    sortSelect.addEventListener('change', applyFilters);
    moviesContainer.addEventListener('click', handleMovieClick);
    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    await loadMovies();
}

function handleSearchInput() {
    clearTimeout(fetchTimeout);
    fetchTimeout = setTimeout(async () => {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            await fetchMoviesFromUrl(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(searchTerm)}`);
        } else {
            await loadMovies();
        }
    }, 500);
}

async function loadMovies() {
    await fetchMoviesFromUrl(`${TMDB_BASE_URL}/trending/movie/day?api_key=${TMDB_API_KEY}`);
}

async function fetchMoviesFromUrl(url) {
    showLoading();
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        allMovies = data.results || [];
        applyFilters();
    } catch (error) {
        showError();
    }
}

function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const filterValue = filterSelect.value;
    const sortValue = sortSelect.value;
    
    let processedMovies = allMovies.filter(movie => 
        (movie.title || '').toLowerCase().includes(searchTerm)
    );
    
    processedMovies = processedMovies.filter(movie => {
        if (filterValue === 'high') return movie.vote_average > 7.0;
        if (filterValue === 'medium') return movie.vote_average > 5.0;
        return true;
    });
    
    processedMovies = processedMovies.sort((a, b) => {
        if (sortValue === 'rating-desc') return (b.vote_average || 0) - (a.vote_average || 0);
        if (sortValue === 'rating-asc') return (a.vote_average || 0) - (b.vote_average || 0);
        return 0;
    });
    
    renderMovies(processedMovies);
}

function handleMovieClick(event) {
    const actionBtn = event.target.closest('.action-btn');
    const card = event.target.closest('.movie-card');
    
    if (actionBtn) {
        handleActionClick(actionBtn);
        return;
    }
    
    if (card) {
        const movieId = parseInt(card.dataset.id);
        const movie = allMovies.find(m => m.id === movieId);
        if (movie) openModal(movie);
    }
}

function handleActionClick(target) {
    const action = target.dataset.action;
    const movieId = parseInt(target.closest('.movie-card').dataset.id);
    const movie = allMovies.find(m => m.id === movieId);
    
    if (action === 'like') {
        target.classList.toggle('active');
        target.textContent = target.classList.contains('active') ? 'Liked' : 'Like';
    } else if (action === 'favorite') {
        target.classList.toggle('active');
        target.textContent = target.classList.contains('active') ? 'Favorited' : 'Favorite';
    } else if (action === 'view-more') {
        if (movie) openModal(movie);
    }
}

function renderMovies(movies) {
    if (movies.length === 0) {
        moviesContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #94a3b8; padding: 4rem 2rem;"><p style="font-size: 1.2rem;">No movies found.</p></div>';
        hideLoading();
        return;
    }

    moviesContainer.innerHTML = movies.map(movie => {
        const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null;
        const posterHTML = posterUrl
            ? `<div class="movie-poster-container"><img src="${posterUrl}" alt="${movie.title}" class="movie-poster" loading="lazy"></div>`
            : `<div class="movie-poster-container"><div class="no-poster">No Image</div></div>`;
        
        const ratingHTML = movie.vote_average ? movie.vote_average.toFixed(1) : 'NR';
        const yearHTML = movie.release_date ? movie.release_date.substring(0, 4) : 'N/A';

        return `
            <div class="movie-card" data-id="${movie.id}" style="cursor: pointer;">
                ${posterHTML}
                <div class="movie-info">
                    <h3 class="movie-title" title="${movie.title}">${movie.title}</h3>
                    <div class="movie-meta">
                        <span class="rating">Rating: ${ratingHTML}</span>
                        <span class="year">${yearHTML}</span>
                    </div>
                    <div class="movie-actions">
                        <button class="action-btn" data-action="like">Like</button>
                        <button class="action-btn" data-action="favorite">Favorite</button>
                        <button class="action-btn" data-action="view-more">View More</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    hideLoading();
}

function openModal(movie) {
    const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '';
    const imgHtml = posterUrl ? `<img src="${posterUrl}" style="max-width: 100%; border-radius: 12px; display: block;" alt="Poster">` : '';
    
    modalBody.innerHTML = `
        <div style="flex-shrink: 0; width: 300px; max-width: 100%;">
            ${imgHtml}
        </div>
        <div style="flex-grow: 1;">
            <div class="synopsis-title">${movie.title || 'No Title'}</div>
            <div style="color: #94a3b8; margin-bottom: 1rem; display: flex; gap: 1rem;">
                <span style="color: #fbbf24;">Rating: ${movie.vote_average ? movie.vote_average.toFixed(1) : 'NR'}</span>
                <span>Year: ${movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}</span>
            </div>
            <div class="synopsis-text">${movie.overview || 'No synopsis available.'}</div>
            
            <div id="streaming-sources-container" style="margin-top: 2rem;">
                <h3 style="color: white; margin-bottom: 1rem; font-size: 1.25rem;">Where to Watch</h3>
                <div id="streaming-sources-content" style="color: #94a3b8;">
                    Loading availability...
                </div>
            </div>
        </div>
    `;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    fetchStreamingSources(movie.id);
}

async function fetchStreamingSources(tmdbId) {
    const contentDiv = document.getElementById('streaming-sources-content');
    if (!contentDiv) return;

    try {
        const watchmodeSearchUrl = `${WATCHMODE_BASE_URL}/search/?apiKey=${WATCHMODE_API_KEY}&search_field=tmdb_movie_id&search_value=${tmdbId}`;
        const searchRes = await fetch(watchmodeSearchUrl);
        if (!searchRes.ok) throw new Error('Search failed');
        const searchData = await searchRes.json();
        
        let watchmodeId;
        if (searchData.title_results && searchData.title_results.length > 0) {
            watchmodeId = searchData.title_results[0].id;
        } else {
            contentDiv.innerHTML = 'Not available for streaming.';
            return;
        }

        const sourcesUrl = `${WATCHMODE_BASE_URL}/title/${watchmodeId}/sources/?apiKey=${WATCHMODE_API_KEY}`;
        const sourcesRes = await fetch(sourcesUrl);
        if (!sourcesRes.ok) throw new Error('Sources failed');
        const sourcesData = await sourcesRes.json();

        if (sourcesData && sourcesData.length > 0) {
            const uniqueSources = [];
            const seen = new Set();
            sourcesData.forEach(src => {
                const uniqueKey = src.name + '-' + src.type;
                if (!seen.has(uniqueKey)) {
                    seen.add(uniqueKey);
                    uniqueSources.push(src);
                }
            });

            const badges = uniqueSources.map(src => {
                let badgeColor = "black";
                return `<a href="${src.web_url}" target="_blank" rel="noopener noreferrer" style="
                    display: inline-block;
                    background-color: ${badgeColor};
                    color: white;
                    padding: 0.35rem 0.85rem;
                    border-radius: 999px;
                    font-size: 0.875rem;
                    text-decoration: none;
                    margin-right: 0.5rem;
                    margin-bottom: 0.5rem;
                    transition: opacity 0.2s;
                ">${src.name} (${src.type === 'sub' ? 'Stream' : src.type})</a>`;
            }).join('');

            contentDiv.innerHTML = badges;
        } else {
            contentDiv.innerHTML = 'No streaming sources found.';
        }
    } catch (err) {
        contentDiv.innerHTML = 'Failed to load streaming sources.';
        console.error(err);
    }
}


function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
}

function showLoading() {
    loadingState.classList.remove('hidden');
    errorState.classList.add('hidden');
    moviesContainer.innerHTML = '';
}

function hideLoading() {
    loadingState.classList.add('hidden');
}

function showError() {
    loadingState.classList.add('hidden');
    errorState.classList.remove('hidden');
}

initApp();
