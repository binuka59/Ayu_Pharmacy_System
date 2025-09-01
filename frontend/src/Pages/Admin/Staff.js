import Head from './Head'
import Sidebar from './Sidebar'
import React, { useState} from "react";
import './css/all.css';
import {  FaEdit, FaTrash } from "react-icons/fa";

function Staff() {
    const [isOpen, setIsOpen] = useState(false);
            
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };
  return (
    <div>
      <Head />

      <div className={`main-content ${isOpen ? "shifted" : ""}`}>
            <div className={`background ${isOpen ? "active" : ""}`}>
                <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
                <h1>S t a f f </h1>
                <form className="form-customer">
                  <div className="row">
                    <div className="col-md-1 form-item "></div>

                    <div className="col-md-5 form-item ">
                      <label className="customer-label">Name:</label>
                      <input type="text" className="form-control customer-input" placeholder="Enter Name"/>
                    </div>

                    <div className="col-md-5">
                      <label className="customer-label">E-mail Address:</label>
                      <input type="email" className="form-control customer-input"  placeholder="Enter E mail Address" />
                    </div>

                    <div className="col-md-1 form-item "></div>

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

                    <div className="col-md-4 form-item ">
                      <label className="customer-label">Password:</label>
                      <input type="password" className="form-control customer-input" placeholder="Enter New Password"/>
                    </div>

                    <div className="col-md-4 form-item ">
                      <label className="customer-label">Confirm Password:</label>
                      <input type="password" className="form-control customer-input" placeholder="Confirm Password"/>
                    </div>

                    <div className="cuform-btn">
                      <input type='button' class="customerbtn" name="cusbtn" value="Submit "/>
                    </div>

                  </div>
                </form>

                <div class="card-block">
                    <div class="rows">
                        <table class="table">
                          <caption style={{ captionSide: "top", fontWeight: "bold", fontSize: "1.5rem", textAlign: "center" }}>
                            Staff Details
                          </caption>
                            <thead>
                                <tr>
                                    <th>Nu</th>
                                    <th>Name</th>
                                    <th>Mobile number</th>
                                    <th>E-mail Address</th>
                                    <th>Action</th>

                                </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>stf0001</td>
                                <td>Sumanadhasa</td>
                                <td>0776574685</td>
                                <td>p@gmail.com</td>
                                <td><FaEdit onClick={() => alert("Edit clicked")} class="editbtn" /><FaTrash onClick={() => alert("Delete clicked")} class="deletebtn" /></td>
                              </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )}

export default Staff
