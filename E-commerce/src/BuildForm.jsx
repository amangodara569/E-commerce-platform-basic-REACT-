import {useState} from "react";
import {useForm} from "react-hook-form";  //for form validation and handling form data easily
function App(){
       //we will create 2 states for email and password
        // const [email, setEmail] = useState("");
        // const [password, setPassword] = useState("");
        // const [name, setName] = useState("");


        //using useForm hook to handle form data and validation
    const { register, handleSubmit} = useForm();
    
    function onSubmit(data){
        //now the event is gone but we still have access to the form data through the register function. We can use the register function to access the values of the input fields and handle the form submission accordingly.
        //to keep track of changes in the form and prevent the default behavior of the form submission, we can use the event.preventDefault() method. This method prevents the form from being submitted and allows us to handle the form data in our own way. In this case, we are simply logging the form data to the console, but we could also send it to a server or perform other actions as needed.
        event.preventDefault();
        alert(`Form submitted with email: ${register("email")}, password: ${register("password")}, name:${data.name}`);

     

    
    }

    return(
        //very basic sign up form 
        
        <form onSubmit={handleSubmit(onSubmit)}>  
        {/* //using handleSubmit function from react-hook-form to handle form submission and call our onSubmit function when the form is submitted. 
        // This allows us to easily manage form data and validation using the features provided by the react-hook-form library. */}
            <h1>Sign Up</h1>
            <label htmlFor="email">Email</label>
            <input type="email" id="email"  name="email"
                placeholder="Enter your email" required 
                //onChange={(event)=> setEmail(event.target.value)} 
                {...register("email")}  //using register function to register the input field with the name "email". This allows us to easily access the value of the email input field when the form is submitted.
                //  The register function also handles form validation and other features provided by the react-hook-form library, making it easier to manage form state and handle form submissions in React.
            />

            <label htmlFor="password">Password</label>
            <input type="password" id="password"  name="password" 
                placeholder="Enter your password" required 
                //onChange={(event)=> setPassword(event.target.value)} 
                {...register("password")}  //using register function to register the input field with the name "password". 
                // This allows us to easily access the value of the password input field when the form is submitted.
            />

            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" 
                placeholder="Enter your name" required 
                //onChange={(event)=> setName(event.target.value)} 
                {...register("name")}  //using register function to register the input field with the name "name". 
                // This allows us to easily access the value of the name input field when the form is submitted.
            />
        </form>
    )
}

export default App;