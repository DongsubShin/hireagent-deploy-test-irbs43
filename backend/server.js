const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  if (req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    return;
  }

  // Serve static frontend files
  const publicDir = path.join(__dirname, 'dist', 'public');
  let filePath = req.url === '/' ? '/index.html' : req.url;
  const fullPath = path.join(publicDir, filePath);

  if (fs.existsSync(fullPath)) {
    const ext = path.extname(fullPath);
    const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript' };
    res.writeHead(200, { 'Content-Type': types[ext] || 'text/plain' });
    res.end(fs.readFileSync(fullPath));
  } else {
    // SPA fallback
    const index = path.join(publicDir, 'index.html');
    if (fs.existsSync(index)) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(fs.readFileSync(index));
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<h1>HireAgent Deploy Test - OK</h1><p>Backend running on port ' + PORT + '</p>');
    }
  }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
