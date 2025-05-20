const http = require('http');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data', 'knowledge.json');
const configPath = path.join(__dirname, 'data', 'config.json');

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

function loadConfig() {
  try {
    const raw = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return { ollamaUrl: 'http://localhost:11434', model: 'llama2' };
  }
}

function saveConfig(cfg) {
  fs.writeFileSync(configPath, JSON.stringify(cfg, null, 2));
}

async function proxyOllamaGenerate(prompt, cfg) {
  const res = await fetch(`${cfg.ollamaUrl}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: cfg.model, prompt })
  });
  const text = await res.text();
  let answer = '';
  for (const line of text.trim().split('\n')) {
    try {
      const obj = JSON.parse(line);
      if (obj.response) answer += obj.response;
    } catch {
      // ignore
    }
  }
  return answer.trim();
}

async function proxyOllamaModels(cfg) {
  const res = await fetch(`${cfg.ollamaUrl}/api/tags`);
  const data = await res.json();
  return data.models || data;
}

const server = http.createServer(async (req, res) => {
  const cfg = loadConfig();

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
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

  if (req.url === '/api/config' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(cfg));
    return;
  }

  if (req.url === '/api/config' && req.method === 'PUT') {
    let body = '';
    req.on('data', c => (body += c));
    req.on('end', () => {
      try {
        const upd = JSON.parse(body);
        const newCfg = { ...cfg, ...upd };
        saveConfig(newCfg);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newCfg));
      } catch (err) {
        res.writeHead(400);
        res.end('Invalid payload');
      }
    });
    return;
  }

  if (req.url === '/api/models' && req.method === 'GET') {
    try {
      const models = await proxyOllamaModels(cfg);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(models));
    } catch (err) {
      res.writeHead(500);
      res.end('Failed to fetch models');
    }
    return;
  }

  if (req.url.startsWith('/api/ask') && req.method === 'GET') {
    const urlObj = new URL(req.url, `http://${req.headers.host}`);
    const q = urlObj.searchParams.get('q') || '';
    try {
      const knowledge = loadKnowledge();
      const kb = knowledge
        .map(k => `Frage: ${k.question}\nAntwort: ${k.answer}`)
        .join('\n');
      const prompt = `${kb}\n\nFrage: ${q}\nAntwort:`;
      const answer = await proxyOllamaGenerate(prompt, cfg);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ answer }));
    } catch (err) {
      res.writeHead(500);
      res.end('Failed to query Ollama');
    }
    return;
  }

  if (req.url === '/api/crawl' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', async () => {
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
