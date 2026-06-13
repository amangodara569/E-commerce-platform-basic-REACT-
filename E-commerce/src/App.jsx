// importing states
import { useState } from "react";
function App(props){
  const greeting = greet({name: "aman"}); //accessing that function
  const value = true;
  return (
    <>
      <h1>Welcome to our E-commerce Store!</h1>
      {/* if value is true then render this */}
      {value === true && <p>{greeting}, {props.name}</p>}
      {/* or can directly write */}
      {/* {value  && <p>hello {props.name}</p>} */}


      {/* use if else */}
      {value ? <p> {greeting}, {props.name} </p>: <p>value is false</p>}



      {/* handling events */}


      {/* //using js in html with {} */}


      {/* //calling a component */}
      {/*    <ComponentName />  thing is whereever we want to use it, we can just call it like that*/} ,
      {/* <componentName name="aman"/>    pass in props*/}


      {/* handling EVENTS */}
      <button onClick={HandleClick}>Click me</button>;
    </>
  )
};
//normal function
function greet(props){
  return `hello ${props.name}`;
}; 
//similar as passing arguments , its called props in react, which stands for properties. Props are used to pass data from one component to another in React. They allow us to customize the behavior and appearance of components by providing them with specific values or information. In the example above, we are passing a name property to the greet function, which then uses that property to generate a personalized greeting message.





// handling events
function HandleClick(){
  //here we have defined the logic and we will call this in button onClick event. When the button is clicked, the handleClick function will be executed, and it will check the value of the event variable. If the event variable is true, it will display an alert with the message "button clicked". Otherwise, it will display an alert with the message "button not clicked". This is a simple example of how to handle events in React and provide feedback to the user based on their interactions with the UI.
  
  
  //this logic will not work 
  //to actually make it work we use states , to rerender the component when the state changes, but for now we are just demonstrating how to handle events in React.
  
  const [event, setEvent] = useState(false); //call a setter function to chagne the value as we normally cant do it like value= true
  if(event){
    alert("button clicked");
    setEvent(true);
  }else{
    alert("button not clicked");
    setEvent(false);
  }
}



// most imporatn use of states
function  getInput{
  const [inputValue, setInputValue] = useState(""); //as we will be storing input as string

  return(
    <input type="text" value={inputValue} onChange={(event)=> setInputValue(event.target.value)} />  //imp = event.target.value is the current value of the input field. When the user types something in the input field, the onChange event is triggered, and the setInputValue function is called with the new value of the input field. This allows us to keep track of the user's input and update our component's state accordingly. By using useState, we can ensure that our component re-renders whenever the input value changes, allowing us to display the updated value in our UI or perform any necessary actions based on the user's input.
  )
}

export default App;
//component App is the main component of the application. It returns a simple JSX element that displays a welcome message to the users. This component can be further expanded to include more features and functionalities as needed.
//component == function that returns JSX, which is a syntax extension for JavaScript that allows us to write HTML-like code in our React components. The App component is the root component of our application, and it can be used to render other components and manage the overall structure of the app.

//a normal function starts with small letter, while a React component starts with a capital letter.
//  This is a convention in React to differentiate between regular JavaScript functions and components.
//  By following this convention, it helps developers quickly identify which functions are components and which are not.