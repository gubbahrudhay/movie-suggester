
const TMDB_API_KEY = 'a5d4b434f63ca7bffac67c55c61bc9ce';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const moviesContainer = document.getElementById('movies-container');
const loadingState = document.getElementById('loading');
const errorState = document.getElementById('error');
const retryBtn = document.getElementById('retry-btn');

let allMovies = [];


async function initApp() {
    retryBtn.addEventListener('click', loadMovies);
    await loadMovies();
}


async function loadMovies() {
    showLoading();

    try {
        const url = `${TMDB_BASE_URL}/trending/movie/day?api_key=${TMDB_API_KEY}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('API Key missing or invalid');
        const data = await response.json();
        allMovies = data.results;
        renderMovies(allMovies);
    } catch (error) {
        console.warn('Movie fetch failed. Using mock data.', error);
        allMovies = getMockMovies();
        renderMovies(allMovies);
    }
}


function renderMovies(movies) {
    if (movies.length === 0) {
        moviesContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: #94a3b8; padding: 4rem 2rem;">
                <p style="font-size: 1.2rem;">No movies found.</p>
            </div>`;
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
            <div class="movie-card">
                ${posterHTML}
                <div class="movie-info">
                    <h3 class="movie-title" title="${movie.title}">${movie.title}</h3>
                    <div class="movie-meta">
                        <span class="rating">⭐ ${ratingHTML}</span>
                        <span class="year">${yearHTML}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    hideLoading();
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
