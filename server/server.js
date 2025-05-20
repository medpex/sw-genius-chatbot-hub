const http = require('http');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data', 'knowledge.json');
const configPath = path.join(__dirname, 'data', 'config.json');

function loadConfig() {
  try {
    const raw = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return { serverUrl: 'http://localhost:11434', model: 'llama2', temperature: 0.7 };
  }
}

function saveConfig(cfg) {
  fs.writeFileSync(configPath, JSON.stringify(cfg, null, 2));
}

function loadKnowledge() {
  try {
    const raw = fs.readFileSync(dataPath, 'utf8');
    const list = JSON.parse(raw);
    return list.map((item, idx) => ({ id: item.id ?? idx + 1, ...item }));
  } catch (err) {
    return [];
  }
}

function saveKnowledge(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch (err) {
        reject(err);
      }
    });
  });
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // --- Knowledge CRUD ---
  if (req.url === '/api/knowledge' && req.method === 'GET') {
    const data = loadKnowledge();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
    return;
  }

  if (req.url === '/api/knowledge' && req.method === 'POST') {
    parseBody(req)
      .then(body => {
        const data = loadKnowledge();
        const nextId = data.reduce((max, it) => Math.max(max, it.id), 0) + 1;
        const item = { id: nextId, question: body.question, answer: body.answer, category: body.category || 'Allgemein' };
        data.push(item);
        saveKnowledge(data);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(item));
      })
      .catch(() => {
        res.writeHead(400);res.end('Invalid payload');
      });
    return;
  }

  if (req.url.startsWith('/api/knowledge/') && req.method === 'PUT') {
    const id = parseInt(req.url.split('/').pop(), 10);
    parseBody(req)
      .then(body => {
        const data = loadKnowledge();
        const idx = data.findIndex(it => it.id === id);
        if (idx === -1) { res.writeHead(404); return res.end('Not found'); }
        data[idx] = { ...data[idx], ...body, id };
        saveKnowledge(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data[idx]));
      })
      .catch(() => { res.writeHead(400); res.end('Invalid payload'); });
    return;
  }

  if (req.url.startsWith('/api/knowledge/') && req.method === 'DELETE') {
    const id = parseInt(req.url.split('/').pop(), 10);
    const data = loadKnowledge();
    const idx = data.findIndex(it => it.id === id);
    if (idx === -1) { res.writeHead(404); return res.end('Not found'); }
    data.splice(idx, 1);
    saveKnowledge(data);
    res.writeHead(204);res.end();
    return;
  }

  // --- Config and models ---
  if (req.url === '/api/config' && req.method === 'GET') {
    const cfg = loadConfig();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(cfg));
    return;
  }

  if (req.url === '/api/config' && req.method === 'POST') {
    parseBody(req)
      .then(body => {
        const cfg = { ...loadConfig(), ...body };
        saveConfig(cfg);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(cfg));
      })
      .catch(() => { res.writeHead(400); res.end('Invalid payload'); });
    return;
  }

  if (req.url === '/api/models' && req.method === 'GET') {
    const models = ['llama2', 'mistral', 'gemma'];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(models));
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
    parseBody(req)
      .then(({ url }) => {
        const data = loadKnowledge();
        const nextId = data.reduce((m, it) => Math.max(m, it.id), 0) + 1;
        const qa = {
          id: nextId,
          question: `Beispiel Frage zu ${url}`,
          answer: `Beispiel Antwort generiert aus den Inhalten von ${url}.`,
          category: 'Allgemein'
        };
        data.push(qa);
        saveKnowledge(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(qa));
      })
      .catch(() => { res.writeHead(400); res.end('Invalid payload'); });
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
