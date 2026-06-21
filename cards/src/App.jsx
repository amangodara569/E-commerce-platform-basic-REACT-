
function Card({description, price}){
  let styles = {
    border: '5px solid red',
    padding: '10px',
    margin: '10px',
    width: '200px'
  }

  function headCard(){
  
    return (
     <>
       <h2>Card</h2>
      <br color="red" border="5px solid red"></br>
     </>
    )
  }
    return (
      <>
      <div style={styles}>
        {headCard()}
        <p>{description} - ${price}</p>
      </div>
      </>
    )
}


function App(){
  return (
    <>
    <Card description='this is a card' price={100}/>
    <Card description= "headphones" price={2300}/>
    </>
  )
}

export default App;