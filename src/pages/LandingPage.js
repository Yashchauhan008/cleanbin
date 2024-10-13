import React from 'react'
import { useNavigate } from 'react-router-dom'

const LandingPage = () => {
    const navigate = useNavigate()
  return (
    <div  style={{color:'rgb(166, 85, 229)'}}>
      <h1>Test Page</h1>
      <p>Click to heck what happen on qr code scane</p>
      <button onClick={()=>{navigate("/bin/101")}}>demo</button>
      <p>dustbin details for all type</p>
      <button onClick={()=>{navigate("/home")}}>Dustbin Details</button>
    </div>
  )
}

export default LandingPage