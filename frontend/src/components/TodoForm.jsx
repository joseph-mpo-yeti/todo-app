import { useState } from 'react';

export default function TodoForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const submit = () => {
    if (title.trim() === '' || description.trim() === '') {
      alert('Both title and description are required');
      return;
    }

    onAdd(title, description);
    setTitle('');
    setDescription('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    }
  };

  return (
    <form className="input-row" onSubmit={(e) => e.preventDefault()} onKeyDown={handleKeyDown}>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="button" onClick={submit}>
        Add
      </button>
    </form>
  );
}
