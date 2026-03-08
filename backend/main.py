import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx

from github_api import analyze_github_profile
from ai_summary import generate_developer_summary

# Load environment variables
load_dotenv()

app = FastAPI(
    title="GitHub Profile Analyzer",
    description="Analyze GitHub profiles with AI-powered insights",
    version="1.0.0",
)

# Configure CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Health check endpoint."""
    return {"status": "ok", "message": "GitHub Profile Analyzer API"}


@app.get("/api/analyze/{username}")
async def analyze_profile(username: str):
    """
    Analyze a GitHub user's profile.

    Returns:
        - user: Basic profile information
        - languages: Language distribution percentages
        - top_repos: Top repositories by stars
        - commit_activity: Weekly commit activity for the past year
        - stats: Aggregated statistics
        - ai_summary: AI-generated profile summary
    """
    try:
        # Fetch GitHub data
        profile_data = await analyze_github_profile(username)

        # Generate AI summary
        ai_summary = generate_developer_summary(profile_data)
        profile_data["ai_summary"] = ai_summary

        return profile_data

    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            raise HTTPException(status_code=404, detail=f"User '{username}' not found")
        elif e.response.status_code == 403:
            raise HTTPException(status_code=429, detail="GitHub API rate limit exceeded. Try again later or add a GITHUB_TOKEN.")
        else:
            raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing profile: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
