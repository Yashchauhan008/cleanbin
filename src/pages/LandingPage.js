import React from 'react'
import { useNavigate } from 'react-router-dom'

const LandingPage = () => {
    const navigate = useNavigate()
  return (
    <div>
      <h1>Welcome to My React App!</h1>
      <p>This is a simple landing page.</p>
      <button onClick={()=>{navigate("/bin/101")}}>report bin</button>
      <button onClick={()=>{navigate("/home")}}>home</button>
    </div>
  )
}

export default LandingPage