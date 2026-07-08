import os
import httpx
from datetime import datetime

async def fetch_github_repo_stats(repo_path: str) -> dict:
    """
    Fetch repository statistics (stars, primary language, last update) from GitHub API.
    repo_path: e.g. "Bashar-1216/SAPA"
    """
    # Remove full github URL prefixes if present
    repo_path = repo_path.replace("https://github.com/", "").replace("http://github.com/", "").strip()
    
    url = f"https://api.github.com/repos/{repo_path}"
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "bashar-ai-portfolio-agent"
    }
    
    # Optional GITHUB_TOKEN in env to bypass anonymous rate limits
    token = os.getenv("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"token {token}"
        
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(url, headers=headers, timeout=5.0)
            if res.status_code == 200:
                data = res.json()
                # Parse date
                pushed_at_str = data.get("pushed_at", "")
                pushed_date = datetime.strptime(pushed_at_str, "%Y-%m-%dT%H:%M:%SZ") if pushed_at_str else datetime.utcnow()
                formatted_date = pushed_date.strftime("%b %d, %Y")
                
                return {
                    "stars": data.get("stargazers_count", 0),
                    "language": data.get("language", "Python"),
                    "last_commit": formatted_date,
                    "success": True
                }
            else:
                print(f"GitHub API returned status {res.status_code} for {repo_path}")
    except Exception as e:
        print(f"Failed to fetch GitHub stats: {e}")
        
    # Standard fallback values if GitHub API fails
    return {
        "stars": 4,
        "language": "Python",
        "last_commit": "Jul 08, 2026",
        "success": False
    }
