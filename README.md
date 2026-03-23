<div align="center">
  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Clapper%20Board.png" alt="Movie Suggester Logo" width="120" />

  <h1>🎬 Movie Decider AI</h1>
  <p>
    <b>A smart movie discovery app for people who can’t decide what to watch.</b>
  </p>

  <p>
    <img src="https://img.shields.io/github/license/YOUR_USERNAME/movie-decider?style=flat-square&color=5D6D7E" alt="License" />
    <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=flat-square&logo=vite&logoColor=FFD62E" alt="Vite" />
  </p>
</div>

---

## 🚀 Features

- **🔥 Real-time Trending Movies:** Powered directly by the TMDB API.
- **🎭 Intelligent Genre Filtering:** Effortlessly sort through thousands of titles by mood or category.
- **⭐ Top Rated Cinema:** Discover critically acclaimed masterpieces instantly.
- **📺 "Where to Watch" Integration:** Integrated with Watchmode API to see if it's on Netflix, Prime, etc.
- **🎲 Surprise Me:** A smart randomizer for when you just want to jump right in.
- **🌙 Cinematic Dark UI:** Beautiful, responsive, mobile-first design built with clean Vanilla CSS.

## 🧠 Tech Stack

- **Frontend:** React, Vite, Vanilla CSS
- **APIs:**
  1. [TMDB (The Movie Database)](https://developer.themoviedb.org/docs/getting-started) - Core movie data, genres, metadata.
  2. [Watchmode](https://api.watchmode.com/) - Streaming service availability and deep links.

## 🎨 UI Preview

> 🌟 **Pro Tip:** Keep your screenshots updated to showcase your beautiful UI.

*(Add your awesome GIF or screenshots here!)*

## ⚙️ Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/gubbahrudhay/movie-suggester.git
cd movie-suggester
```

### 2. Install dependencies
```bash
npm install
```

### 3. Add API Keys
Create a `.env` file in the root directory and add your keys:
```env
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_WATCHMODE_API_KEY=your_watchmode_api_key
```

### 4. Run the development server
```bash
npm run dev
```

## 📂 Project Structure

```text
src/
 ├── components/
 │    ├── MovieCard.jsx         # The beautiful movie display component
 │    ├── GenreFilter.jsx       # Interactive genre pills
 │    ├── StreamingInfo.jsx     # "Where to watch" badges
 │    └── Navbar.jsx            # App navigation
 │
 ├── services/
 │    ├── tmdb.js               # Helpers for TMDB endpoints
 │    └── watchmode.js          # Helpers for Watchmode endpoints
 │
 ├── styles/
 │    └── index.css             # Vanilla CSS styling
 │
 ├── pages/
 │    └── Home.jsx              # Main dashboard
 │
 └── App.jsx                    # Root application wrapper
```

## 💡 Future Enhancements

- [ ] **AI Semantic Search:** Search by plot descriptions ("movie about space travel")
- [ ] **Personalized Watchlists:** Save favorites to local storage
- [ ] **Trailer Previews:** Embedded YouTube trailers on hover
- [ ] **Performance Polish:** Advanced caching and image lazy loading

## 🤝 Acknowledgements

- **TMDB API** for their incredible movie database context.
- **Watchmode API** for filling the streaming fragmentation gap.

## 📜 License

This project is open-source and available under the **[MIT License](LICENSE)**.
