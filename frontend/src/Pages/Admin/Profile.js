import Head from './Head'
import Sidebar from './Sidebar'
import React, { useState} from "react";
import './css/all.css';
import './css/profile.css';

function Profile() {
const [isOpen, setIsOpen] = useState(false);
            
const toggleSidebar = () => {
    setIsOpen(!isOpen);
};

const [showPopup, setShowPopup] = useState(false);
  return (
    <div>
      <Head />

      <div className={`main-content ${isOpen ? "shifted" : ""}`}>
            <div className={`background ${isOpen ? "active" : ""}`}>
                <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
                <h1>P r o f i l e </h1>
                <form className="form-customer">
                  <div className="row">
                    <div className="col-md-2 form-item "></div>

                    <div className="col-md-2 form-item ">
                        <span>
                            <img class="img-circle profile " src="/logo1.png"  alt="User Image"/>
                        </span>
                    </div>


                    <div className="col-md-4 form-item ">
                      <label className="customer-label">Profile Image:</label>
                      <input type="file" className="form-control customer-input" placeholder="Enter Name"/>
                    </div>
                    <div className="col-md-4 form-item "></div>

                    <div className="col-md-4 form-item ">
                      <label className="customer-label">Name:</label>
                      <input type="text" className="form-control customer-input" placeholder="Enter Name"/>
                    </div>

                    <div className="col-md-4">
                      <label className="customer-label">E-mail Address:</label>
                      <input type="email" className="form-control customer-input"  placeholder="Enter E mail Address" />
                    </div>


                    <div className="col-md-4">
                      <label className="customer-label">Mobile Number:</label>
                      <input
                        type="text"
                        className="form-control customer-input"
                        placeholder="Enter Mobile Number"
                        min="0"
                        maxLength="10"
                        onInput={(e) => {
                          if (!/^\d*$/.test(e.target.value)) {
                            e.target.value = e.target.value.replace(/\D/g, "");
                          }
                        }}
                      />
                    </div>


                    <div className="cuform-btn">
                      <input type='button' class="customerbtn" name="cusbtn" value="Edit Details " onClick={() => setShowPopup(true)}/>
                    </div>

                    {showPopup && (
                        <div className="popup-overlay">
                        <div className="popup-box">
                            <h2>Edit Profile</h2>
                            <form className="form-customer">
                                <div className="row">

                                <div className="col-md-12 form-item ">
                                <label className="customer-label">Password:</label>
                                <input type="text" className="form-control " placeholder="Enter password" required ></input>
                                </div>
                                </div>
                            </form>
                            <button class="prook" onClick={() => setShowPopup(true)}>Ok</button>
                            <button class="proclose" onClick={() => setShowPopup(false)}>Close</button>
                        </div>
                        </div>
                    )}
                  </div>
                </form>

            </div>
        </div>
    </div>
  )}


export default Profile
