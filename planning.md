(I don't have time to recreate this project from scratch, so I'm only planning the new AI feature.)

## AI-Powered Movie Insight

#### User experience:

When a user opens a movie's detail modal, an AI-generated "Watch Recommendation" is displayed below the movie's metadata, above the trailer. It will be styled the same way as the movie description.

A loading state is displayed while the AI response is being generated.
If the AI call fails, a graceful fallback message is shown rather than a broken UI.

#### React

State should be stored as narrowly scoped as is sensible.

#### External API

Endpoint: https://openrouter.ai/api/v1/chat/completions

Model: use a free-tier model such as meta-llama/llama-3.3-70b-instruct:free or google/gemma-3-27b-it:free

VITE_OPENROUTER_API_KEY has been added to the .env

#### Prompt Spect

Role: A thoughtful film critic
Task: Write a brief recommendation describing why a user would like this film
Inputs: A movie's metadata
Output format: String — One to three short sentences
Constraints: up to 250 chars total
