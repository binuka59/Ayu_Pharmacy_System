import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { Trans } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import Head from './Head'
import Sidebar from './Sidebar'
import Title from './title'
import React, { useState} from "react";
import './css/Admin.css';

import {  FaSearch  } from "react-icons/fa";





function Homepage() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const [selectedRows, setSelectedRows] = useState([]);

  const rows = [
    { name: "Mark", size: "Otto", quantity: 5, price: 100, amount: 500 },
    { name: "Jacob", size: "Thornton", quantity: 2, price: 150, amount: 300 },
    { name: "Larry", size: "Bird", quantity: 1, price: 200, amount: 200 },
  ];

  const handleCheckboxChange = (index) => {
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter((i) => i !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
  };

  return (
    <div>
      <Head />

      <div className={`main-content ${isOpen ? "shifted" : ""}`}>

        <div className={`background ${isOpen ? "active" : ""}`}>
        
          <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

          <h1>D a s h b o a r d</h1>
          <div className="page">
            <div className="section left">
              <form class="form-group">
                <div className="form-serach">
                  <label>< FaSearch />Search</label>
                  <input type='text' name="search" placeholder='Search Item 🔍'/>
                </div>
              </form>
              <div className="details">
                <div class="form-group">
                  <div className="form">
                    <label className="form-label">Brand Name:</label>
                    <input type='text'  name="brand" value="hemas"readOnly/>
                  </div>
                </div>

                <div class="form-group">
                  <div className="form">
                    <label className="form-label">Item Name:</label>
                    <input type='text'  name="iname" readOnly/>
                  </div>
                </div>

                <div class="form-group">
                  <div className="form">
                    <label className="form-label">Item Type:</label>
                    <input type='text'  name="type" readOnly/>
                  </div>
                </div>

                <div class="form-group">
                  <div className="form">
                    <label className="form-label">Item  Size:</label>
                    <input type='text'  name="size" readOnly/>
                  </div>
                </div>

                <div class="form-group">
                  <div className="form">
                    <label className="form-label">Item  Price:</label>
                    <input type='text'  name="price" readOnly/>
                  </div>
                </div>

                <div class="form-group">
                  <div className="form-stock">
                    <label className="form-label">Available Items of Stock:</label>
                    <input type='text'  name="stock" value="100" readOnly/>
                  </div>
                </div>

                <div className="form-group">
                  <div className="form">
                    <label className="form-label">Quantity:</label>
                    <input
                      type="text"
                      name="quantity"
                      min="0"
                      onInput={(e) => {
                        // Allow only positive numbers, else clear input
                        if (!/^\d*$/.test(e.target.value)) {
                          e.target.value = e.target.value.replace(/\D/g, ""); 
                        }
                      }}
                    />
                  </div>
                </div>

              </div>
            </div>

            <div className="section right">
              <div class="card-block">
                <div class="rows">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>✅ </th>
                        <th>Name</th>
                        <th>Size</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, index) => (
                        <tr
                          key={row.code}
                          className={selectedRows.includes(index) ? "table-primary" : ""}
                        >
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(index)}
                              onChange={() => handleCheckboxChange(index)}
                            />
                          </td>

                          
                          <td>{row.name}</td>
                          <td>{row.size}</td>
                          <td>{row.quantity}</td>
                          <td>{row.price}</td>
                          <td>{row.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div class="form-group">
                <div className="form amounts">
                  <label className="form-label ">Total Amount:</label>
                  <input type='text' class="amount"  name="totamount" value="totamount"readOnly/>
                </div>
              </div>

            </div>
            

          </div>
            <form class="button-group">
              <input type="button" name="submitbtn" value="Add Cart" />
              <input type="button" name="submitbtn" value="Delete Item" />
              <input type="button" name="submitbtn" value="Confirm" />
            </form>
            <Title/>
        </div>
      </div>
    </div>
  );
}

export default Homepage
