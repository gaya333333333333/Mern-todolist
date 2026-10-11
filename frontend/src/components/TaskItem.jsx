// One row: checkbox (B4), title, delete button (B5)
function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className={task.completed ? "task done" : "task"}>
      <label className="task-main">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task)}
        />
        <span className="task-title">{task.title}</span>
      </label>
      <button
        className="delete-btn"
        onClick={() => onDelete(task._id)}
        aria-label={`Delete ${task.title}`}
      >
        Delete
      </button>
    </li>
  );
}

export default TaskItem;
