// --- API Keys Configuration ---
// Set these to test with the live APIs
const TMDB_API_KEY = 'YOUR_TMDB_API_KEY_HERE';
const WATCHMODE_API_KEY = 'YOUR_WATCHMODE_API_KEY_HERE';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const WATCHMODE_BASE_URL = 'https://api.watchmode.com/v1';

// DOM Elements
const moviesContainer = document.getElementById('movies-container');
const genreFilter = document.getElementById('genre-filter');
const topRatedBtn = document.getElementById('top-rated-btn');
const loadingState = document.getElementById('loading');
const errorState = document.getElementById('error');
const retryBtn = document.getElementById('retry-btn');
const movieModal = document.getElementById('movie-modal');
const modalBody = document.getElementById('modal-body');
const closeModalBtn = document.querySelector('.close-btn');

let allMovies = [];
let currentFilter = { genre: '', topRated: false };

// Initialize App
async function initApp() {
    setupEventListeners();
    await fetchGenres();
    await loadMovies();
}

// Event Listeners
function setupEventListeners() {
    genreFilter.addEventListener('change', (e) => {
        currentFilter.genre = e.target.value;
        applyFilters();
    });

    topRatedBtn.addEventListener('click', () => {
        currentFilter.topRated = !currentFilter.topRated;
        topRatedBtn.classList.toggle('active');
        applyFilters();
    });

    retryBtn.addEventListener('click', loadMovies);
    
    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === movieModal) closeModal();
    });
}

// Fetch Genres from TMDB
async function fetchGenres() {
    try {
        const response = await fetch(`${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`);
        if (!response.ok) throw new Error('Failed to fetch genres');
        const data = await response.json();
        
        data.genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre.id;
            option.textContent = genre.name;
            genreFilter.appendChild(option);
        });
    } catch (error) {
        console.warn('Genre fetch failed (missing/invalid API key). Using fallback genres.', error);
        const fallbackGenres = [
            {id: 28, name: "Action"},
            {id: 35, name: "Comedy"},
            {id: 18, name: "Drama"},
            {id: 878, name: "Science Fiction"},
            {id: 12, name: "Adventure"},
            {id: 16, name: "Animation"}
        ];
        fallbackGenres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre.id;
            option.textContent = genre.name;
            genreFilter.appendChild(option);
        });
    }
}

// Fetch Trending Movies
async function loadMovies() {
    showLoading();
    try {
        const response = await fetch(`${TMDB_BASE_URL}/trending/movie/day?api_key=${TMDB_API_KEY}`);
        if (!response.ok) throw new Error('API Key missing or invalid');
        const data = await response.json();
        allMovies = data.results;
        applyFilters();
    } catch (error) {
        console.warn('Movie fetch failed (missing/invalid API key). Using mock data.', error);
        allMovies = getMockMovies();
        applyFilters();
    }
}

// Apply Filters
function applyFilters() {
    let filtered = allMovies;
    
    // Genre Filter
    if (currentFilter.genre) {
        filtered = filtered.filter(m => m.genre_ids.includes(parseInt(currentFilter.genre)));
    }
    
    // Top Rated Filter (8.0 or higher)
    if (currentFilter.topRated) {
        filtered = filtered.filter(m => m.vote_average >= 8.0);
    }
    
    renderMovies(filtered);
}

