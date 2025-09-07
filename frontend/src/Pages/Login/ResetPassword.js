import React, { useState } from 'react';
import  './css/login.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ResetPassword() {
  const [verify1, setVerify1] = useState('');
  const [verify2, setVerify2] = useState('');
  const [verify3, setVerify3] = useState('');
  const [verify4, setVerify4] = useState('');
  const [verify5, setVerify5] = useState('');
  const [verify6, setVerify6] = useState('');

  const OTPCode = [verify1, verify2, verify3, verify4, verify5, verify6].join('');


  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlecode = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/log/Verify', {
      OTPCode:OTPCode
      });
  
      console.log(response.data);
      setError('');
      navigate('/ChangePassword');
  
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
      <div className="banners">Welcome Ayu Pharmacy</div>

      <div className="logform">
        <div className="login-left">
          <img src="/images/background3.png" alt="background" />
        </div>

        <div className="login-right">
          {error && <p className="error-text">{error}</p>}
          <h3>V e r i f y  C o d e</h3>
          <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
          <form onSubmit={handlecode} method="post">
          <div className="verifyform">
            <label className="form-label">Check Your Email :</label>
            <div className="verify-inputs">
            {[setVerify1, setVerify2, setVerify3, setVerify4, setVerify5, setVerify6].map(
              (setter, index) => (
              <input
                key={index}
                type="text"
                className="verify"
                maxLength={1}
                onChange={(e) => setter(e.target.value.replace(/[^0-9]/g, ''))}
                onInput={(e) => {
                  if (e.target.value && e.target.nextElementSibling) {
                    e.target.nextElementSibling.focus();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !e.target.value && e.target.previousElementSibling) {
                    e.target.previousElementSibling.focus();
                  }
                }}
              />
            ))}
          </div>

          </div>
              <div className="forget">
                {/* <Link to="/">Back to Login</Link> */}
                <Link to="/ChangePassword"> Back to Login Page</Link>
                
              </div>



            <button type="submit" className="signbtn">Verify</button>
          </form>
          </div>
        </div>
      </div>

      <div className="copyrigth">
        <p>Created By Binuka Lakshan | All Rights Reserved!</p>
      </div>
    </div>
  )
}
