import { OPTIONS } from "./constants"

const filterAndSort = (movies, sortBy, searchTerm) => {
  let filteredMovies = [...movies]

  if (searchTerm) {
    filteredMovies = filteredMovies.filter((movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  if (sortBy === "title") {
    filteredMovies.sort((a, b) => a.title.localeCompare(b.title))
  } else if (sortBy === "release-date") {
    filteredMovies.sort(
      (a, b) => new Date(b.release_date) - new Date(a.release_date)
    )
  } else if (sortBy === "rating") {
    filteredMovies.sort(
      (a, b) => parseFloat(b.vote_average) - parseFloat(a.vote_average)
    )
  }

  return filteredMovies
}

const setMovieState = async (url, body, setter) => {
  try {
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        Authorization: OPTIONS.headers.Authorization,
      },
      body,
    }
    const response = await fetch(url, options)
    if (!response.ok) throw new Error("Network response was not ok")
    const json = await response.json()
    if (json.status_code === 1 || json.status_code === 12) {
      setter(true)
    } else if (json.status_code === 13) {
      setter(false)
    } else {
      throw new Error(`Unexpected status code: ${json.status_code}`)
    }
  } catch (error) {
    console.error("Error setting movie status:", error)
  }
}

export { filterAndSort, setMovieState }
