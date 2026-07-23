import os
import httpx
from datetime import datetime

async def fetch_github_repo_stats(repo_path: str) -> dict:
    """
    Fetch comprehensive repository metadata (stars, forks, language, topics, homepage, last commit) from GitHub API.
    repo_path: e.g. "Bashar-1216/SAPA"
    """
    # Clean repo path
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
                pushed_at_str = data.get("pushed_at", "")
                
                try:
                    pushed_date = datetime.strptime(pushed_at_str, "%Y-%m-%dT%H:%M:%SZ") if pushed_at_str else datetime.utcnow()
                except Exception:
                    pushed_date = datetime.utcnow()
                    
                formatted_date = pushed_date.strftime("%b %d, %Y")
                
                return {
                    "repo_name": data.get("full_name", repo_path),
                    "description": data.get("description", "") or "",
                    "stars": data.get("stargazers_count", 0),
                    "forks": data.get("forks_count", 0),
                    "open_issues": data.get("open_issues_count", 0),
                    "language": data.get("language") or "Python",
                    "homepage": data.get("homepage") or "",
                    "topics": data.get("topics", []),
                    "last_commit": formatted_date,
                    "last_commit_iso": pushed_at_str,
                    "success": True
                }
            else:
                print(f"GitHub API returned status {res.status_code} for {repo_path}")
    except Exception as e:
        print(f"Failed to fetch GitHub stats: {e}")
        
    # Standard fallback values if GitHub API fails
    return {
        "repo_name": repo_path,
        "description": "",
        "stars": 4,
        "forks": 0,
        "open_issues": 0,
        "language": "Python",
        "homepage": "",
        "topics": [],
        "last_commit": "Jul 08, 2026",
        "last_commit_iso": "",
        "success": False
    }
