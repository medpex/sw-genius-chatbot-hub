const http = require('http');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data', 'knowledge.json');

function loadKnowledge() {
  try {
    const raw = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function saveKnowledge(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  if (req.url === '/api/knowledge' && req.method === 'GET') {
    const data = loadKnowledge();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
    return;
  }

  if (req.url === '/api/knowledge' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      try {
        const item = JSON.parse(body);
        const data = loadKnowledge();
        data.push(item);
        saveKnowledge(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(item));
      } catch {
        res.writeHead(400);
        res.end('Invalid payload');
      }
    });
    return;
  }

  const matchId = req.url.match(/^\/api\/knowledge\/(\d+)$/);
  if (matchId && req.method === 'PUT') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      try {
        const item = JSON.parse(body);
        const data = loadKnowledge();
        const idx = parseInt(matchId[1], 10);
        if (data[idx]) {
          data[idx] = item;
          saveKnowledge(data);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(item));
        } else {
          res.writeHead(404);
          res.end('Not found');
        }
      } catch {
        res.writeHead(400);
        res.end('Invalid payload');
      }
    });
    return;
  }

  if (matchId && req.method === 'DELETE') {
    const data = loadKnowledge();
    const idx = parseInt(matchId[1], 10);
    if (data[idx]) {
      const removed = data.splice(idx, 1)[0];
      saveKnowledge(data);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(removed));
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
    return;
  }

  if (req.url.startsWith('/api/ask') && req.method === 'GET') {
    const urlObj = new URL(req.url, `http://${req.headers.host}`);
    const q = urlObj.searchParams.get('q') || '';
    const data = loadKnowledge();
    const match = data.find(item => q.toLowerCase().includes(item.question.toLowerCase()));
    const answer = match ? match.answer : 'Leider habe ich darauf keine passende Antwort.';
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ answer }));
    return;
  }

  if (req.url === '/api/crawl' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const { url } = JSON.parse(body);
        const qa = {
          question: `Beispiel Frage zu ${url}`,
          answer: `Beispiel Antwort generiert aus den Inhalten von ${url}.`,
          category: 'Allgemein'
        };
        const data = loadKnowledge();
        data.push(qa);
        saveKnowledge(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(qa));
      } catch (err) {
        res.writeHead(400);
        res.end('Invalid payload');
      }
    });
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});