import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Tasks from './components/Tasks';
import AddTask from './components/AddTask';
import About from './components/About';
import TaskDetails from './components/TaskDetails';

function App() {
  const [ showAddTask, setShowAddTask ] = useState(false);
  const [ tasks, setTasks ] = useState([])

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks();
      setTasks(tasksFromServer);
    }
    getTasks();
  }, [])

  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks');
    const data = await res.json();
    return data;
  }

  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`);
    const data = await res.json();
    return data;
  }

  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, { method: 'DELETE' });
    setTasks(tasks.filter((task) => task.id !== id));
  }

  const toggleReminder = async (id) => {
    const taskToUpdate = await fetchTask(id);
    const updatedTask = { ...taskToUpdate, reminder: !taskToUpdate.reminder };
    const res = await fetch(`http://localhost:5000/tasks/${id}`, { 
      method: 'PUT', 
      headers: {
        'Content-type': 'application/json' 
      },
      body: JSON.stringify(updatedTask)
     });
    const data = await res.json();
    setTasks(tasks.map((task) => task.id === id ? { ...task, reminder: data.reminder } : task))
  }

  const addTask = async (task) => {
    // console.log('hi ', task);
    // const id = Math.floor(Math.random() * 10000) + 1;
    // const newTask = { id, ...task };
    // setTasks([...tasks, newTask]);

    const res = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task)
    });

    const data = await res.json();
    setTasks([...tasks, data]);
  }

  return (
    <Router>
      <div className="container">
        <Header onAddTask={() => setShowAddTask(!showAddTask) } showAdd={showAddTask}></Header>
        <Routes>
          <Route path='/' element={
              <>
                { showAddTask && <AddTask onAdd={addTask} />}
                { tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} onAdd={addTask}></Tasks> : 'No Tasks To Show'}
              </>
          }> 
          </Route>
          <Route path='/about' element={<About/>}></Route>
          <Route path='/tasks/:id' element={<TaskDetails/>}></Route>
        </Routes>
        <Footer></Footer>
      </div>
    </Router>
  );
}

export default App;
