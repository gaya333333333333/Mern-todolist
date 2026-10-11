import { useState, useEffect } from "react";
import axios from "axios";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

// Address of the backend API (can be changed in a .env file)
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api/tasks";

// Pull the best message out of a failed request
function errorText(err, fallback) {
  if (err.response?.data?.message) return err.response.data.message;
  if (err.code === "ERR_NETWORK") return "Cannot reach the server. Is the backend running?";
  return fallback;
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // B2: fetch all tasks from the backend when the page loads
  useEffect(() => {
    axios
      .get(API)
      .then((res) => setTasks(res.data))
      .catch((err) => setError(errorText(err, "Could not load tasks")))
      .finally(() => setLoading(false));
  }, []);

  // B3: POST a new task, then add it to the list
  async function addTask(title) {
    try {
      const res = await axios.post(API, { title });
      setTasks((prev) => [...prev, res.data]);
      setError("");
      return true;
    } catch (err) {
      setError(errorText(err, "Could not add the task"));
      return false;
    }
  }

  // B4: PUT to flip completed, then swap the updated task into the list
  async function toggleTask(task) {
    try {
      const res = await axios.put(`${API}/${task._id}`, { completed: !task.completed });
      setTasks((prev) => prev.map((t) => (t._id === task._id ? res.data : t)));
      setError("");
    } catch (err) {
      setError(errorText(err, "Could not update the task"));
    }
  }

  // B5: DELETE a task, then remove it from the list
  async function deleteTask(id) {
    try {
      await axios.delete(`${API}/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      setError("");
    } catch (err) {
      setError(errorText(err, "Could not delete the task"));
    }
  }

  const remaining = tasks.filter((t) => !t.completed).length;

  return (
    <main className="app">
      <h1>To-Do List</h1>
      <p className="subtitle">Saved in MongoDB, so your tasks are still here after a refresh.</p>

      <TaskForm onAdd={addTask} />

      {error && <p className="error" role="alert">{error}</p>}
      {loading ? (
        <p className="empty">Loading tasks...</p>
      ) : (
        <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />
      )}

      {!loading && tasks.length > 0 && (
        <p className="count">{remaining} of {tasks.length} tasks left</p>
      )}
    </main>
  );
}

export default App;
