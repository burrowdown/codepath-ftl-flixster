import { useEffect, useState } from "react"
import "./MovieDetails.css"
import { OPTIONS } from "../utils/constants"
import StatusActions from "./StatusActions"

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"
const MOVIE_BASE_URL = "https://api.themoviedb.org/3/movie/"

const MovieDetails = ({ movieInfo, close, genres = [] }) => {
  if (!movieInfo) return null

  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [genreNames, setGenreNames] = useState([])
  const [trailerKey, setTrailerKey] = useState(null)

  const fetchMovie = async () => {
    try {
      const response = await fetch(`${MOVIE_BASE_URL}${movieInfo.id}`, OPTIONS)
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      const data = await response.json()
      setMovie(data)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTrailer = async () => {
    const url = `https://api.themoviedb.org/3/movie/${movieInfo.id}/videos`
    const response = await fetch(url, OPTIONS)
    if (response.ok) {
      const videoData = await response.json()
      const trailer = videoData.results.find(
        (vid) => vid.site === "YouTube" && vid.type === "Trailer" && vid.key
      )
      setTrailerKey(trailer ? trailer.key : null)
    }
  }

  const getGenres = () => {
    if (!movie || !movie.genres) return ""
    const names = movie.genres.map((genre) => {
      const foundGenre = genres.find((g) => g.id === genre.id)
      return foundGenre ? foundGenre.name : ""
    })
    setGenreNames(names)
  }

  const handleClose = (e) => {
    if (!e.target.classList.contains("modal-overlay")) {
      return
    } else closeModal()
  }

  const closeModal = () => {
    setError(null)
    setMovie(null)
    close()
  }

  useEffect(() => {
    setError(null)
    setLoading(true)
    if (movieInfo.id) {
      fetchMovie()
      fetchTrailer()
    }
  }, [movieInfo.id])

  useEffect(() => {
    if (movie) getGenres()
  }, [movie])

  if (!movieInfo.id || !movie) return null
  if (loading) {
    return (
      <div className="loading">
        Loading...
        <img className="loading-spinner" src="/movie.png" alt="Loading" />
      </div>
    )
  }
  if (error) {
    return <div>Error: {error.message}</div>
  }
  return (
    <section className="modal-overlay" onClick={(e) => handleClose(e)}>
      <div className="modal-content">
        <div className="status-actions-wrapper">
          <div className="status-actions">
            <StatusActions
              alreadyFavorited={movieInfo.isFavorite}
              alreadyWatched={movieInfo.isWatched}
              movie={movie}
            />
          </div>
          <img
            src={`${IMAGE_BASE_URL}${movie.backdrop_path}`}
            alt={`Backdrop for ${movie.title}`}
          />
        </div>
        <h2>{movie.title}</h2>
        <p className="overview">{movie.overview}</p>
        <p>
          <span className="label">Rating:</span> {movie.vote_average}
        </p>
        <p>
          <span className="label">Release Date:</span> {movie.release_date}
        </p>
        <p>
          <span className="label">Runtime:</span> {movie.runtime} minutes
        </p>
        <p>
          <span className="label">Genres:</span>{" "}
          {genreNames.length > 0 ? genreNames.join(", ") : "N/A"}
        </p>
        <a href={`https://www.imdb.com/title/${movie.imdb_id}`}>
          {movie.title} on IMDB
        </a>
        {trailerKey && (
          <div className="trailer-container">
            <div className="iframe-wrapper">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}`}
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
        <button className="close-button" onClick={closeModal}>
          Close
        </button>
      </div>
    </section>
  )
}

export default MovieDetails
