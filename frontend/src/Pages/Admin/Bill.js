import React, { useState, useEffect } from "react";
import axios from "axios";
import Head from "./Head";
import Sidebar from "./Sidebar";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import "./css/all.css";
import "./css/bill.css";
import { FaSearch,FaTimes } from "react-icons/fa";
import Title from './title';

function Bill() {

  const [isOpen, setIsOpen] = useState(false);
  const [billData, setBillData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [showbillPopup, setShowBillPopup] = useState(false);
  const [loading , setLoading] = useState(false);

  const [selectedBill, setSelectedBill] = useState(null);
  const [billItems, setBillItems] = useState([]);

  const [totalCustomer, setTotalCustomer] = useState(0);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#e91e63",
    "#9c27b0",
  ];

  // totals
  const totalItems = billData.reduce(
    (sum, item) => sum + item.totalBILLQuantity,
    0
  );

  const totalAmount = billData.reduce(
    (sum, item) => sum + item.totalAmount,
    0
  );

  // load bill summary
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/bill/Getcartitem")
      .then((res) => {
        setBillData(res.data.items);  
        setChartData(res.data.bills);  
        setTotalCustomer(res.data.customerCount);
      })
      .catch((err) => console.log(err));
       setLoading(false);
  }, []);



  // fetch bill details
  const fetchBillDetails = (Billnum, item) => {
     setLoading(true);
    setSelectedBill(item);

    axios
      .get(`http://localhost:5000/api/bill/GetBillDetails/${Billnum}`)
      .then((res) => {
        setBillItems(res.data);
        setShowBillPopup(true);
      })
      .catch((err) => console.error(err));
       setLoading(false);
  };

  return (
    <div>
      <Head />

      <div className={`main-content ${isOpen ? "shifted" : ""}`}>
        <div className={`background ${isOpen ? "active" : ""}`}>
          <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

          <h1> Today - Bill</h1>

          {/* summary */}
          <div className="itembox">

            <div className="disbox" >
              <img className="box-imag" src="/images/item.png" alt="items" />
              <span>Total Items:</span>
              <span1>
              {loading ?(
                "Loarding..."
              ):totalItems.length > 0 ?(
                `${totalItems}`
              ):( 
                "No Details"
              )}
            </span1>
            </div>

            <div className="disbox">
              <img className="box-imag" src="/images/msale.png" alt="amount" />
              <span>Total Customers:</span>
              <span1>
              {loading ?(
                "Loarding..."
              ):totalCustomer.length > 0 ?(
                `${totalCustomer}`
              ):( 
                "No Details"
              )}
              </span1>
            </div>

            <div className="disbox">
              <img className="box-imag" src="/images/yprofit.png" alt="profit" />
              <span>Total Amount:</span>
              <span1>
                {loading ?(
                "Loarding..."
              ):totalAmount.length > 0 ?(
                `RS:${totalAmount.toFixed(2)}`
              ):( 
                "0.00"
              )}
              </span1>
            </div>

          </div>

          {/* bill table */}
          <div className="card-block">
            <div className="rows">
              <table className="table">

                <caption> Bill Information </caption>

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
                        <td>RS: {item.totalAmount.toFixed(2)}</td>

                        <td>
                          <FaSearch
                            className="Viewbtn"
                            onClick={() => fetchBillDetails(item.Billnum, item)}
                          />
                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>
            <div>          
              <h2>Today Item Selling Distribution </h2>
              {loading ?(
                "Loarding Pie chart..."
              ):chartData.length > 0 ?(


              <ResponsiveContainer width="100%" height={500}>
                <PieChart>

                  <Pie
                    data={chartData}
                    dataKey="totalBILLQuantity"
                    nameKey="itemName"
                    cx="50%"
                    cy="50%"
                    outerRadius={180}
                    label={({ x, y, payload, value }) => (
                      <text 
                        x={x} 
                        y={y} 
                        fill="#000"
                        fontSize={20}   
                        
                        dominantBaseline="central"
                      >
                        {`${payload.itemName} ${payload.packsize} : ${value}`}
                      </text>
                    )}
                  >

                    {chartData.map((entry, index) => (

                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />

                    ))}

                  </Pie>

                  <Tooltip />

                </PieChart>
              </ResponsiveContainer>
              ):(
                <span>No Any Chart Data</span>
              )}
            </div>
          </div>
          <Title/>
        </div>
      </div>

      {/* bill popup */}
      {showbillPopup && selectedBill && (

        <div className="popup-overlay">
          <div className="popup-box">
          <FaTimes className="clos-btn"  onClick={() => setShowBillPopup(false)} />
            <h2>Customer Bill Details</h2>

            <div className="form-viewcustomer">

              <div className="form-view">
                <label>Bill Number:</label>
                <span>{selectedBill.Billnum}</span>
              </div>

              <div className="form-view">
                <label>Customer Name:</label>
                <span>{selectedBill.customerName}</span>
              </div>

              <div className="form-view">
                <label>Total Quantity:</label>
                <span>{selectedBill.totalBILLQuantity}</span>
              </div>

              <div className="form-view">
                <label>Total Amount:</label>
                <span>Rs: {selectedBill.totalAmount.toFixed(2)}</span>
              </div>

              <div className="form-view">
                <label>Seller:</label>
                <span>{selectedBill.seller}</span>
              </div>

            </div>

            <h3>Items</h3>

            <table className="table">

              <thead>
                <tr>
                  <th>Item</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>

              <tbody>

                {billItems.items?.length > 0 ? (

                  billItems.items.map((it, index) => (

                    <tr key={index}>
                      <td>{it.name}</td>
                      <td>{it.packsize} {it.category}</td>
                      <td>{it.quantity}</td>
                      <td>{it.amount.toFixed(2)}</td>
                    </tr>

                  ))

                ) : (

                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      No items available
                    </td>
                  </tr>

                )}

              </tbody>

            </table>


          </div>
          
        </div>

      )}
    </div>
  );
  
}

export default Bill;