//for react router
import React from 'react';
import {Link, Route, Routes}  from 'react-router-dom';


function Home(){
    
    return (
        <>
             <h1>home page</h1>
        </>
    )
}
function About(){
    return <h1>about page</h1>
}

function Apps(){
    let features = ['feature1', 'feature2', 'feature3']; //access an array
    //make changes to all the elements of an array using map
    const featureList = features.map((feature) => <li key={feature}>{feature}</li>);
    return(
        <>
        <div>
            <nav>
                <Link to='/'>Home features= {features}</Link>
                <Link to='/about'>About</Link>
            </nav>
        </div>
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path= '/about' element={<About/>}/>
            <Route path = '*' element={<h1>404 page not found</h1>}/>
        </Routes>
        </>
    )
}

export default Apps;

