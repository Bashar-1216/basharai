import asyncio
from sqlalchemy import text
from app.core.db import engine
from app.core.github import fetch_github_repo_stats

async def sync_github_repositories():
    print("Starting GitHub Repository stats synchronization background task...")
    
    async with engine.connect() as conn:
        # Fetch all project github repos from database
        proj_res = await conn.execute(
            text('SELECT github_url FROM "Project" WHERE github_url IS NOT NULL')
        )
        repos = proj_res.fetchall()
        
        # Clean paths and remove duplicates
        repo_paths = set()
        for r in repos:
            path = r[0].replace("https://github.com/", "").replace("http://github.com/", "").strip()
            if path and "/" in path:
                repo_paths.add(path)
                
        print(f"Discovered {len(repo_paths)} repositories to sync: {repo_paths}")
        
        for path in repo_paths:
            print(f"Syncing stats for: {path}...")
            stats = await fetch_github_repo_stats(path)
            
            # Upsert stats into GithubRepository cache table
            # Check if exists
            check_res = await conn.execute(
                text('SELECT id FROM "GithubRepository" WHERE repo_name = :name'),
                {"name": path}
            )
            existing = check_res.fetchone()
            
            if existing:
                await conn.execute(
                    text('UPDATE "GithubRepository" SET stars = :stars, forks = :forks, language = :lang, '
                         'last_commit = :last, open_issues = :issues, updated_at = NOW() WHERE repo_name = :name'),
                    {
                        "name": path,
                        "stars": stats.get("stars", 0),
                        "forks": stats.get("forks", 0) if "forks" in stats else 0,
                        "lang": stats.get("language", "Python"),
                        "last": stats.get("last_commit", "Jul 08, 2026"),
                        "issues": stats.get("open_issues", 0) if "open_issues" in stats else 0
                    }
                )
            else:
                import uuid
                await conn.execute(
                    text('INSERT INTO "GithubRepository" (id, repo_name, stars, forks, language, last_commit, open_issues, updated_at) '
                         'VALUES (:id, :name, :stars, :forks, :lang, :last, :issues, NOW())'),
                    {
                        "id": uuid.uuid4(),
                        "name": path,
                        "stars": stats.get("stars", 0),
                        "forks": stats.get("forks", 0) if "forks" in stats else 0,
                        "lang": stats.get("language", "Python"),
                        "last": stats.get("last_commit", "Jul 08, 2026"),
                        "issues": stats.get("open_issues", 0) if "open_issues" in stats else 0
                    }
                )
            print(f"Successfully synced: {path} (Stars: {stats.get('stars', 0)})")
            
        await conn.commit()
    print("GitHub repositories sync completed successfully!")

if __name__ == "__main__":
    asyncio.run(sync_github_repositories())