// Render Movies to the DOM
function renderMovies(movies) {
    moviesContainer.innerHTML = '';
    hideLoading();
    
    if (movies.length === 0) {
        moviesContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 4rem 2rem;">
                <p style="font-size: 1.2rem;">No movies found matching your criteria.</p>
            </div>`;
        return;
    }

    movies.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.onclick = () => openModal(movie);
        
        const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null;
        const posterHTML = posterUrl 
            ? `<div class="movie-poster-container"><img src="${posterUrl}" alt="${movie.title}" class="movie-poster" loading="lazy"></div>`
            : `<div class="movie-poster-container"><div class="no-poster">No Image</div></div>`;

        const ratingHTML = movie.vote_average ? movie.vote_average.toFixed(1) : 'NR';
        const yearHTML = movie.release_date ? movie.release_date.substring(0,4) : 'N/A';

        card.innerHTML = `
            ${posterHTML}
            <div class="movie-info">
                <h3 class="movie-title" title="${movie.title}">${movie.title}</h3>
                <div class="movie-meta">
                    <span class="rating">⭐ ${ratingHTML}</span>
                    <span class="year">${yearHTML}</span>
                </div>
            </div>
        `;
        moviesContainer.appendChild(card);
    });
}

// UI States
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

// Modal Logic
function openModal(movie) {
    const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '';
    const ratingHTML = movie.vote_average ? movie.vote_average.toFixed(1) : 'NR';
    const dateHTML = movie.release_date || 'Unknown Date';
    
    modalBody.innerHTML = `
        <div class="modal-body-inner">
            ${posterUrl ? `<img src="${posterUrl}" alt="${movie.title}" class="modal-poster">` : `<div class="modal-poster no-poster" style="background:var(--bg-color);display:flex;align-items:center;justify-content:center;">No Image</div>`}
            <div class="modal-details">
                <h2 class="modal-title">${movie.title}</h2>
                <div class="modal-meta">
                    <span class="rating">⭐ ${ratingHTML}</span>
                    <span class="date">📅 ${dateHTML}</span>
                </div>
                <p class="synopsis">${movie.overview || 'No synopsis available for this title.'}</p>
                
                <div class="watch-providers">
                    <h3>Where to Watch</h3>
                    <div id="providers-container">
                        <div class="spinner" style="width: 28px; height: 28px; border-width: 3px;"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    movieModal.classList.remove('hidden');
    
    // Fetch streaming info
    fetchWatchProviders(movie);
}

function closeModal() {
    movieModal.classList.add('hidden');
}

// Fetch Watch Providers (Watchmode)
async function fetchWatchProviders(movie) {
    const container = document.getElementById('providers-container');
    
    try {
        const url = `${WATCHMODE_BASE_URL}/title/movie-${movie.id}/sources/?apiKey=${WATCHMODE_API_KEY}`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Failed to fetch streaming providers');
        const data = await response.json();
        
        // Filter unique flatrate streaming platforms (subscriptions)
        const streamSources = data.filter(source => source.type === 'sub');
        
        // Deduplicate streaming services by name
        const uniqueSources = [];
        streamSources.forEach(src => {
            if(!uniqueSources.some(u => u.name === src.name)) {
                uniqueSources.push(src);
            }
        });

        if (uniqueSources.length > 0) {
            container.innerHTML = `
                <div class="providers-list">
                    ${uniqueSources.map(p => `
                        <div class="genre-tag" title="Watch on ${p.name}">${p.name}</div>
                    `).join('')}
                </div>
            `;
        } else {
            container.innerHTML = `<p style="color: var(--text-muted);">No subscription streaming sources available currently.</p>`;
        }
    } catch (error) {
        console.warn('Watchmode fetch failed (missing/invalid API key).', error);
        container.innerHTML = `
            <div style="background: rgba(255, 255, 255, 0.05); padding: 1rem; border-radius: 8px;">
                <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 0.5rem;">Streaming data unavailable.</p>
                <p style="color: #64748b; font-size: 0.85rem;">(Requires a valid Watchmode API key in script.js)</p>
            </div>
        `;
    }
}

// Mock Data (Used as fallback if API calls fail)
function getMockMovies() {
    return [
        {
            id: 693134,
            title: "Dune: Part Two",
            overview: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
            poster_path: "/1pdfLvkbY9ohJlCjQH2JGjjcNsV.jpg",
            vote_average: 8.3,
            release_date: "2024-02-27",
            genre_ids: [28, 878, 12]
        },
        {
            id: 823464,
            title: "Godzilla x Kong: The New Empire",
            overview: "Following their explosive showdown, Godzilla and Kong must reunite against a colossal undiscovered threat hidden within our world.",
            poster_path: "/tMefBSflR6PGQLvLuPE21pTFoLE.jpg",
            vote_average: 7.2,
            release_date: "2024-03-27",
            genre_ids: [28, 878, 12]
        },
        {
            id: 929590,
            title: "Civil War",
            overview: "In the near future, a team of journalists travel across the United States during a rapidly escalating civil war.",
            poster_path: "/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg",
            vote_average: 7.4,
            release_date: "2024-04-10",
            genre_ids: [28, 18]
        },
        {
            id: 1011985,
            title: "Kung Fu Panda 4",
            overview: "Po is gearing up to become the spiritual leader of his Valley of Peace, but also needs someone to take his place as Dragon Warrior. As such, he will train a new kung fu practitioner for the spot...",
            poster_path: "/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg",
            vote_average: 7.1,
            release_date: "2024-03-02",
            genre_ids: [28, 35, 16, 12]
        },
        {
            id: 872585,
            title: "Oppenheimer",
            overview: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
            poster_path: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
            vote_average: 8.1,
            release_date: "2023-07-19",
            genre_ids: [18, 36]
        },
        {
            id: 792307,
            title: "Poor Things",
            overview: "Brought back to life by an unorthodox scientist, a young woman runs off with a debauched lawyer on a whirlwind adventure across the continents. Free from the prejudices of her times, she grows steadfast in her purpose to stand for equality and liberation.",
            poster_path: "/kCGlIMHnOm8PhbO3VFcGHcleswQ.jpg",
            vote_average: 7.8,
            release_date: "2023-12-07",
            genre_ids: [35, 878, 18]
        },
        {
            id: 1096197,
            title: "No Way Up",
            overview: "Characters from different backgrounds are thrown together when the plane they're travelling on crashes into the Pacific Ocean. A nightmare fight for survival ensues with the air supply running out and dangers creeping in from all sides.",
            poster_path: "/hu40Uxp9WtpL34jv3zyWLb5zEVY.jpg",
            vote_average: 6.4,
            release_date: "2024-01-18",
            genre_ids: [28, 18, 53]
        },
        {
            id: 1041613,
            title: "Immaculate",
            overview: "An American nun embarks on a new journey when she joins a remote convent in the Italian countryside. However, her warm welcome quickly turns into a living nightmare when she discovers her new home hides a sinister secret.",
            poster_path: "/fdZpvZcgv00AMoX0zSWRK2pQmyP.jpg",
            vote_average: 6.3,
            release_date: "2024-03-20",
            genre_ids: [27, 53]
        }
    ];
}

// Start application
initApp();
