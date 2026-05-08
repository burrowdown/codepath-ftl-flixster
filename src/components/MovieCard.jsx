import StatusActions from "./StatusActions"

const FALLBACK_URL = "https://image.tmdb.org/t/p"

const MovieCard = ({
  movie,
  setCurrentMovie,
  config,
  alreadyFavorited,
  alreadyWatched,
}) => {
  if (!movie) return null

  const base_url =
    config && config.images ? config.images.base_url : FALLBACK_URL
  const url = `${base_url}/w185${movie.poster_path}`

  return (
    <div
      className="movie-card status-actions-wrapper"
      onClick={() => {
        setCurrentMovie({
          id: movie.id,
          isFavorite: alreadyFavorited,
          isWatched: alreadyWatched,
        })
      }}
    >
      <div className="status-actions">
        <StatusActions
          movie={movie}
          alreadyFavorited={alreadyFavorited}
          alreadyWatched={alreadyWatched}
        />
      </div>
      <img src={url} alt={`poster for ${movie.title}`} />
      <div className="movie-title">{movie.title}</div>
      <div className="movie-rating">Rating: {movie.vote_average}</div>
    </div>
  )
}

export default MovieCard
