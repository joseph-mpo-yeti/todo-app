const request = require('supertest');
const app = require('../server');

describe('Todo API', () => {
  let createdId;

  test('POST /api/todos creates a todo', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({ title: 'Test Todo', description: 'Test description' })
      .expect(201)
      .expect('Content-Type', /json/);
    expect(res.body).toMatchObject({ title: 'Test Todo', description: 'Test description' });
    expect(res.body.id).toBeDefined();
    createdId = res.body.id;
  });

  test('GET /api/todos returns list including created', async () => {
    const res = await request(app).get('/api/todos').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    const found = res.body.find(t => t.id === createdId);
    expect(found).toBeDefined();
    expect(found.title).toBe('Test Todo');
  });

  test('PUT /api/todos/:id updates a todo', async () => {
    const res = await request(app)
      .put(`/api/todos/${createdId}`)
      .send({ title: 'Updated Title' })
      .expect(200);
    expect(res.body.title).toBe('Updated Title');
  });

  test('DELETE /api/todos/:id removes a todo', async () => {
    await request(app).delete(`/api/todos/${createdId}`).expect(200);
    const res = await request(app).get('/api/todos').expect(200);
    const found = res.body.find(t => t.id === createdId);
    expect(found).toBeUndefined();
  });
});

