import { useEffect, useState } from "react"
import MovieList from "./components/MovieList"
import MovieDetails from "./components/MovieDetails"
import "./App.css"
import { OPTIONS } from "./utils/constants"
import { setMovieState } from "./utils/utils"

const App = () => {
  const [sortBy, setSortBy] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [searchTermInput, setSearchTermInput] = useState("")
  const [currentPage, setCurrentPage] = useState("now-playing")
  const [currentMovie, setCurrentMovie] = useState(null)
  const [genres, setGenres] = useState([])
  const [favorites, setFavorites] = useState([])
  const [watched, setWatched] = useState([])

  const handlePageChange = (page) => {
    setCurrentPage(page)
    setSearchTerm("")
    setSearchTermInput("")
    setSortBy("")
  }

  const toggleFavorite = (movie) => {
    const isCurrentlyFavorite = favorites.some((m) => m.id === movie.id)
    const url = `https://api.themoviedb.org/3/account/${
      import.meta.env.VITE_ACCOUNT_ID
    }/favorite`
    const body = JSON.stringify({
      media_type: "movie",
      media_id: movie.id,
      favorite: !isCurrentlyFavorite,
    })
    setMovieState(url, body, (newState) => {
      setFavorites((prev) =>
        newState
          ? [...prev, movie]
          : prev.filter((m) => m.id !== movie.id)
      )
    })
  }

  const toggleWatched = (movie) => {
    const isCurrentlyWatched = watched.some((m) => m.id === movie.id)
    const url = `https://api.themoviedb.org/3/account/${
      import.meta.env.VITE_ACCOUNT_ID
    }/watchlist`
    const body = JSON.stringify({
      media_type: "movie",
      media_id: movie.id,
      watchlist: !isCurrentlyWatched,
    })
    setMovieState(url, body, (newState) => {
      setWatched((prev) =>
        newState
          ? [...prev, movie]
          : prev.filter((m) => m.id !== movie.id)
      )
    })
  }

  useEffect(() => {
    const fetchGenres = async () => {
      const url = "https://api.themoviedb.org/3/genre/movie/list"
      const response = await fetch(url, OPTIONS)
      const genreData = await response.json()
      setGenres(genreData.genres)
    }
    const fetchFavorites = async () => {
      const url = `https://api.themoviedb.org/3/account/${
        import.meta.env.VITE_ACCOUNT_ID
      }/favorite/movies`
      const response = await fetch(url, OPTIONS)
      const data = await response.json()
      setFavorites(data.results)
    }
    const fetchWatched = async () => {
      const url = `https://api.themoviedb.org/3/account/${
        import.meta.env.VITE_ACCOUNT_ID
      }/watchlist/movies`
      const response = await fetch(url, OPTIONS)
      const data = await response.json()
      setWatched(data.results)
    }
    fetchGenres()
    fetchFavorites()
    fetchWatched()
  }, [])

  const isCurrentFavorite = currentMovie
    ? favorites.some((m) => m.id === currentMovie.id)
    : false
  const isCurrentWatched = currentMovie
    ? watched.some((m) => m.id === currentMovie.id)
    : false

  return (
    <div className="App">
      <header className="title">
        <h1>Flixster</h1>
      </header>
      <nav>
        <div className="app-nav">
          <span
            onClick={() => handlePageChange("now-playing")}
            className={
              currentPage === "now-playing" && searchTerm === "" ? "active" : ""
            }
          >
            Now Playing
          </span>
          <span
            onClick={() => handlePageChange("watched")}
            className={currentPage === "watched" ? "active" : ""}
          >
            Watchlist
          </span>
          <span
            onClick={() => handlePageChange("favorites")}
            className={currentPage === "favorites" ? "active" : ""}
          >
            Favorites
          </span>
        </div>
        <div className="search-wrapper">
          <div className="search">
            <input
              value={searchTermInput}
              type="text"
              placeholder="Search for a movie..."
              onChange={(e) => setSearchTermInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSearchTerm(searchTermInput)
                }
              }}
            />
            <button
              className="search-button"
              onClick={() => setSearchTerm(searchTermInput)}
            >
              Search
            </button>
            <button
              className="clear-button"
              onClick={() => {
                setSearchTerm("")
                setSearchTermInput("")
              }}
            >
              Clear
            </button>
          </div>
          <div className="sort">
            <label htmlFor="sort">Sort by: </label>
            <select
              id="sort"
              name="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="" disabled>
                ---
              </option>
              <option value="release-date">Release Date</option>
              <option value="rating">Rating</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
      </nav>
      <main>
        <MovieList
          sortBy={sortBy}
          searchTerm={searchTerm}
          currentPage={currentPage}
          setCurrentMovie={setCurrentMovie}
          favorites={favorites}
          watched={watched}
          toggleFavorite={toggleFavorite}
          toggleWatched={toggleWatched}
        />
      </main>
      <footer>
        <p>© 2025 Flixster</p>
      </footer>
      <MovieDetails
        movieInfo={currentMovie}
        genres={genres}
        close={() => setCurrentMovie(null)}
        isFavorite={isCurrentFavorite}
        isWatched={isCurrentWatched}
        toggleFavorite={toggleFavorite}
        toggleWatched={toggleWatched}
      />
    </div>
  )
}

export default App
