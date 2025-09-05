import Head from './Head'
import Sidebar from './Sidebar'
import React, { useState} from "react";
import './css/all.css';
import './css/bill.css';
import {  FaEdit, FaTrash } from "react-icons/fa";

function Bill() {
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
                <h1>T o d a y - B i l l  </h1>
                <div class="itembox">
                    <div class="disbox">
                        <span>Total Items:</span>
                        <span1>30</span1>

                    </div>

                    <div class="disbox">
                        <span>Total Customers:</span>
                        <span1>30</span1>

                    </div> 

                    <div class="disbox">
                        <span>Total Amount:</span>
                        <span1>RS:30.00</span1>

                    </div> 

                </div>
                <div class="card-block">
                    <div class="rows">
                        <table class="table">
                          <caption style={{ captionSide: "top", fontWeight: "bold", fontSize: "1.5rem", textAlign: "center" }}>
                            Bill Information
                          </caption>
                            <thead>
                                <tr>
                                    <th>Nu:</th>
                                    <th>Customer Number</th>
                                    <th>Item Count</th>
                                    <th>Amount</th>

                                </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>01</td>
                                <td>stf0001</td>
                                <td>Sumanadhasa</td>
                                <td>0776574685</td>

                              </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    </div>
  )
}

export default Bill
