import { useEffect, useRef, useState } from "react"
import MovieCard from "./MovieCard"
import "./MovieList.css"
import { OPTIONS } from "../utils/constants"
import { filterAndSort } from "../utils/utils"

const MovieList = ({ sortBy, searchTerm, currentPage, setCurrentMovie }) => {
  const [movies, setMovies] = useState([])
  const [moviesToDisplay, setMoviesToDisplay] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [tmdbConfig, setTmdbConfig] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [watched, setWatched] = useState([])
  const scrollPosition = useRef(0)

  const BASE_URL = "https://api.themoviedb.org/3/movie/now_playing?"

  const fetchMovies = async () => {
    try {
      const response = await fetch(`${BASE_URL}&page=${page}`, OPTIONS)
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      const data = await response.json()
      setMovies((prevMovies) => [...prevMovies, ...data.results])
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    scrollPosition.current = window.scrollY
    setPage((prevPage) => prevPage + 1)
    setLoading(true)
  }

  // load movies when "load more" is clicked
  useEffect(() => {
    fetchMovies()
  }, [page])

  // Restore the scroll position after movies are loaded
  useEffect(() => {
    if (!loading) {
      window.scrollTo(0, scrollPosition.current)
    }
  }, [loading])

  // reset moviesToDisplay when navigating between pages
  useEffect(() => {
    if (currentPage === "now-playing") setMoviesToDisplay(movies)
    if (currentPage === "favorites") setMoviesToDisplay(favorites)
    if (currentPage === "watched") setMoviesToDisplay(watched)
  }, [currentPage])

  // Filter and sort movies based on search term and sort criteria
  useEffect(() => {
    let theseMovies = movies
    if (currentPage === "favorites") theseMovies = favorites
    if (currentPage === "watched") theseMovies = watched
    setMoviesToDisplay(filterAndSort(theseMovies, sortBy, searchTerm))
  }, [movies, sortBy, searchTerm])

  useEffect(() => {
    // get tmdb config to get the base URL
    const fetchConfig = async () => {
      const url = "https://api.themoviedb.org/3/configuration"
      const response = await fetch(url, OPTIONS)
      const configData = await response.json()
      setTmdbConfig(configData)
    }
    // get favorites
    const fetchFavorites = async () => {
      const url = `https://api.themoviedb.org/3/account/${
        import.meta.env.VITE_ACCOUNT_ID
      }/favorite/movies`
      const response = await fetch(url, OPTIONS)
      const favoritesData = await response.json()
      setFavorites(favoritesData.results)
    }
    // get watchlist
    const fetchWatched = async () => {
      const url = `https://api.themoviedb.org/3/account/${
        import.meta.env.VITE_ACCOUNT_ID
      }/watchlist/movies`
      const response = await fetch(url, OPTIONS)
      const watchedData = await response.json()
      setWatched(watchedData.results)
    }
    fetchConfig()
    fetchFavorites()
    fetchWatched()
  }, [])

  if (loading) {
    return (
      <div className="loading">
        Loading...
        <img className="loading-spinner" src="/movie.png" alt="Loading" />
      </div>
    )
  }
  if (error) {
    return <div className="loading">Error: {error.message}</div>
  }
  if (moviesToDisplay.length === 0) {
    return <div className="loading">No movies found</div>
  }
  return (
    <>
      <div className="movie-list">
        {moviesToDisplay.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            setCurrentMovie={setCurrentMovie}
            config={tmdbConfig}
            alreadyFavorited={favorites.some((m) => m.id === movie.id)}
            alreadyWatched={watched.some((m) => m.id === movie.id)}
          />
        ))}
      </div>
      {currentPage === "now-playing" && (
        <button onClick={loadMore} className="load-more-button">
          Load More
        </button>
      )}
    </>
  )
}

export default MovieList
