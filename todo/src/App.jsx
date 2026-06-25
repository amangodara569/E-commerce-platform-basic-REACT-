import {useState} from 'react'

export default function App() {
  const [tasks, setTasks] = useState([]); //that is to be seen 
  const [newTask, setNewTask] = useState(''); //this is to track the value of the input field, so we need to update the state of newTask with the value of the input field

  let addNewTask = () =>{
    console.log('add new task');
    setTasks([...tasks, newTask]); //spread optr , updated value that we need
  }
  let updateNewTask = (e) =>{
    //why we need this function? because we need to update the state of newTask when user types in the input field
    //what actually we are tracking from this input field is the value of the input field, so we need to update the state of newTask with the value of the input field
    setNewTask(e.target.value);
    //from this only we  will get the value of the input field and we will update the state of newTask with that value
  }
  return (
    <>
        <p> todo list </p>
        <br />  <br />
        <input 

          type="text" placeholder="Add a new task" 
          value={newTask}  
          // this value will get added in array of tasks when we click on add button and then we will render that array of tasks using map function
          onChange={updateNewTask} 
        
        />

        <button onClick={addNewTask}>Add</button>
        <br />  <br />
        <p>your tasks will appear here</p>

        {/* to render actual tasks use map */}
        {
            tasks.map(task=>{
              return <li>{task}</li>
            })
        }
    </>
  )
}
