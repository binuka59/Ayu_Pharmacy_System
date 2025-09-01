import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import styles from './css/login.css';
import Accordion from 'react-bootstrap/Accordion';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import React, { useState, useEffect } from "react";


 function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  

  const togglePassword = () => setShowPassword(prev => !prev);

        const handleSubmit = async (e) => {
            e.preventDefault();
           try {
              const response = await axios.post('http://localhost:5000/login', {
                email,
                password,
              });

              console.log(response.data); 

              setEmail('');
              setPassword('');
              
              setSuccessMessage(response.data.message); // Show "Login success"

              
              const action = response.data.action;
              localStorage.setItem('token', response.data.token);
          setTimeout(() => 
            {
          
              if (action === 'admin') {
                navigate('/Admin'); 
              } else if (action === 'staff') {
                navigate('/staff'); 
              } else {
                alert("Unknown role: " + action);
              }
          }, 2000);

            } catch (err) {
              if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error); // "Invalid credentials"
              } else {
                setError('Something went wrong. Please try again.');
              }
            }

          };
          useEffect(() => {
            if (error) {
              const timer = setTimeout(() => {
                setError("");  
                setEmail("");       
                setPassword("");    
              }, 2000);

              return () => clearTimeout(timer); // cleanup timer
            }
          }, [error]);


  return (

    <div className="main">
      <div className="banners">Welcome Ayu Pharmacy</div>

      <div className="logform">
        <div className="login-left">
          <img src="/images/background3.png" alt="background" />
        </div>

        <div className="login-right">
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
          {error && <p className="error-text">{error}</p>}
          <h3>L O G I N</h3>

          <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
            <form onSubmit={handleSubmit}>
              <div className="form-log">
                <label className="form-label">Email address :</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter Email address Here"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-log">
                <label className="form-label">Password:</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder="Enter password Here"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    onClick={togglePassword}
                    className={`fa field-icon toggle-password ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} >
                  </span>
                </div>
              </div>

              <div className="forget">
                <Link to="/reset">Forgot password?</Link>
              </div>

              <button type="submit" className="signbtn">
                Sign In
              </button>
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
export default Login;

