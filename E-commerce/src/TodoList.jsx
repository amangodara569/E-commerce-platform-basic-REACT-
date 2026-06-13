function App(){
    return (
        <>

            < TodoList />

        </>
    )
}

function TodoList(){

    const todos = [
        {id: 1, text: "learn react"},
        {id: 2, text: "learn js"},
        {id: 3 , text: "get a job"}
    ]
    return (
        <>
            <h1>Todo list</h1>
            <ul>

                {/* wrong way   */}

                {/* <li> learn react </li>
                <li> learn js </li>
                <li> get a job </li> */}


                {/* how to render list in react */}

                {todos.map((todo) => (
                    <li key={todo.id}>{todo.text}</li>
                    // setting a key is important when rendering lists in React because it helps React identify which items have changed, been added, or been removed. This allows React to efficiently update the UI when the list changes. In the example above, we are using the id property of each todo item as the key, which ensures that each list item has a unique identifier. This helps React optimize the rendering process and improve performance when dealing with dynamic lists.
                ))}
{/* map function will render all the texts in a loop */}
            </ul>
        </>
    )
}
export default App;