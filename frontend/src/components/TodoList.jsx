import { useEffect, useRef, useState } from 'react';
import TodoItem from './TodoItem';

const HOLD_DELAY_MS = 220;

export default function TodoList({ todos, onEdit, onDelete, onReorder }) {
  const holdTimerRef = useRef(null);
  const [dragReadyId, setDragReadyId] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const [dropTargetId, setDropTargetId] = useState(null);

  const clearHoldTimer = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearHoldTimer();
    };
  }, []);

  const handlePressStart = (event, todoId) => {
    if (event.target.closest('button')) {
      return;
    }

    clearHoldTimer();
    holdTimerRef.current = setTimeout(() => {
      setDragReadyId(todoId);
    }, HOLD_DELAY_MS);
  };

  const handlePressEnd = () => {
    clearHoldTimer();
    if (!draggingId) {
      setDragReadyId(null);
    }
  };

  const handleDragStart = (event, todoId) => {
    if (String(dragReadyId) !== String(todoId)) {
      event.preventDefault();
      return;
    }

    setDraggingId(todoId);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', String(todoId));
  };

  const handleDragOver = (event, todoId) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setDropTargetId(todoId);
  };

  const handleDrop = (event, targetId) => {
    event.preventDefault();
    const sourceId = draggingId ?? event.dataTransfer.getData('text/plain');

    if (!sourceId || String(sourceId) === String(targetId)) {
      return;
    }

    onReorder(sourceId, targetId);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDragReadyId(null);
    setDropTargetId(null);
    clearHoldTimer();
  };

  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onEdit={onEdit}
          onDelete={onDelete}
          isDragReady={String(dragReadyId) === String(todo.id)}
          isDragging={String(draggingId) === String(todo.id)}
          isDropTarget={String(dropTargetId) === String(todo.id) && String(draggingId) !== String(todo.id)}
          onPressStart={(event) => handlePressStart(event, todo.id)}
          onPressEnd={handlePressEnd}
          onDragStart={(event) => handleDragStart(event, todo.id)}
          onDragOver={(event) => handleDragOver(event, todo.id)}
          onDrop={(event) => handleDrop(event, todo.id)}
          onDragEnd={handleDragEnd}
        />
      ))}
    </ul>
  );
}
