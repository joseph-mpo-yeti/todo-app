const http = require('http');
const { URL } = require('url');
const todoModel = require('./models/todo');

function jsonResponse(res, status, data) {
  const payload = JSON.stringify(data);
  // Ensure consistent JSON responses
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' });
  res.end(payload);
}

// Helper to collect JSON body
// Parse JSON body; reject on malformed JSON
const getBody = async (req) => new Promise((resolve, reject) => {
  let data = '';
  req.on('data', chunk => data += chunk);
  req.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      resolve(parsed);
    } catch (e) {
      reject(new Error('Invalid JSON'));
    }
  });
});

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://localhost`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Only /api/todos handling
  if (!pathname.startsWith('/api/todos')) {
    res.writeHead(404);
    return res.end('Not Found');
  }

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    // Respond with allowed methods and headers
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' });
    return res.end();
  }

  if (method === 'GET' && pathname === '/api/todos') {
    return jsonResponse(res, 200, todoModel.getAll());
  }

  if (method === 'POST' && pathname === '/api/todos') {
    let body;
    try {
      body = await getBody(req);
    } catch (e) {
      return jsonResponse(res, 400, { error: e.message });
    }
    const { title, description } = body;
    if (!title) return jsonResponse(res, 400, { error: 'Title required' });
    const todo = todoModel.create({ title, description });
    return jsonResponse(res, 201, todo);
  }

  const idMatch = pathname.match(/^\/api\/todos\/(\d+)$/);
  if (!idMatch) {
    res.writeHead(404);
    return res.end('Not Found');
  }
  const id = parseInt(idMatch[1], 10);

  if (method === 'PUT') {
    let body;
    try {
      body = await getBody(req);
    } catch (e) {
      return jsonResponse(res, 400, { error: e.message });
    }
    const updated = todoModel.update(id, body);
    if (!updated) return jsonResponse(res, 404, { error: 'Not found' });
    return jsonResponse(res, 200, updated);
  }

  if (method === 'DELETE') {
    const removed = todoModel.remove(id);
    if (!removed) return jsonResponse(res, 404, { error: 'Not found' });
    return jsonResponse(res, 200, removed);
  }

  // Fallback
  res.writeHead(405);
  res.end('Method Not Allowed');
});


const PORT = process.env.PORT || 4000;
if (require.main === module) {
  server.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
}

module.exports = server;

