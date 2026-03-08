import os
from anthropic import Anthropic


def generate_developer_summary(profile_data: dict) -> str:
    """Generate an AI-powered developer profile summary using Claude."""
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        return "AI summary unavailable. Please configure ANTHROPIC_API_KEY."

    user = profile_data.get("user", {})
    languages = profile_data.get("languages", {})
    top_repos = profile_data.get("top_repos", [])
    stats = profile_data.get("stats", {})

    # Build context for Claude
    top_languages = list(languages.keys())[:5]
    repo_descriptions = [
        f"- {repo['name']}: {repo.get('description', 'No description')} ({repo.get('stars', 0)} stars)"
        for repo in top_repos[:5]
    ]

    prompt = f"""Based on this GitHub profile data, write a brief, engaging developer profile summary (2-3 paragraphs).

Developer: {user.get('name') or user.get('login')}
Bio: {user.get('bio') or 'Not provided'}
Location: {user.get('location') or 'Not specified'}
Company: {user.get('company') or 'Not specified'}

Stats:
- Public repositories: {stats.get('total_repos', 0)}
- Total stars received: {stats.get('total_stars', 0)}
- Total forks: {stats.get('total_forks', 0)}
- Followers: {user.get('followers', 0)}
- Following: {user.get('following', 0)}

Top Languages: {', '.join(top_languages) if top_languages else 'None detected'}

Notable Repositories:
{chr(10).join(repo_descriptions) if repo_descriptions else 'No public repositories'}

Write a professional but friendly summary that:
1. Highlights their technical strengths based on languages and projects
2. Notes any interesting patterns in their work
3. Gives an overall impression of the developer's focus and expertise

Keep it concise and insightful. Do not use phrases like "Based on the data" or "According to their profile"."""

    try:
        client = Anthropic(api_key=api_key)
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=500,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        return message.content[0].text
    except Exception as e:
        return f"Unable to generate AI summary: {str(e)}"
