import asyncio
import httpx
import uuid
from datetime import datetime
from sqlalchemy import text
from app.core.db import engine

async def sync_github_repositories():
    """
    Background sync task: Fetches repositories owned by Bashar-1216.
    Only imports and displays repositories that are tagged with the 'portfolio' or 'featured' topic on GitHub.
    """
    print("Starting GitHub Repository stats synchronization for portfolio-tagged projects...")
    url = "https://api.github.com/users/Bashar-1216/repos?sort=updated&per_page=100"
    headers = {"User-Agent": "bashar-ai-portfolio"}
    
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(url, headers=headers, timeout=10.0)
            if res.status_code != 200:
                print(f"Failed to fetch GitHub repos: {res.status_code}")
                return
            repos = res.json()
    except Exception as e:
        print(f"Error connecting to GitHub API: {e}")
        return

    curated_baseline_slugs = {
        "sapa", 
        "geo-platform", 
        "drowsiness-detection", 
        "fraud-detection", 
        "sentiment-analysis"
    }

    async with engine.connect() as conn:
        for repo in repos:
            name = repo.get("name", "")
            if not name or name == "Bashar-1216":
                continue
                
            slug = name.lower().replace("_", "-")
            topics = [t.lower() for t in repo.get("topics", [])]
            
            # Check if repo has 'portfolio' or 'featured' topic tag on GitHub, or is in curated baseline
            is_portfolio_tagged = ("portfolio" in topics) or ("featured" in topics) or (slug in curated_baseline_slugs)
            
            if not is_portfolio_tagged:
                continue

            github_url = repo.get("html_url", f"https://github.com/Bashar-1216/{name}")
            title = name.replace("-", " ").replace("_", " ").title()
            raw_desc = repo.get("description") or f"Engineering project repository for {title}."
            desc = raw_desc[:500]
            stars = repo.get("stargazers_count", 0)
            forks = repo.get("forks_count", 0)
            lang = repo.get("language") or "Python"
            open_issues = repo.get("open_issues_count", 0)
            homepage = repo.get("homepage") or ""
            
            pushed_at_str = repo.get("pushed_at", "")
            try:
                pushed_date = datetime.strptime(pushed_at_str, "%Y-%m-%dT%H:%M:%SZ") if pushed_at_str else datetime.utcnow()
            except Exception:
                pushed_date = datetime.utcnow()
            formatted_date = pushed_date.strftime("%b %d, %Y")

            repo_path = f"Bashar-1216/{name}"

            # Upsert into Project table
            check_proj = await conn.execute(
                text('SELECT id FROM "Project" WHERE slug = :slug'),
                {"slug": slug}
            )
            existing_proj = check_proj.fetchone()

            if not existing_proj:
                proj_id = uuid.uuid4()
                await conn.execute(
                    text('INSERT INTO "Project" (id, slug, title_en, title_ar, description_en, description_ar, github_url, live_url, published_at, featured) '
                         'VALUES (:id, :slug, :title, :title, :desc, :desc, :github_url, :live_url, NOW(), true)'),
                    {
                        "id": proj_id,
                        "slug": slug,
                        "title": title,
                        "desc": desc,
                        "github_url": github_url,
                        "live_url": homepage if homepage.startswith("http") else None
                    }
                )
            else:
                await conn.execute(
                    text('UPDATE "Project" SET github_url = :github_url, live_url = COALESCE(:live_url, live_url) WHERE slug = :slug'),
                    {
                        "slug": slug,
                        "github_url": github_url,
                        "live_url": homepage if homepage.startswith("http") else None
                    }
                )

            # Upsert into GithubRepository cache table
            check_repo = await conn.execute(
                text('SELECT id FROM "GithubRepository" WHERE repo_name = :name'),
                {"name": repo_path}
            )
            existing_repo = check_repo.fetchone()

            if existing_repo:
                await conn.execute(
                    text('UPDATE "GithubRepository" SET stars = :stars, forks = :forks, language = :lang, '
                         'last_commit = :last, open_issues = :issues, updated_at = NOW() WHERE repo_name = :name'),
                    {
                        "name": repo_path,
                        "stars": stars,
                        "forks": forks,
                        "lang": lang,
                        "last": formatted_date,
                        "issues": open_issues
                    }
                )
            else:
                await conn.execute(
                    text('INSERT INTO "GithubRepository" (id, repo_name, stars, forks, language, last_commit, open_issues, updated_at) '
                         'VALUES (:id, :name, :stars, :forks, :lang, :last, :issues, NOW())'),
                    {
                        "id": uuid.uuid4(),
                        "name": repo_path,
                        "stars": stars,
                        "forks": forks,
                        "lang": lang,
                        "last": formatted_date,
                        "issues": open_issues
                    }
                )

        await conn.commit()
    print("GitHub portfolio sync completed successfully!")

if __name__ == "__main__":
    asyncio.run(sync_github_repositories())
