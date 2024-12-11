import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [newTodo, setNewTodo] = useState<string>("");

  useEffect(() => {
    const fetchTodos = async () => {
        try {
          const response = await axios.get<Todo[]>("https://jsonplaceholder.typicode.com/todos");
          console.log(response)
          setTodos(response.data.slice(0, 20));
        }  catch (error) {
        console.error("Failed to fetch todos", error);
      }
    };

    const savedTodos = localStorage.getItem("todos");
    console.log(savedTodos)
    if (savedTodos && JSON.parse(savedTodos).length > 0) {
      setTodos(JSON.parse(savedTodos));
    } else {
      fetchTodos();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim() === "") {
      alert("Please enter a title for the to-do item.");
      return;
    }

    const newTodoItem: Todo = {
      userId: 1,
      id: todos.length + 1,
      title: newTodo,
      completed: false,
    };

    setTodos([newTodoItem, ...todos]);
    setNewTodo("");
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === "completed") return todo.completed;
    if (filter === "pending") return !todo.completed;
    return true;
  });

  return (
    <div className="App">
      <h1>To-Do List</h1>

      <div className="todo-input">
        <input
          type="text"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          placeholder="Add a new to-do..."
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <div className="filters">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
        <button onClick={() => setFilter("pending")}>Pending</button>
      </div>

      <ul className="todo-list">
        {filteredTodos.map(todo => (
          <li key={todo.id} className={todo.completed ? "completed" : ""}>
            <span
              onClick={() => toggleTodo(todo.id)}
              style={{ cursor: "pointer" }}
            >
              {todo.title}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
