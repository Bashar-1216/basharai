const https = require('https');

const options = {
  hostname: 'api.github.com',
  path: '/repos/andreiramani/pgvector_pgsql_windows/releases',
  method: 'GET',
  headers: {
    'User-Agent': 'NodeJS-Request'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      const releases = JSON.parse(data);
      console.log(`Fetched ${releases.length} releases.`);
      for (const release of releases) {
        console.log(`\nRelease: ${release.name} (${release.tag_name})`);
        if (release.assets) {
          for (const asset of release.assets) {
            console.log(`  - Asset: ${asset.name}`);
            console.log(`    URL: ${asset.browser_download_url}`);
          }
        }
      }
    } catch (err) {
      console.error("Error parsing JSON:", err.message);
      console.log("Raw response (first 200 chars):", data.substring(0, 200));
    }
  });
});

req.on('error', (e) => {
  console.error("Request error:", e);
});

req.end();
