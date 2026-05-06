import Head from './Head';
import Sidebar from './Sidebar';
import React, { useState, useEffect } from "react";
import './css/all.css';
import './css/bill.css';
import axios from 'axios';
import {PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line ,Cell } from "recharts";
import {FaSearch , FaTimes , FaCapsules } from 'react-icons/fa';
import html2pdf from "html2pdf.js";
import Title from './title';

function MonthlySales() {

  const [isOpen, setIsOpen] = useState(false);
  const [salesData, setSalesData] = useState({});
  const [chartData, setChartData] = useState([]);
  const [Month ,setMonth ] = useState("");
  const [sMonth, setSearchMonth] = useState([]); 
  const [showPopup , setShowPopup] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editLoading , setEditLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [monthname, setMonthName] = useState(0);
  const [YearName, setYearName] = useState(0);
  const [barChartPopup, setBarChartPopup] = useState(false);
  const [profitPopup, setProfitPopup] = useState(false);
  const [monthlysale,setMonthlyTotalSale] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemShowPopup ,setItemShowPopup] = useState(false);
  const [itemData , setItemData] = useState([]);

    const COLORS = [
    "#0088FE",
    "#02745f",
    "#FFBB28",
    "#FF8042",
    "#e91e63",
    "#4a0257",
  ];

 

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };



    const searchMonth = (Month) => {
      axios.get(`http://localhost:5000/api/bill/SearchMonth/${Month}`)
        .then((res) => {

          setSearchMonth(res.data.itemWise);
          setTotalAmount(res.data.totalAmount);
          setTotalProfit(res.data.totalProfit);
          setTotalQuantity(res.data.totalQuantity);           
          setYearName(res.data.year);
          setMonthName(res.data.monthName);

          setError(""); 
          setShowPopup(true);
          setMonth("");

        })
        .catch((err) => {

          if (err.response && err.response.data.error) {
            setError(err.response.data.error); 
          } else {
            setError("Something went wrong");
          }
          setMonth("");
          setShowPopup(false); 
        });
    };

    const handleDownload = () => {
        setEditLoading(true);
        const element = document.querySelector(".popup-table");

        const opt = {
            margin: 0.5,
            filename: ` ${YearName} / ${monthname}_Sales_Report.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 9},
            jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
        };

        html2pdf().set(opt).from(element).save().then(() => {
        setEditLoading(false); 
        });
    };

    const reportDownload = () => {
        setEditLoading(true);
        const element = document.querySelector(".report");

        const opt = {
            margin: 0.5,
            filename: `Monthly_Sales_Report.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 9},
            jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
        };

        html2pdf().set(opt).from(element).save().then(() => {
        setEditLoading(false); 
        });
    };

 
useEffect(() => {
  setLoading(true);
  axios.get("http://localhost:5000/api/bill/MonthlySale")
    .then((res) => {
      setSalesData(res.data);
      
    })
    .catch((err) => console.error(err));
   

  axios.get("http://localhost:5000/api/bill/MonthlyAnalytics")
    .then((res) => {
      const sorted = res.data.days.sort((a, b) => a.day - b.day);
      setChartData(sorted);
      setMonthlyTotalSale(res.data.days);
    })
    .catch((err) => console.error(err));
     setLoading(false);
}, []);

