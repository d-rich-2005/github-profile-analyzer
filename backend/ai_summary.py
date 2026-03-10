import os
import httpx

# AI Provider settings
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")


def generate_developer_summary(profile_data: dict) -> str:
    """Generate a developer profile summary using available AI provider."""
    prompt = build_prompt(profile_data)

    # Try Gemini first (for cloud deployment)
    if GEMINI_API_KEY:
        result = try_gemini(prompt)
        if result:
            return result

    # Try Ollama (for local development)
    result = try_ollama(prompt)
    if result:
        return result

    # Fallback to rule-based
    return fallback_summary(profile_data)


def build_prompt(profile_data: dict) -> str:
    """Build the prompt for AI summary generation."""
    user = profile_data.get("user", {})
    languages = profile_data.get("languages", {})
    top_repos = profile_data.get("top_repos", [])
    stats = profile_data.get("stats", {})

    top_languages = list(languages.keys())[:5]
    repo_descriptions = [
        f"- {repo['name']}: {repo.get('description', 'No description')} ({repo.get('stars', 0)} stars)"
        for repo in top_repos[:5]
    ]

    return f"""Based on this GitHub profile data, write a brief, engaging developer profile summary (2-3 short paragraphs).

Developer: {user.get('name') or user.get('login')}
Bio: {user.get('bio') or 'Not provided'}
Location: {user.get('location') or 'Not specified'}
Company: {user.get('company') or 'Not specified'}

Stats:
- Public repositories: {stats.get('total_repos', 0)}
- Total stars received: {stats.get('total_stars', 0)}
- Total forks: {stats.get('total_forks', 0)}
- Followers: {user.get('followers', 0)}

Top Languages: {', '.join(top_languages) if top_languages else 'None detected'}

Notable Repositories:
{chr(10).join(repo_descriptions) if repo_descriptions else 'No public repositories'}

Write a professional but friendly summary that highlights their technical strengths. Keep it concise (max 150 words). Do not use phrases like "Based on the data" or start with "Here is"."""


def try_gemini(prompt: str) -> str | None:
    """Try to generate summary using Google Gemini."""
    try:
        with httpx.Client(timeout=30.0) as client:
            response = client.post(
                f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}",
                json={
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {
                        "temperature": 0.7,
                        "maxOutputTokens": 300,
                    }
                },
            )
            if response.status_code == 200:
                data = response.json()
                return data["candidates"][0]["content"]["parts"][0]["text"].strip()
    except Exception:
        pass
    return None


def try_ollama(prompt: str) -> str | None:
    """Try to generate summary using local Ollama."""
    try:
        with httpx.Client(timeout=60.0) as client:
            response = client.post(
                f"{OLLAMA_URL}/api/generate",
                json={
                    "model": OLLAMA_MODEL,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "temperature": 0.7,
                        "num_predict": 300,
                    }
                },
            )
            if response.status_code == 200:
                return response.json().get("response", "").strip()
    except Exception:
        pass
    return None


def fallback_summary(profile_data: dict) -> str:
    """Fallback rule-based summary if no AI is available."""
    user = profile_data.get("user", {})
    languages = profile_data.get("languages", {})
    top_repos = profile_data.get("top_repos", [])
    stats = profile_data.get("stats", {})

    name = user.get("name") or user.get("login", "This developer")
    total_stars = stats.get("total_stars", 0)
    total_repos = stats.get("total_repos", 0)
    followers = user.get("followers", 0)
    top_langs = list(languages.keys())[:3]

    # Determine developer type
    lang_set = set(languages.keys())
    frontend = {"JavaScript", "TypeScript", "CSS", "HTML", "Vue", "Svelte"}
    backend = {"Python", "Java", "Go", "Ruby", "PHP", "C#", "Rust", "C++", "C"}

    if lang_set & frontend and lang_set & backend:
        dev_type = "full-stack developer"
    elif lang_set & frontend:
        dev_type = "frontend developer"
    elif lang_set & backend:
        dev_type = "backend developer"
    else:
        dev_type = "software developer"

    lang_str = ", ".join(top_langs) if top_langs else "various technologies"

    summary = f"{name} is a {dev_type} with expertise in {lang_str}."
    if user.get("location"):
        summary += f" Based in {user['location']}."

    summary += f"\n\nWith {total_repos} public repositories and {total_stars:,} total stars, "
    if total_stars >= 1000:
        summary += "they are a well-recognized contributor in the open source community."
    elif total_stars >= 100:
        summary += "they maintain an active presence in the developer community."
    else:
        summary += "they are building their presence on GitHub."

    if top_repos and top_repos[0].get("stars", 0) > 0:
        summary += f" Their top project, {top_repos[0]['name']}, has earned {top_repos[0]['stars']:,} stars."

    return summary
