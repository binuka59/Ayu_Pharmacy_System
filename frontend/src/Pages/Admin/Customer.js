import Head from './Head'
import Sidebar from './Sidebar'
import React, { useState} from "react";
import './css/all.css';
import './css/customer.css';
import {  FaEdit, FaTrash } from "react-icons/fa";

function Customer() {
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
                <h1>C u s t o m e r </h1>
                <form className="form-customer">
                  <div className="row">
                    <div className="col-md-3 form-item ">
                      <label className="customer-label">Name:</label>
                      <input type="text" className="form-control customer-input" placeholder="Enter Name"/>
                    </div>

                    <div className="col-md-6">
                      <label className="customer-label">Address:</label>
                      <input type="text" className="form-control customer-input"  placeholder="Enter Address" />
                    </div>

                    <div className="col-md-3">
                      <label className="customer-label">Customer Age:</label>
                      <input type="text" className="form-control customer-input"  placeholder="Enter Age of customer" />
                    </div>

                    <div className="col-md-3">
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

                    <div className="col-md-6">
                      <label className="customer-label">E-mail Address:</label>
                      <input type="email" className="form-control customer-input"  placeholder="Enter E mail Address" />
                    </div>

                    <div className="col-md-3">
                      <label className="customer-label">Gender:</label>
                      <select className="form-control customer-input" name="gender">
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>

                    <div className="cuform-btn">
                      <input type='button' class="customerbtn" name="cusbtn" value="Add customer Details"/>
                    </div>

                  </div>
                </form>


                <div class="card-block">
                    <div class="rows">
                        <table class="table">
                          <caption style={{ captionSide: "top", fontWeight: "bold", fontSize: "1.5rem", textAlign: "center" }}>
                            Customer Details
                          </caption>
                            <thead>
                                <tr>
                                    <th>C_Num </th>
                                    <th>Name</th>
                                    <th>Age</th>
                                    <th>Mobile number</th>
                                    <th>E-mail</th>
                                    <th>Address</th>
                                    <th>Gender</th>
                                    <th>Action</th>

                                </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>cus0001</td>
                                <td>Sumanadhasa</td>
                                <td>45</td>
                                <td>0776574685</td>
                                <td>none</td>
                                <td>pothuhera,kurunegala</td>
                                <td>male</td>
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

export default Customer

