import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';


const URL = 'http://localhost/ostoslista/';

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    axios.get(URL)
      .then((response) => {
        setTasks(response.data);
      }).catch(error => {
        alert(error.response ? error.response.data.error : error);
      })
  }, [])

  function save(e) {
    e.preventDefault();
    const json = JSON.stringify({description:task, amount:amount})
    console.log(json)
    axios.post(URL + 'add.php', json, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        setTasks(tasks => [...tasks, response.data]);
        setTask('');
        setAmount('');
      }).catch(error => {
        alert(error.response.data.error);
      });
  }

  function remove(id) {
    const json = JSON.stringify({ id: id })
    axios.post(URL + 'delete.php', json, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        const newListWithoutRemoved = tasks.filter((item) => item.id !== id);
        setTasks(newListWithoutRemoved);
      }).catch(error => {
        alert(error.response ? error.response.data.error : error);
      });
  }

  return (
    <div className='container'>
      <h3>Shopping List</h3>

      <form onSubmit={save}>
        <label>New item</label>
        <input value={task} placeholder="Description" onChange={e => setTask(e.target.value)} />
        <input value={amount} placeholder="Amount" onChange={e => setAmount(e.target.value)} />
        <button>Add</button>
      </form>

      <ul>
        {tasks?.map(task => (
          <li key={task.id}>
            {task.description} {task.amount}
            <a className='delete' onClick={() => remove(task.id)} href='/#'> Delete </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;