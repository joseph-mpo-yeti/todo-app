import { useEffect, useState } from 'react';

export default function EditTodoModal({ todo, isSaving, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    setTitle(todo?.title ?? '');
    setDescription(todo?.description ?? '');
  }, [todo]);

  useEffect(() => {
    if (!todo) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !isSaving) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [todo, isSaving, onClose]);

  if (!todo) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isSaving) {
      return;
    }

    if (title.trim() === '' || description.trim() === '') {
      alert('Both title and description are required');
      return;
    }

    onSave(todo.id, {
      title: title.trim(),
      description: description.trim(),
    });
  };

  return (
    <div className="modal-overlay" onClick={() => !isSaving && onClose()}>
      <div className="modal-card" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <h2>Edit Todo</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          <label className="modal-field">
            Title
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              disabled={isSaving}
            />
          </label>
          <label className="modal-field">
            Description
            <input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={isSaving}
            />
          </label>
          <div className="modal-actions">
            <button type="button" className="modal-btn secondary" onClick={onClose} disabled={isSaving}>
              Cancel
            </button>
            <button type="submit" className="modal-btn primary" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
