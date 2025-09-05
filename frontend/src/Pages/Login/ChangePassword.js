import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ChangePassword() {

    const [newpass, setNewpass] = useState('');
    const [compass, setCompass] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword1, setShowPassword1] = useState(false);
    const togglePassword = () => setShowPassword(prev => !prev);
    const togglePassword1 = () => setShowPassword1(prev => !prev);

 const handlePassword = async (e) => {
    e.preventDefault(); 
    try {
<<<<<<< HEAD
      const response = await axios.post('http://localhost:5000/Passwordset', {
=======
      const response = await axios.post('http://localhost:5000/api/log/Passwordset', {
>>>>>>> 792cc480 (second commit)
        newpass,
        compass,
      });

      console.log(response.data);
      setNewpass('');
      setCompass('');
      setError('');
      setTimeout(() => 
        {
          navigate("/"); 
        }, 2000);
      setSuccessMessage(response.data.message);

    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error); 
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
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
          {error && <p className="error-text">{error}</p>}
          <h3>Change New Password</h3>
          <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
          <form onSubmit={handlePassword} method='post'>
<<<<<<< HEAD
              <div className="form">
=======
              <div className="form-log">
>>>>>>> 792cc480 (second commit)
                <label className="form-label">New Password:</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder="Enter password Here"
                    value={newpass}
                    onChange={(e) => setNewpass(e.target.value)}
                    required
                  />
                  <span
                    onClick={togglePassword}
                    className={`fa field-icon toggle-password ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} >
                  </span>
                </div>
              </div>

<<<<<<< HEAD
              <div className="form">
=======
              <div className="form-log">
>>>>>>> 792cc480 (second commit)
                <label className="form-label">Comfirm Password:</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword1 ? 'text' : 'password'}
                    className="form-control"
                    placeholder="Enter same password Here"
                    value={compass}
                    onChange={(e) => setCompass(e.target.value)}
                    required
                  />
                  <span
                    onClick={togglePassword1}
                    className={`fa field-icon toggle-password ${showPassword1 ? 'fa-eye-slash' : 'fa-eye'}`} >
                  </span>
                </div>
              </div> 

          <button type="submit" className="signbtn">Update</button>
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

