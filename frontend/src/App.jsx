import { useEffect, useState } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import EditTodoModal from './components/EditTodoModal';

function sortByCreatedAtDesc(items) {
  return [...items].sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt) : new Date(0);
    const bTime = b.createdAt ? new Date(b.createdAt) : new Date(0);
    return bTime - aTime;
  });
}

export default function App() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // No external API; start with empty list or static sample
  useEffect(() => {
    // initialize with empty list; could add sample data here
    setTodos([]);
  }, []);

  const handleAdd = (title, description) => {
    const newTodo = {
      id: Date.now(),
      title,
      description,
      createdAt: new Date().toISOString(),
    };
    setTodos(prev => sortByCreatedAtDesc([...prev, newTodo]));
  };

  const handleUpdate = (id, payload) => {
    setIsSavingEdit(true);
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, ...payload } : t))
    );
    setEditingTodo(null);
    setIsSavingEdit(false);
  };

  const handleDelete = (id) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const handleReorder = (sourceId, targetId) => {
    setTodos((previousTodos) => {
      const nextTodos = [...previousTodos];
      const sourceIndex = nextTodos.findIndex((todo) => String(todo.id) === String(sourceId));
      const targetIndex = nextTodos.findIndex((todo) => String(todo.id) === String(targetId));

      if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex) {
        return previousTodos;
      }

      const [movedTodo] = nextTodos.splice(sourceIndex, 1);
      nextTodos.splice(targetIndex, 0, movedTodo);
      return nextTodos;
    });
  };

  return (
    <div className="app-container">
      <h1>Todo App</h1>
      {error ? <div className="error-msg">{error}</div> : null}
      <TodoForm onAdd={handleAdd} />
      <TodoList
        todos={todos}
        onEdit={setEditingTodo}
        onDelete={handleDelete}
        onReorder={handleReorder}
      />
      <EditTodoModal
        todo={editingTodo}
        isSaving={isSavingEdit}
        onClose={() => {
          if (!isSavingEdit) {
            setEditingTodo(null);
          }
        }}
        onSave={handleUpdate}
      />
    </div>
  );
}
