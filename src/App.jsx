import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [username, setUsername] = useState('');
  const [tempUsername, setTempUsername] = useState('');

  const initializeUser = useCallback(() => {
    if (!username) return;

    fetch(`https://playground.4geeks.com/apis/fake/todos/user/${username}`)
      .then(resp => {
        if (resp.status === 404) {
          return fetch(`https://playground.4geeks.com/apis/fake/todos/user/${username}`, {
            method: "POST",
            body: JSON.stringify([]),
            headers: {
              "Content-Type": "application/json"
            }
          })
          .then(() => {
            setTasks(['example task']);
          });
        } else {
          return resp.json();
        }
      })
      .then(data => {
        if (Array.isArray(data)) {
          setTasks(data.map(item => item.label));
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, [username]);

  useEffect(() => {
    if (username) {
      initializeUser();
    }
  }, [username]);

  const handleAddTask = () => {
    if (newTask.trim() !== '') {
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      setNewTask('');
      updateTasksOnServer(updatedTasks);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
    updateTasksOnServer(updatedTasks);
  };

  const updateTasksOnServer = (updatedTasks) => {
    fetch(`https://playground.4geeks.com/apis/fake/todos/user/${username}`, {
      method: "PUT",
      body: JSON.stringify(updatedTasks.map(task => ({ label: task, done: false }))),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(resp => {
        console.log(resp.ok);
        console.log(resp.status);
        console.log(resp.text());
        return resp.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.log(error);
    });
  };

  const handleClearAllTasksAndDeleteUser = () => {
    fetch(`https://playground.4geeks.com/apis/fake/todos/user/${username}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(resp => resp.json())
    .then(data => {
      setTasks([]);
      setUsername('');
      setTempUsername('');
    })
    .catch(error => {
      console.log(error);
    });
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card w-50 stacked-pages p-3 mb-5 bg-white">
        <div className="card-body">
          <h1 className="card-title text-center">Todos</h1>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter username"
              value={tempUsername}
              onChange={(e) => setTempUsername(e.target.value)}
            />
            <div className="input-group-append">
              <button className="btn btn-outline-secondary" onClick={() => { setUsername(tempUsername); }}>Login</button>
            </div>
          </div>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Add task"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <div className="input-group-append">
              <button className="btn btn-outline-secondary" onClick={handleAddTask}>Add</button>
            </div>
          </div>
          <ul className="list-group">
            {tasks.map((task, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                {task}
                <button className="btn btn-sm" style={{ background: 'none', border: 'none' }} onClick={() => handleDeleteTask(index)}>
                  <i className="fas fa-trash" style={{ color: '#555' }}></i>
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-3 text-center">
            {tasks.length} left to do
          </div>
          <div className="mt-3 text-center">
            <button className="btn btn-secondary" onClick={handleClearAllTasksAndDeleteUser}>Clear All Tasks and Delete User</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
