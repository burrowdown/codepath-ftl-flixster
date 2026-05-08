import { useEffect, useState } from "react"

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
// Free OpenRouter tiers rate-limit upstream frequently; try a chain.
const MODELS = [
  "openai/gpt-oss-20b:free",
  "z-ai/glm-4.5-air:free",
  "meta-llama/llama-3.3-70b-instruct:free",
]

const buildPrompt = (movie, genreNames) => {
  const metadata = [
    `Title: ${movie.title}`,
    movie.overview ? `Overview: ${movie.overview}` : null,
    genreNames.length ? `Genres: ${genreNames.join(", ")}` : null,
    movie.release_date ? `Release date: ${movie.release_date}` : null,
    movie.vote_average ? `Average rating: ${movie.vote_average}` : null,
    movie.runtime ? `Runtime: ${movie.runtime} minutes` : null,
  ]
    .filter(Boolean)
    .join("\n")

  return `A user is considering watching this film:
${metadata}

Write a brief recommendation (one to three short sentences, up to 250 characters total) describing what kind of viewer would enjoy this film and why.`
}

const WatchRecommendation = ({ movie, genreNames }) => {
  const [recommendation, setRecommendation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errored, setErrored] = useState(false)

  useEffect(() => {
    if (!movie?.id) return

    let cancelled = false
    setLoading(true)
    setErrored(false)
    setRecommendation(null)

    const generate = async () => {
      try {
        const messages = [
          { role: "system", content: "You are a thoughtful film critic." },
          { role: "user", content: buildPrompt(movie, genreNames) },
        ]

        let text = null
        let lastError = null
        for (const model of MODELS) {
          try {
            const aiResponse = await fetch(OPENROUTER_URL, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ model, messages, max_tokens: 100 }),
            })
            const aiData = await aiResponse.json()
            if (!aiResponse.ok || aiData.error) {
              lastError = aiData?.error?.message || `HTTP ${aiResponse.status}`
              continue
            }
            const candidate = aiData?.choices?.[0]?.message?.content?.trim()
            if (candidate) {
              text = candidate
              break
            }
            lastError = "Empty AI response"
          } catch (e) {
            lastError = e.message
          }
        }
        if (!text) throw new Error(lastError || "AI request failed")
        if (!cancelled) setRecommendation(text)
      } catch (e) {
        console.error("WatchRecommendation failed:", e)
        if (!cancelled) setErrored(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    generate()
    return () => {
      cancelled = true
    }
  }, [movie?.id])

  let body
  if (loading) body = "Generating a recommendation for you…"
  else if (errored)
    body = "We couldn't generate a recommendation right now. Please try again later."
  else body = recommendation

  return (
    <p className="overview watch-recommendation">
      <span className="label">Watch Recommendation:</span> {body}
    </p>
  )
}

export default WatchRecommendation
