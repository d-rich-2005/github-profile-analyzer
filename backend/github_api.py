import os
from datetime import datetime, timedelta
from typing import Optional
import httpx

GITHUB_API_BASE = "https://api.github.com"


def get_headers() -> dict:
    """Get headers for GitHub API requests."""
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    token = os.getenv("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return headers


async def fetch_user(username: str) -> dict:
    """Fetch basic user profile information."""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{GITHUB_API_BASE}/users/{username}",
            headers=get_headers(),
        )
        response.raise_for_status()
        data = response.json()
        return {
            "login": data.get("login"),
            "name": data.get("name"),
            "avatar_url": data.get("avatar_url"),
            "bio": data.get("bio"),
            "company": data.get("company"),
            "location": data.get("location"),
            "blog": data.get("blog"),
            "followers": data.get("followers", 0),
            "following": data.get("following", 0),
            "public_repos": data.get("public_repos", 0),
            "created_at": data.get("created_at"),
        }


async def fetch_repos(username: str, limit: int = 100) -> list:
    """Fetch user's repositories sorted by stars."""
    repos = []
    page = 1
    per_page = min(limit, 100)

    async with httpx.AsyncClient() as client:
        while len(repos) < limit:
            response = await client.get(
                f"{GITHUB_API_BASE}/users/{username}/repos",
                headers=get_headers(),
                params={
                    "sort": "updated",
                    "direction": "desc",
                    "per_page": per_page,
                    "page": page,
                },
            )
            response.raise_for_status()
            data = response.json()
            if not data:
                break
            repos.extend(data)
            page += 1
            if len(data) < per_page:
                break

    return repos[:limit]


async def calculate_languages(repos: list) -> dict:
    """Calculate language distribution from repositories."""
    language_bytes = {}

    async with httpx.AsyncClient() as client:
        for repo in repos[:30]:  # Limit to avoid rate limits
            if repo.get("fork"):
                continue
            languages_url = repo.get("languages_url")
            if languages_url:
                try:
                    response = await client.get(
                        languages_url,
                        headers=get_headers(),
                    )
                    if response.status_code == 200:
                        langs = response.json()
                        for lang, bytes_count in langs.items():
                            language_bytes[lang] = language_bytes.get(lang, 0) + bytes_count
                except Exception:
                    continue

    # Convert to percentages
    total = sum(language_bytes.values())
    if total == 0:
        return {}

    language_percentages = {
        lang: round((bytes_count / total) * 100, 1)
        for lang, bytes_count in sorted(
            language_bytes.items(),
            key=lambda x: x[1],
            reverse=True
        )
    }

    return language_percentages


def get_top_repos(repos: list, limit: int = 6) -> list:
    """Get top repositories by stars."""
    # Filter out forks and sort by stars
    owned_repos = [r for r in repos if not r.get("fork")]
    sorted_repos = sorted(owned_repos, key=lambda x: x.get("stargazers_count", 0), reverse=True)

    return [
        {
            "name": repo.get("name"),
            "description": repo.get("description"),
            "language": repo.get("language"),
            "stars": repo.get("stargazers_count", 0),
            "forks": repo.get("forks_count", 0),
            "url": repo.get("html_url"),
        }
        for repo in sorted_repos[:limit]
    ]


async def fetch_commit_activity(username: str, repos: list) -> list:
    """Fetch commit activity for the past year."""
    # Use commit activity from top repos
    activity_map = {}
    today = datetime.now()
    year_ago = today - timedelta(days=365)

    async with httpx.AsyncClient() as client:
        for repo in repos[:10]:  # Limit to avoid rate limits
            if repo.get("fork"):
                continue
            try:
                # Get commit activity stats
                response = await client.get(
                    f"{GITHUB_API_BASE}/repos/{username}/{repo['name']}/stats/commit_activity",
                    headers=get_headers(),
                    timeout=10.0,
                )
                if response.status_code == 200:
                    weeks = response.json()
                    if isinstance(weeks, list):
                        for week in weeks:
                            timestamp = week.get("week", 0)
                            week_date = datetime.fromtimestamp(timestamp)
                            if week_date >= year_ago:
                                week_str = week_date.strftime("%Y-%m-%d")
                                activity_map[week_str] = activity_map.get(week_str, 0) + week.get("total", 0)
            except Exception:
                continue

    # Convert to sorted list
    activity = [
        {"date": date, "count": count}
        for date, count in sorted(activity_map.items())
    ]

    return activity


async def fetch_contribution_stats(username: str, repos: list) -> dict:
    """Calculate contribution statistics."""
    total_stars = sum(r.get("stargazers_count", 0) for r in repos if not r.get("fork"))
    total_forks = sum(r.get("forks_count", 0) for r in repos if not r.get("fork"))
    total_repos = len([r for r in repos if not r.get("fork")])

    return {
        "total_stars": total_stars,
        "total_forks": total_forks,
        "total_repos": total_repos,
    }


async def analyze_github_profile(username: str) -> dict:
    """Main function to analyze a GitHub profile."""
    # Fetch user and repos
    user = await fetch_user(username)
    repos = await fetch_repos(username)

    # Calculate all metrics
    languages = await calculate_languages(repos)
    top_repos = get_top_repos(repos)
    commit_activity = await fetch_commit_activity(username, repos)
    stats = await fetch_contribution_stats(username, repos)

    return {
        "user": user,
        "languages": languages,
        "top_repos": top_repos,
        "commit_activity": commit_activity,
        "stats": stats,
    }
