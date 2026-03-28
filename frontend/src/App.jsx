import { useEffect, useState } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import EditTodoModal from './components/EditTodoModal';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from './api';

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

  const loadTodos = async () => {
    setError('');
    try {
      const data = await fetchTodos();
      setTodos(sortByCreatedAtDesc(data));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleAdd = async (title, description) => {
    setError('');
    try {
      await createTodo({ title, description });
      await loadTodos();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (id, payload) => {
    setError('');
    setIsSavingEdit(true);
    try {
      await updateTodo(id, payload);
      setEditingTodo(null);
      await loadTodos();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await deleteTodo(id);
      await loadTodos();
    } catch (err) {
      setError(err.message);
    }
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
