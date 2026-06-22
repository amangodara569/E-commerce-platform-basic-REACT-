import { useState } from "react";
export default function Counter(){

    const [count, setcount] = useState(0);

    function incCount(){
        setcount(count+1); //it will trigger  re-render of the component and update the count value in dom
        console.log(count);
    }
    return (
        <>
            <p>Count: {count}</p>
            {/* the count variable will not be updated in dom as it is not a state variable and not getting re rendered
            
            state - jis component me changes ho rhe hai and we want to re render that to diplay updated value*/}
            <button onClick={incCount}>Increment</button>
        </>
    )
}