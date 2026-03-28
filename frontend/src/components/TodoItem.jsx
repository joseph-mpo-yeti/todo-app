export default function TodoItem({
  todo,
  onEdit,
  onDelete,
  isDragReady,
  isDragging,
  isDropTarget,
  onPressStart,
  onPressEnd,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}) {
  const dragClassName = [
    'todo',
    isDragReady ? 'todo-drag-ready' : '',
    isDragging ? 'todo-dragging' : '',
    isDropTarget ? 'todo-drop-target' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <li
      className={dragClassName}
      draggable={isDragReady}
      onPointerDown={onPressStart}
      onPointerUp={onPressEnd}
      onPointerLeave={onPressEnd}
      onPointerCancel={onPressEnd}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      title="Hold and drag to reorder"
    >
      <div>
        <strong>{todo.title}</strong>: {todo.description}
      </div>
      <div>
        <button onClick={() => onEdit(todo)}>Edit</button>
        <button onClick={() => onDelete(todo.id)}>Delete</button>
      </div>
    </li>
  );
}