const ShowSales = (saledate) =>
  {   
  axios.get(`http://localhost:5000/api/bill/DateSales/${saledate}`)
  .then((res)=>
    {
    setItemShowPopup(true);
    setItemData(res.data.items);
          
  })
  .catch((err) => (console.error(err)));
  };

  useEffect(() => {
    let timer;
  
    if (successMessage) {
      timer = setTimeout(() => {
        setSuccessMessage("");     
      }, 2000);
    }
  
    if (error) {
      timer = setTimeout(() => {
        setError("");
      }, 2000);
    }
  
    return () => clearTimeout(timer); 
  }, [successMessage, error]);

  return (
    <div>
      <Head />

      <div className={`main-content ${isOpen ? "shifted" : ""}`}>
        <div className={`background ${isOpen ? "active" : ""}`}>
          
          <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

          <h1>M o n t h l y  S a l e s  R e p o r t</h1>

          <div className="itembox">

            <div className="disbox">
               <img className="box-imag" src="/images/item.png" alt="dailyitem" />
              <span>Sold Items:</span>
              <span1>
               {loading ? (
                  "Loading..."
                ) : salesData?.totalQuantity > 0 ? (
                  ` ${salesData.totalQuantity}`
                ) : (
                  "No Data"
                )}
              </span1>
            </div>

            <div className="disbox">
               <img className="box-imag" src="/images/msale1.png" alt="dailyitem" />
              <span>Sub Total:</span>
              <span1>
                {loading ? (
                  "Loading..."
                ) : salesData?.totalAmount > 0 ? (
                  `Rs: ${salesData.totalAmount.toFixed(2)}`
                ) : (
                  "No Data"
                )}
              </span1>
            </div>

            <div className="disbox">
               <img className="box-imag" src="/images/mprofit.png" alt="dailyitem" />
              <span>Monthly Profit:</span>
              <span1>
                {loading ? (
                  "Loading..."
                ) : salesData?.totalProfit > 0 ? (
                  `Rs: ${salesData.totalProfit.toFixed(2)}`
                ) : (
                  "No Data"
                )}
              </span1>
            </div>

          </div>
          <div class="messageshow">

            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
            <div className="row">
              <div className="col-md-4 sale-Search-bar">
                    <label className="label">
                    <FaSearch /> Search Month:
                    </label>
                    <input
                      type="month"
                      className="form-control customer-input"
                      value={Month}
                      onChange={(e) => {
                        setMonth(e.target.value);
                        searchMonth(e.target.value);
                        setShowPopup(true);
                      }} 
                      placeholder="Select the Month"
                    />
                    
                </div> 
            </div>

          {showPopup && searchMonth && (
            <div className="popup-overlay">
              <div className="popup-box">
                <FaTimes className="clos-btn"  onClick={() => setShowPopup(false)} />
                <div className="popup-table">
                <h2>{YearName} / {monthname} Sales Report</h2>
                    <table className="table ">                     
                        <thead>
                            <tr>
                            <th>Description</th>
                            <th>Total</th>
                            <th>Profit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sMonth.map((item, index) => (
                            <tr key={index}>
                            <td style={{  letterSpacing: "0.5px", wordSpacing: "6px" }}>
                                {item.itemName} {item.packsize}  | Qty: {item.totalQuantity} {item.category}
                            </td>
                                <td>RS: {item.totalAmount.toFixed(2)}</td>
                                <td>RS: {item.totalProfit.toFixed(2)}</td>
                            </tr>
                            ))}
                            <tr>
                                <th></th>
                                <th>Total Sold Items :</th>
                                <th>
                                  {loading ?(
                                    "Loarding..."
                                  ):totalQuantity > 0 ?( 
                                    `${totalQuantity}`
                                  ):(
                                    "No data"
                                  )}
                                </th>
                            </tr>
                            <tr>
                                <th></th>
                                <th>Total Amount :</th>
                                <th>
                                  {loading ?(
                                    "Loarding..."
                                  ):totalAmount> 0 ?(
                                    `RS:${totalAmount.toFixed(2)}`
                                  ):(
                                    "0.00"
                                  )}
                                </th>
                            </tr>
                            <tr>
                                <th></th>
                                <th>Total Profit :</th>
                                <th>
                                  {loading ?(
                                    "Loarding..."
                                  ):totalProfit> 0 ?(
                                    `RS:${totalProfit.toFixed(2)}`
                                  ):(
                                    "0.00"
                                  )}
                               </th>
                            </tr>
                        </tbody>
                    </table>
                </div> 

                   
                
                <button className="downbtn" onClick={handleDownload} disabled={editLoading}>  
                     {editLoading ? "Downloading..." : "Download Pdf "}
                </button>
              </div>
            </div>
          )}

          <div className="chartShow"> 
              <div className="disboxs"> 
                <span1>
                  <img className="img-fluid" src="/images/profit.png" alt="profit" onClick={() => setProfitPopup(true)} />
                </span1>
              </div> 
              <div className="disboxs"> 
                <span1>
                  <img className="img-fluid" src="/images/sales3.png" alt="sales" onClick={() => setBarChartPopup(true)}/>
                </span1>
              </div> 
            

              {barChartPopup && (
                <div className="popup-overlay">
                  <div className="popup-box">

                    {/* Close Button */}
                    <FaTimes className="clos-btn"  onClick={() => setBarChartPopup(false)} />

                  <h2>Daywise Sales</h2>
                  {loading ? (
                      "Loading chart..."
                    ) : chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>

                          <XAxis
                            dataKey="day"
                            label={{
                              value: "Day of Month",
                              position: "insideBottom",
                              offset: -5
                            }}
                          />

                          <YAxis
                            label={{
                              value: "Sales Amount (Rs)",
                              angle: -90,
                              position: "insideLeft"
                            }}
                          />

                          <Tooltip />

                          <Bar dataKey="totalAmount" fill="#0af1f1c4" />

                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      "No Any Chart Data"
                    )}
                  </div>
                </div>
              )}

            {profitPopup &&(
                 <div className="popup-overlay">
                    <div className="popup-box">

                      {/* Close Button */}
                      <FaTimes  className="clos-btn" onClick={() => setProfitPopup(false)} />
                    <h2>Profit Trend</h2>
                {loading ? (
                  "Loading chart..."
                  )
                  :chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>

                          {/* X Axis */}
                          <XAxis 
                            dataKey="day"
                            label={{
                              value: "Day of Month",
                              position: "insideBottom",
                              offset: -5,
                              style: { fontWeight: "bold", fontSize: 14 }
                            }}
                            tick={{ fontWeight: "bold", fontSize: 12 }}
                          />

                          {/* Y Axis */}
                          <YAxis 
                            label={{
                              value: "Profit (Rs)",
                              angle: -90,
                              position: "insideLeft",
                              style: { fontWeight: "bold", fontSize: 14 }
                            }}
                            tick={{ fontWeight: "bold", fontSize: 12 }}
                          />

                          {/* Tooltip */}
                          <Tooltip />

                          {/* Line */}
                          <Line 
                            type="monotone" 
                            dataKey="totalProfit" 
                            stroke="rgb(196, 0, 0)"
                            strokeWidth={4}  
                            dot={{ r: 5 }}    
                            activeDot={{ r: 8 }} 
                          />

                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      "No Any Chart Data"
                    )}
              </div>
            </div>
            )}
          </div>

            <div className="card-block">

              <div className="rows ">
                <div className=" report">
                    <h2>Monthly Sales Report</h2>

                  <table className="table">
                    <thead>
                        <tr>
                        <th>Date</th>
                        <th>Item Count</th>
                        <th>Amount</th>
                        <th>Profit</th>
                        <th>💊See More...</th>
                        </tr>
                    </thead>
                    <tbody>
                      {monthlysale.length > 0 ? (
                        monthlysale.map((sale, index) => (
                        <tr key={index}>
                        <td>{sale.day}</td>
                        <td style={{  letterSpacing: "0.5px", wordSpacing: "6px" }}>
                         {sale.totalQuantity} Sold Out
                        </td>
                        <td> Rs: {sale.totalAmount ? sale.totalAmount.toFixed(2) : "0.00"}</td>
                        <td> Rs: {sale.totaProfit ? sale.totaProfit.toFixed(2) : "0.00"}</td>
                        <td> <FaCapsules  className="capsule-icon" style={{ cursor: "pointer" }} onClick={() =>ShowSales(sale.day)}/></td>
                            
                        </tr>
                        ))
                        ):(
                          <tr>
                            <td colspan="5">No Any Data</td>
                          </tr>
                        )}
                        <tr>
                          <td colspan="4"></td>
                          <th>Total Items:- 
                            {loading
                              ? "Loading..."
                              : salesData?.totalQuantity
                              ? `${salesData.totalQuantity}`
                              : "No Data"}
                          </th>
                        </tr>
                        <tr>
                          <td colspan="4"></td>
                          <th>Total Amount:- 
                            {loading
                              ? "Loading..."
                              : salesData?.totalAmount
                              ? `  Rs: ${salesData.totalAmount.toFixed(2)}`
                              : "No Data"}
                          </th>
                        </tr>
                        <tr>
                          <td colspan="4"></td>
                          <th>Profit:- 
                            {loading
                              ? "Loading..."
                              : salesData?.totalProfit
                              ? `  Rs: ${salesData.totalProfit.toFixed(2)}`
                              : "No Data"}
                          </th>
                        </tr>

                    </tbody>
                    </table>
                    {itemShowPopup && itemData &&  (
                      <div className="popup-overlay">
                        <div className="popup-box">
                          <FaTimes  className="clos-btn" onClick={() => setItemShowPopup(false)} />         
                            <h2> Item Selling Distribution </h2>
                    
                              <ResponsiveContainer width="100%" height={500}>
                                <PieChart>
                    
                                      <Pie
                                        data={itemData}
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
                    
                                        {itemData.map((entry, index) => (
                    
                                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    
                                        ))}
                    
                                      </Pie>
                    
                                      <Tooltip />
                    
                                    </PieChart>
                                  </ResponsiveContainer>
                                      
                    <table className="table">
                    <thead>
                        <tr>

                        </tr>
                    </thead>
                    <tbody>
                      {itemData.length > 0 ? (
                        itemData.map((sale, index) => (
                        <tr key={index}>
                        <th>{sale.itemName} {sale.packsize}</th>
                        <td style={{  letterSpacing: "0.5px", wordSpacing: "6px" }}>
                          {sale.totalBILLQuantity} Sold Out
                        </td>
                       </tr>
                        ))
                        ):(
                          <tr>
                            <td colspan="3">No Any Data</td>
                          </tr>
                        )}
                    </tbody>
                    </table>

                        </div>
                        </div>
                    )}
                  </div>
                  <button className="downloadbtn" onClick={reportDownload} disabled={editLoading}>  
                      {editLoading ? "Downloading..." : "Download Pdf "}
                  </button>
                </div>


            </div>

        
        </div><Title/>
      </div>
    </div>
  );
}

export default MonthlySales;