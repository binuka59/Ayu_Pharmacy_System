import React from 'react'
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <h1>home page</h1>
      <Link to="/Head"> Go to home</Link>
    </div>
  )
}
