import { useEffect, useState } from "react"
import { setMovieState } from "../utils/utils"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHeart as heartSolid } from "@fortawesome/free-solid-svg-icons"
import { faHeart as heartRegular } from "@fortawesome/free-regular-svg-icons"
import { faEye as eyeSolid } from "@fortawesome/free-solid-svg-icons"
import { faEye as eyeRegular } from "@fortawesome/free-regular-svg-icons"
import "./StatusActions.css"

const StatusActions = ({ alreadyFavorited, alreadyWatched, movie }) => {
  const [isFavorite, setIsFavorite] = useState(alreadyFavorited)
  const [isWatched, setIsWatched] = useState(alreadyWatched)

  const addFavorite = async (e) => {
    e.stopPropagation()
    const body = JSON.stringify({
      media_type: "movie",
      media_id: movie.id,
      favorite: !isFavorite,
    })
    const url = `https://api.themoviedb.org/3/account/${
      import.meta.env.VITE_ACCOUNT_ID
    }/favorite`

    setMovieState(url, body, setIsFavorite)
  }

  const addWatched = async (e) => {
    e.stopPropagation()
    const body = JSON.stringify({
      media_type: "movie",
      media_id: movie.id,
      watchlist: !isWatched,
    })
    const url = `https://api.themoviedb.org/3/account/${
      import.meta.env.VITE_ACCOUNT_ID
    }/watchlist`

    setMovieState(url, body, setIsWatched)
  }

  useEffect(() => {
    setIsFavorite(alreadyFavorited)
  }, [alreadyFavorited])

  useEffect(() => {
    setIsWatched(alreadyWatched)
  }, [alreadyWatched])

  return (
    <>
      <FontAwesomeIcon
        icon={isWatched ? eyeSolid : eyeRegular}
        color={isWatched ? "#1D84B5" : "#888"}
        onClick={(e) => addWatched(e)}
      />
      <FontAwesomeIcon
        icon={isFavorite ? heartSolid : heartRegular}
        color={isFavorite ? "#FF4242" : "#888"}
        onClick={(e) => addFavorite(e)}
      />
    </>
  )
}

export default StatusActions
