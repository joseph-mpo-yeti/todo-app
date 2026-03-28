const app = require('../server');
const assert = require('assert');
const logger = require('../logger');

const runStep = async (name, fn) => {
  try {
    await fn();
    logger.info(`PASS: ${name}`);
  } catch (error) {
    logger.error(`FAIL: ${name}`, { errorMessage: error.message });
    throw error;
  }
};

// Start server on an arbitrary free port
const server = app.listen(0, '127.0.0.1', async () => {
  const port = server.address().port;
  const base = `http://127.0.0.1:${port}`;
  logger.info(`Running tests on ${base}`);
  let exitCode = 0;

  try {
    // Helper for JSON fetch
    const jsonFetch = async (url, opts = {}) => {
      const res = await fetch(url, { ...opts, headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) } });
      const data = await res.json().catch(() => ({}));
      return { res, data };
    };

    let todoId;

    await runStep('Create todo', async () => {
      const { res, data } = await jsonFetch(`${base}/api/todos`, { method: 'POST', body: JSON.stringify({ title: 'Test', description: 'Desc' }) });
      assert.strictEqual(res.status, 201, 'POST should return 201');
      assert.ok(data.id, 'Created todo has id');
      todoId = data.id;
    });

    await runStep('Get all todos', async () => {
      const { res, data } = await jsonFetch(`${base}/api/todos`);
      assert.strictEqual(res.status, 200, 'GET should return 200');
      assert.ok(Array.isArray(data), 'GET returns array');
      assert.ok(data.find(t => t.id === todoId), 'Created todo present');
    });

    await runStep('Update todo', async () => {
      const { res, data } = await jsonFetch(`${base}/api/todos/${todoId}`, { method: 'PUT', body: JSON.stringify({ title: 'Updated' }) });
      assert.strictEqual(res.status, 200, 'PUT should return 200');
      assert.strictEqual(data.title, 'Updated', 'Title updated');
    });

    await runStep('Delete todo', async () => {
      const { res } = await jsonFetch(`${base}/api/todos/${todoId}`, { method: 'DELETE' });
      assert.strictEqual(res.status, 200, 'DELETE should return 200');
    });

    await runStep('Verify deletion', async () => {
      const { res, data } = await jsonFetch(`${base}/api/todos`);
      assert.strictEqual(res.status, 200);
      assert.ok(!data.find(t => t.id === todoId), 'Todo removed');
    });

    logger.info('Test run successful: all tests passed');
  } catch (e) {
    exitCode = 1;
    logger.error('Test run failed', { errorMessage: e.message });
  } finally {
    server.close(() => process.exit(exitCode));
  }
});
