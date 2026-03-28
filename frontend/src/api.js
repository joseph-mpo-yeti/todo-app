async function parseResponse(res) {
  if (!res.ok) {
    throw new Error(`Failed: ${res.status}`);
  }
  return res.json();
}

export async function fetchTodos() {
  const res = await fetch('/api/todos');
  return parseResponse(res);
}

export async function createTodo({ title, description }) {
  const res = await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description }),
  });
  return parseResponse(res);
}

export async function updateTodo(id, payload) {
  const res = await fetch(`/api/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return parseResponse(res);
}

export async function deleteTodo(id) {
  const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' });
  return parseResponse(res);
}
