//learn how to update an object in react state
// why they dont re render automatically ( array and obj)
//when we add something to them , their address in memory does not change, 
// so react will not re-render the component because it is not able to detect the change in state
//so we need to create a new object with the updated value and then we pass that new object to setMoves functionor or a copy of that

//jsut use spread in operator to create a new object with the updated value and then we pass that new object to setMoves function


import { useState } from "react";

export default function Ludo(){
   // const [blue, setBlue] = useState(0);   thisi way we need to create it multiple time
   //instead for that we can use object to store the state of all players
   const [ moves, setMoves] = useState({
        blue: 0,
        red: 0,
        green: 0,
        yellow: 0
   })
   const [arr, setArr] = useState(["no moves"]);
   //normal way for updation of state
    // function updateBlue(){
        //   moves,blue +=1;   value updation
        // with thid react will not re-render the component because it is not able to detect the change in state
    //imp ------- to make a  change in in state we need to create a new object to change the address by that only it will re render
    
        
    //     setMoves(...moves);    react will not re-render the component because it is not able to detect the change in state
    //thats why we use spread operator to create a new object with the updated value of blue and then we pass that new object to setMoves function
    // best way
    //setMoves(...moves, blue: moves.blue + 1});   //this will create a new object with the updated value of blue and then we pass that new object to setMoves function
    // spread then updation

    // and remember when new value depends on prev value use callback function to update the state
    // setMoves((prevMoves) =>({
    //     return (
    //         {...prevMoves,blue: prevMoves.blue + 1}
    //     )
    // }))
    // }

    //for yellow
    function updateYellow(){
        setMoves((prevMoves) =>({
            ...prevMoves, yellow: prevMoves.yellow +1
        }))
        setArr((prevArr) => [...prevArr, "yellow moves"]);  //this will create a new array with the updated value of yellow and then we pass that new array to setArr function
    };

    function updateGreen(){
        setMoves((prevMoves) =>({
            ...prevMoves, green: prevMoves.green +1
        }))
        setArr((prevArr) => [...prevArr, "green moves"]);  //this will create a new array with the updated value of green and then we pass that new array to setArr function
    };
    
    function updateRed(){
        setMoves((prevMoves) =>({
            ...prevMoves, red: prevMoves.red +1
        }))
        setArr((prevArr) => [...prevArr, "red moves"]);  //this will create a new array with the updated value of red and then we pass that new array to setArr function
    };
    function updateBlue(){
        setMoves((prevMoves)=>({
            ...prevMoves, blue: prevMoves.blue +1
        }))
        setArr((prevArr) => [...prevArr, "blue moves"]);  //this will create a new array with the updated value of blue and then we pass that new array to setArr function
    }


    return (
        <>
            <h1>Ludo Game</h1>

            <p>blue = {moves.blue}</p>
            <button style={{ backgroundColor: "blue", color: "white" }} onClick={updateBlue}>
                +1
            </button>
            <p>red = {moves.red}</p>
            <button style={{ backgroundColor: "red", color: "white" }} onClick={updateRed}>
                +1
            </button>
            <p>green = {moves.green}</p>
            <button style={{ backgroundColor: "green", color: "white" }} onClick={updateGreen}>
                +1
            </button>
            <p>yellow = {moves.yellow}</p>
            <button style={{ backgroundColor: "yellow", color: "black" }} onClick={updateYellow}>
                +1
            </button>
        </>
    )
}