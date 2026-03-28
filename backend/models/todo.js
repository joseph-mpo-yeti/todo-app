/**
 * Simple in‑memory Todo model.
 * Each Todo has { id: number, title: string, description?: string }.
 */

let todos = [];
let nextId = 1;

function getAll() {
  return todos;
}

function create({ title, description = '' }) {
  const todo = { id: nextId++, title, description, createdAt: new Date().toISOString() };
  todos.push(todo);
  return todo;
}

function find(id) {
  return todos.find(t => t.id === id);
}

function update(id, { title, description }) {
  const todo = find(id);
  if (!todo) return null;
  if (title !== undefined) todo.title = title;
  if (description !== undefined) todo.description = description;
  return todo;
}

function remove(id) {
  const idx = todos.findIndex(t => t.id === id);
  if (idx === -1) return null;
  const [removed] = todos.splice(idx, 1);
  return removed;
}

module.exports = {
  getAll,
  create,
  find,
  update,
  remove,
};

