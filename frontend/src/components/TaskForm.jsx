import { useState } from "react";

// B3: form to add a task. The parent (App) does the API call via onAdd.
function TaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();                       // no page reload
    if (!title.trim()) return;                // ignore empty input

    setSaving(true);
    const added = await onAdd(title);         // true if the server accepted it
    if (added) setTitle("");                  // clear the input only on success
    setSaving(false);
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs doing?"
        aria-label="New task"
        maxLength={200}
      />
      <button type="submit" disabled={saving}>
        {saving ? "Adding..." : "Add task"}
      </button>
    </form>
  );
}

export default TaskForm;
