import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
<<<<<<< HEAD
=======
import  './css/login.css';
>>>>>>> 792cc480 (second commit)


export default function Resetpass() {

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
 
  
const handleEmail = async (e) => {
  e.preventDefault();
  try {
<<<<<<< HEAD
    const response = await axios.post('http://localhost:5000/Reset', {
=======
    const response = await axios.post('http://localhost:5000/api/log/Reset', {
>>>>>>> 792cc480 (second commit)
      email: email  
    });

    console.log(response.data);
    setEmail('');
    setError('');
    navigate('/ResetPassword');

  } catch (err) {
    if (err.response && err.response.data && err.response.data.error) {
      setError(err.response.data.error); // "Invalid credentials"
    } else {
      setError('Please Try Again.');
    }
  }
};

  return (
    <div className="main">
<<<<<<< HEAD
      <div className="banner">Welcome Ayu Pharmacy</div>
=======
      <div className="banners">Welcome Ayu Pharmacy</div>
>>>>>>> 792cc480 (second commit)

      <div className="logform">
        <div className="login-left">
          <img src="/images/background3.png" alt="background" />
        </div>

        <div className="login-right">
          {error && <p className="error-text">{error}</p>}
          <h3>F o r g e t___E m a i l</h3>
          <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
            <form onSubmit={handleEmail} method="post">
<<<<<<< HEAD
              <div className="form">
=======
              <div className="form-log">
>>>>>>> 792cc480 (second commit)
                <label className="form-label">Email address :</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter Email address Here"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Link back to Login */}
              <div className="forget">
                <Link to="/">Back to Login</Link> 
                
                

              </div>

              <button type="submit" className="signbtn">Confirm</button>
            </form>
          </div>
        </div>
      </div>

      <div className="copyrigth">
        <p>Created By Binuka Lakshan | All Rights Reserved!</p>
      </div>
    </div>
  );
}
