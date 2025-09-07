import Head from './Head';
import Sidebar from './Sidebar';
import React, { useState, useEffect } from "react";
import axios from "axios";
import './css/all.css';
import './css/customer.css';
import { FaEye, FaSearch } from "react-icons/fa";

function ViewCustomer() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Fetch customers on search
  useEffect(() => {
    if (search.length > 0) {
      axios
        .get(`http://localhost:5000/api/customer/searchCustomer?mobile=${search}`)
        .then((res) => setCustomers(res.data))
        .catch((err) => console.error("Search error:", err));
    } else {
      setCustomers([]); // clear when no search
    }
  }, [search]);

  return (
    <div>
      <Head />
      <div className={`main-content ${isOpen ? "shifted" : ""}`}>
        <div className={`background ${isOpen ? "active" : ""}`}>
          <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
          <h1>C u s t o m e r _ D e t a i l s </h1>

          {/* Search bar */}
          <form className="form-items">
            <div className="row">
              <div className="col-md-12 Search-bar">
                <label className="label">
                  <FaSearch /> Search Customer Details:
                </label>
                <input
                  type="text"
                  className="form-control customer-input"
                  placeholder="Only input Customer mobile number"
                  value={search}
                  maxLength={10}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value) && value.length <= 10) {
                      setSearch(value);
                    }
                  }}
                />
              </div>
            </div>
          </form>

          {/* Table */}
          <div className="card-block">
            <div className="rows">
              <table className="table">
                <caption style={{ captionSide: "top", fontWeight: "bold", fontSize: "1.5rem", textAlign: "center" }}>
                  Customer Details
                </caption>
                <thead>
                  <tr>
                    <th>C_Num</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Mobile</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Gender</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.length > 0 ? (
                    customers.map((cus) => (
                      <tr key={cus.Cid}>
                        <td>Cus{cus.Cid}</td>
                        <td>{cus.name}</td>
                        <td>{cus.age}</td>
                        <td>{cus.mobile}</td>
                        <td>{cus.email}</td>
                        <td>{cus.address}</td>
                        <td>{cus.gender}</td>
                        <td>
                          <FaEye
                            onClick={() => {setSelectedCustomer(cus); setShowPopup(true);}}
                            className="Viewbtn"
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" style={{ textAlign: "center" }}>
                        {search ? "No customer found" : "Enter a mobile number to search"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Popup */}
          {showPopup && selectedCustomer && (
            <div className="popup-overlay">
              <div className="popup-box">
                <h2>Customer Profile</h2>
                <form className="form-viewcustomer">
                  <div className="row">
                    <div className="form-view">
                      <label>Name:</label>
                      <span>{selectedCustomer.name}</span>
                    </div>
                    <div className="form-view">
                      <label>Age:</label>
                      <span>{selectedCustomer.age}</span>
                    </div>
                    <div className="form-view">
                      <label>Mobile:</label>
                      <span>{selectedCustomer.mobile}</span>
                    </div>
                    <div className="form-view">
                      <label>Email:</label>
                      <span>{selectedCustomer.email}</span>
                    </div>
                    <div className="form-view">
                      <label>Address:</label>
                      <span>{selectedCustomer.address}</span>
                    </div>
                    <div className="form-view">
                      <label>Gender:</label>
                      <span>{selectedCustomer.gender}</span>
                    </div>
                  </div>
                </form>
                <button className="prook" onClick={() => setShowPopup(false)}>
                  Ok
                </button>
                <button className="proclose" onClick={() => setShowPopup(false)}>
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewCustomer;
