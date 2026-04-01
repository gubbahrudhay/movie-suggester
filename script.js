// --- API Keys Configuration ---
// Set these to test with the live APIs
const TMDB_API_KEY = 'a5d4b434f63ca7bffac67c55c61bc9ce';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// DOM Elements
const moviesContainer = document.getElementById('movies-container');
const loadingState = document.getElementById('loading');
const errorState = document.getElementById('error');
const retryBtn = document.getElementById('retry-btn');

let allMovies = [];

// Initialize App
async function initApp() {
    retryBtn.addEventListener('click', loadMovies);
    await loadMovies();
}

// Fetch Movies (Trending)
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

// Render Movies to the DOM
function renderMovies(movies) {
    if (movies.length === 0) {
        moviesContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: #94a3b8; padding: 4rem 2rem;">
                <p style="font-size: 1.2rem;">No movies found.</p>
            </div>`;
        hideLoading();
        return;
    }

    // Creating DOM elements utilizing Array.prototype.map and Array.prototype.join
    moviesContainer.innerHTML = movies.map(movie => {
        const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null;
        const posterHTML = posterUrl 
            ? `<div class="movie-poster-container"><img src="${posterUrl}" alt="${movie.title}" class="movie-poster" loading="lazy"></div>`
            : `<div class="movie-poster-container"><div class="no-poster">No Image</div></div>`;
            
        const ratingHTML = movie.vote_average ? movie.vote_average.toFixed(1) : 'NR';
        const yearHTML = movie.release_date ? movie.release_date.substring(0,4) : 'N/A';

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
            overview: "Po is gearing up to become the spiritual leader of his Valley of Peace, but also needs someone to take his place as Dragon Warrior.",
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
            overview: "Brought back to life by an unorthodox scientist, a young woman runs off with a debauched lawyer on a whirlwind adventure across the continents.",
            poster_path: "/kCGlIMHnOm8PhbO3VFcGHcleswQ.jpg",
            vote_average: 7.8,
            release_date: "2023-12-07",
            genre_ids: [35, 878, 18]
        }
    ];
}

// Start application
initApp();
