import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHeart as heartSolid } from "@fortawesome/free-solid-svg-icons"
import { faHeart as heartRegular } from "@fortawesome/free-regular-svg-icons"
import { faEye as eyeSolid } from "@fortawesome/free-solid-svg-icons"
import { faEye as eyeRegular } from "@fortawesome/free-regular-svg-icons"
import "./StatusActions.css"

const StatusActions = ({
  alreadyFavorited,
  alreadyWatched,
  movie,
  toggleFavorite,
  toggleWatched,
}) => {
  return (
    <>
      <FontAwesomeIcon
        icon={alreadyWatched ? eyeSolid : eyeRegular}
        color={alreadyWatched ? "#1D84B5" : "#888"}
        onClick={(e) => {
          e.stopPropagation()
          toggleWatched(movie)
        }}
      />
      <FontAwesomeIcon
        icon={alreadyFavorited ? heartSolid : heartRegular}
        color={alreadyFavorited ? "#FF4242" : "#888"}
        onClick={(e) => {
          e.stopPropagation()
          toggleFavorite(movie)
        }}
      />
    </>
  )
}

export default StatusActions
