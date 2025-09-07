import React, { useState, useEffect } from "react";
import axios from "axios";
import Head from "./Head";
import Sidebar from "./Sidebar";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import "./css/all.css";
import "./css/bill.css";
import { FaSearch } from "react-icons/fa";

function Bill() {
  const [isOpen, setIsOpen] = useState(false);
  const [billData, setBillData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showbillPopup, setShowBillPopup] = useState(false);
  const [Showbill, setShowbill] = useState(null);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Calculate totals
  const totalItems = billData.reduce(
    (sum, item) => sum + item.totalBILLQuantity,
    0
  );
  const totalAmount = billData.reduce(
    (sum, item) => sum + item.totalAmount,
    0
  );

  // Fetch summary bill data
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/bill/Getcartitem")
      .then((res) => {
        console.log("API response:", res.data);
        setBillData(res.data.items);
      })
      .catch((err) => console.log(err));
  }, []);

 
  const fetchBillDetails = async (Billnum) => {
    try {
       axios.get(
        `http://localhost:5000/api/bill/GetBillDetails/${Billnum}`)
        .then((res) =>setShowbill(res.data))
        .catch((err) => console.error("Search error:", err));  

    } catch (err) {
      console.error("Error fetching bill details:", err);
    }
  };

  // Chart colors
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#e91e63",
    "#9c27b0",
  ];

  return (
    <div>
      <Head />
      <div className={`main-content ${isOpen ? "shifted" : ""}`}>
        <div className={`background ${isOpen ? "active" : ""}`}>
          <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

          <h1>Today - Bill</h1>

          {/* Summary Cards */}
          <div className="itembox">
            <div className="disbox" onClick={() => setShowPopup(true)}>
              <span>Total Items:</span>
              <span1>{totalItems}</span1>
            </div>

            <div className="disbox">
              <span>Total Customers:</span>
              <span1>{billData.length}</span1>
            </div>

            <div className="disbox">
              <span>Total Amount:</span>
              <span1>RS: {totalAmount.toFixed(2)}</span1>
            </div>
          </div>

          {/* Bill Table */}
          <div className="card-block">
            <div className="rows">
              <table className="table">
                <caption
                  style={{
                    captionSide: "top",
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    textAlign: "center",
                  }}
                >
                  Bill Information
                </caption>
                <thead>
                  <tr>
                    <th>Bill Number</th>
                    <th>Customer Name</th>
                    <th>Item Count</th>
                    <th>Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {billData.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center" }}>
                        No data available
                      </td>
                    </tr>
                  ) : (
                    billData.map((item, index) => (
                      <tr key={index}>
                        <td>{item.Billnum}</td>
                        <td>{item.customerName}</td>
                        <td>{item.totalBILLQuantity}</td>
                        <td>{item.totalAmount.toFixed(2)}</td>
                        <td>
                          <FaSearch
                            onClick={() => {fetchBillDetails(item.Billnum); setShowBillPopup(true);setShowbill(item)}}
                            className="Viewbtn"
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Bill Details Popup */}
      {showbillPopup && Showbill && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>Customer Bill Details</h2>
            <div className="form-viewcustomer">
              <div className="form-view">
                <label>Bill Number:</label>
                <span>{Showbill.Billnum}</span>
              </div>
              <div className="form-view">
                <label>Customer Name:</label>
                <span>{Showbill.customerName}</span>
              </div>
              <div className="form-view">
                <label>Total Quantity:</label>
                <span>{Showbill.totalBILLQuantity}</span>
              </div>
              <div className="form-view">
                <label>Total Amount:</label>
                <span>Rs: {Showbill.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <h3>Items</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                </tr>
              </thead>
            <tbody>
                {Showbill.length > 0 ? (
                  Showbill.map((it) => (
                    <tr key={it.id}>
                      <td>{it.stname}</td>
                      <td>{it.quantity}</td>
                      <td>Rs: {it.amount.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center" }}>No items available</td>
                  </tr>
                )}
              </tbody>
            </table>

            <button className="proclose" onClick={() => setShowBillPopup(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Chart Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Item Distribution by Customer</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={billData}
                  dataKey="totalBILLQuantity"
                  nameKey="customerName"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#0d00ffff"
                  label
                >
                  {billData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bill;
