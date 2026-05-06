import Head from './Head'
import Sidebar from './Sidebar'
import React, { useEffect, useState} from "react";
import './css/all.css';
import './css/year.css';
import axios from 'axios';
import Title from './title';
import {FaSearch , FaTimes, FaChartBar  } from 'react-icons/fa';
import "react-datepicker/dist/react-datepicker.css";
import html2pdf from "html2pdf.js";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function YearlySales() {
const [isOpen, setIsOpen] = useState(false);
const [loarding , setLoading] = useState(false);
const [yearData , setYearData] = useState([]);
const [error, setError] = useState('');
const [year , setYear] = useState('');
const [ShowPopup , setShowPopup] = useState(false);
const [searchYears ,setSearchYear] = useState([]);
const [totalAmount, setTotalAmount] = useState(0);
const [totalProfit, setTotalProfit] = useState(0);
const [totalQuantity, setTotalQuantity] = useState(0);
const [YearName, setYearName] = useState(0);
const [yearlySale ,setYearlySales] = useState([]);
const [barChartPopup , setBarChartShowPopup] = useState(false);
const [chartData, setChartData] = useState([]);
const [itemDetail, setItemDetail] = useState(0);
const [editLoading , setEditLoading] = useState(false);
const [topItem, setTopItem] = useState(null);
const [comData, setComparetData] = useState([]);

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - i);


            
const toggleSidebar = () => {
    setIsOpen(!isOpen);
};

useEffect(() => {
    axios.get("http://localhost:5000/api/bill/YearlySale")
    .then((res) => {
      setYearlySales(res.data.itemWise);
      setYearData(res.data);
      setTopItem(res.data.topItem);
      setComparetData(res.data.yearSale);
      setLoading(false);
    })
    .catch((err) => console.error(err));
    setLoading(false);


}, []);

useEffect(() => {
    let timer;

  
    if (error) {
      timer = setTimeout(() => {
        setError("");
      }, 2000);
    }
  
    return () => clearTimeout(timer); 
  }, [error]);

    const searchYear = (selectedYear) => {
      axios.get(`http://localhost:5000/api/bill/SearchYear/${selectedYear}`)
        .then((res) => {

          setSearchYear(res.data.itemWise);
          setTotalAmount(res.data.totalAmount);
          setTotalProfit(res.data.totalProfit);
          setTotalQuantity(res.data.totalQuantity);           
          setYearName(res.data.years);

          setError(""); 
          setShowPopup(true);
          setYear("");

        })
        .catch((err) => {

          if (err.response && err.response.data.error) {
            setError(err.response.data.error); 
          } else {
            setError("Something went wrong");
          }
          setYear("");
          setShowPopup(false); 
        });
    };

    const handleDownload = () => {
        setLoading(true);
        const element = document.querySelector(".popup-table");

        const opt = {
            margin: 0.5,
            filename: `${YearName}_Sales_Report.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 9},
            jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
        };

        html2pdf().set(opt).from(element).save().then(() => {
        setLoading(false); 
        });
    };

    const FindItem = (itemId,sale) => {
      axios.get(`http://localhost:5000/api/bill/YearlySold/${itemId}`)
        .then((res) => {
          setItemDetail(sale);
          const sorted = res.data.yearSale.sort((a, b) => a.month - b.month);
          setChartData(sorted);
          setBarChartShowPopup(true);

        })
        .catch((err) => {

          setBarChartShowPopup(false); 
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


  return (
    <div>
      <Head />

      <div className={`main-content ${isOpen ? "shifted" : ""}`}>
            <div className={`background ${isOpen ? "active" : ""}`}>
                <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
                <h1>Y e a r l y  S a l e s    R e p o r t  </h1>
                <div class="itembox">
                    <div class="disbox">
                        <img className="box-imag" src="/images/item.png" alt="items" />
                        <span>Sold Items:</span>
                        <span1>
                            {loarding?(
                                "Loarding..."
                            ):yearData?.totalQuantity > 0 ? (
                             `${yearData.totalQuantity}`
                            ):( "No Any Data"
                            )}
                        </span1>

                    </div>

                    <div class="disbox">
                        <img className="box-imag" src="/images/ysale.png" alt="amount" />
                        <span> Total Amount:</span>
                        <span1>
                            {loarding?(
                                "Loarding..."
                            ):yearData?.totalAmount > 0 ?(
                                `Rs:${yearData.totalAmount.toFixed(2)}`
                            ):
                            (
                                "No Any Data"
                            )}
                        </span1>

                    </div> 

                    <div class="disbox">
                        <img className="box-imag" src="/images/yprofit.png" alt="profit" />
                        <span>Profit:</span>
                        <span1>
                        {loarding?
                        ( 
                            "Loarding..."
                        ):yearData?.totalProfit > 0 ?(
                            `RS:${yearData.totalProfit.toFixed(2)}`
                        ):
                        (
                            "No Any Data"
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
                            <FaSearch /> Search Year:
                        </label>
                      <div className="custselect">
                        <select
                          className="form-control"
                          value={year}
                          onChange={(e) => {
                            setYear(e.target.value);
                            searchYear(e.target.value);
                          
                          }}
                        >  
                          <option value="">Select the year</option>              
                          {years.map((y) => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                      </div>
                    </div> 
                </div>
                {ShowPopup && searchYears && (
                            <div className="popup-overlay">
                              <div className="popup-box">
                                <FaTimes  className="clos-btn" onClick={() => setShowPopup(false)} />   
                                <div className="popup-table">
                                <h2>{YearName} Sales Report</h2>
                                    <table className="table ">                     
                                        <thead>
                                            <tr>
                                            <th>Description</th>
                                            <th>Total</th>
                                            <th>Profit</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {searchYears.map((item, index) => (
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
                                                  {totalQuantity ? totalQuantity : "Loading..."}
                                                </th>
                                            </tr>
                                            <tr>
                                                <th></th>
                                                <th>Total Amount :</th>
                                                <th>
                                                  Rs: {totalAmount !== null && totalAmount !== undefined 
                                                    ? totalAmount.toFixed(2) 
                                                    : "Loading..."}
                                                </th>
                                            </tr>
                                            <tr>
                                                <th></th>
                                                <th>Total Profit :</th>
                                                <th>Rs: {totalProfit.toFixed(2) ? totalProfit : "Loarding..." }</th>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div> 
                 
                                <button className="downbtn" onClick={handleDownload} disabled={loarding}>  
                                     {loarding ? "Downloading..." : "Download Pdf "}
                                </button>
                              </div>
                            </div>
                )}

                  <div className="card-block">
                    <div className="rows ">
                      <div className=" report">
                          <h2>{yearData.year} Sales Report</h2>

                        <table className="table">
                          <thead>
                              <tr>
                              <th>Items</th>
                              <th>Amount</th>
                              <th>Profit</th>
                              <th>Chart</th>
                              </tr>
                          </thead>
                          <tbody>
                            {yearlySale.length > 0 ? (
                              yearlySale.map((sale, index) => (
                              <tr key={index}>
                              <td style={{  letterSpacing: "0.5px", wordSpacing: "6px" }}>
                              {sale.itemName} {sale.packsize}  {sale.totalQuantity}{sale.category}  Sold Out
                              </td>
                              <td>RS: {sale.totalAmount.toFixed(2)}</td>
                              <td>RS: {sale.totalProfit.toFixed(2)}</td>
                              <td> <FaChartBar  className="capsule-icon" style={{ cursor: "pointer" }} onClick={() =>FindItem(sale.itemId, sale)}/></td>
                                  
                              </tr>
                              ))
                              ):(
                                <tr>
                                  <td colspan="4">No Any Data</td>
                                </tr>
                              )}
                              <tr>
                                <td colspan="2"></td>
                                <th>Total Items:- </th>
                                <th> {loarding
                                    ? "Loading..."
                                    : yearData?.totalQuantity
                                    ? `${yearData.totalQuantity}`
                                    : "No Data"}
                                </th>
                              </tr>
                              <tr>
                                <td colspan="2"></td>
                                <th>Total Amount:- </th>
                                <th>
                                  {loarding
                                    ? "Loading..."
                                    : yearData?.totalAmount
                                    ? `  Rs: ${yearData.totalAmount.toFixed(2)}`
                                    : "No Data"}
                                </th>
                              </tr>
                              <tr>
                                <td colspan="2"></td>
                                <th>Profit:- </th>
                                <th>
                                  {loarding
                                    ? "Loading..."
                                    : yearData?.totalProfit
                                    ? `  Rs: ${yearData.totalProfit.toFixed(2)}`
                                    : "No Data"}
                                </th>
                              </tr>

                          </tbody>
                          </table>

                      {barChartPopup && itemDetail && (
                        <div className="popup-overlay">
                          <div className="chart-box">

                          <FaTimes className="clos-btn"  onClick={() => setBarChartShowPopup(false)} />

                          <h2> {itemDetail.itemName} {itemDetail.packsize}  MonthWise Sales</h2>
                          {loarding ? (
                              "Loading chart..."
                            ) : chartData.length > 0 ? (
                              <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chartData}>

                                  <XAxis
                                    dataKey="monthName"
                                    label={{
                                      value: "Month of Year",
                                      position: "insideBottom",
                                      offset: -3 ,
                                      style: {fontWeight: "bold", fontSize: 15, fill: "#000000"}
                                    }}
                                  />

                                  <YAxis
                                    label={{
                                      value: "Sales ",
                                      angle: -90,
                                      position: "insideLeft",
                                      style: {fontWeight: "bold",fontSize: 16, fill: "#000000"}
                                    }}
                                  />

                                  <Tooltip />
                                  <Bar dataKey="totalQuantity" fill="#d4b607c4" label={{value:"totalQuantity",style: {
                                    fontWeight: "bold",fontSize: 20, fill: "#fffbfb",angle: -90}}} />
                                  <Bar dataKey="totalAmount" fill="#020344c4" label={{value:"totalAmount", style: {
                                    fontWeight: "bold",fontSize: 20, fill: "#fffbfb",angle: -90}}} />
                                  <Bar dataKey="totalProfit" fill="#404041e8" label={{value:"totalProfit",style: {
                                    fontWeight: "bold",fontSize: 20, fill: "#fffbfb",angle: -90}}} />


                                </BarChart>
                                
                              </ResponsiveContainer>
                            ) : (
                              "No Any Chart Data"
                            )}
                          </div>
                        </div>
                      )}                 
                    </div>
                      <button className="downloadbtn" onClick={reportDownload} disabled={editLoading}>  
                        {editLoading ? "Downloading..." : "Download Pdf "}
                      </button>    
                  </div>
                </div> 
              <div className="card-block Year-sale">
                <h2> Year Analyse</h2>
                <div className="page">
                  <div className="section left">
                    <h2> Top Selling Item</h2>

                    <div className="topitem">
                      
                        <img className="img-fluid" src="/images/bestitem.png" alt="profit"/>
                      <div className="show">
                        <h2 className="head">
                          {topItem?.name 
                            ? `${topItem.name} (${topItem.packsize})`
                            : "No Data"}
                        </h2>
                        <p > {topItem?.qty || 0} items sold </p>
                      </div>
                       
                    </div>  

                  </div>
                    <div className="section right">
                      <h2>Compare Multiple Years</h2>


                        <div className="">
                          {loarding ? (
                              "Loading chart..."
                            ) : comData.length > 0 ? (
                              <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={comData}>

                                  <XAxis
                                    dataKey="year"
                                    label={{
                                      value: "Year",
                                      position: "insideBottom",
                                      offset: -3 ,
                                      style: {fontWeight: "bold", fontSize: 15, fill: "#000000"}
                                    }}
                                  />

                                  <YAxis
                                    label={{
                                      value: "Sales (RS)",
                                      angle: -90,
                                      position: "insideLeft",
                                      style: {fontWeight: "bold",fontSize: 16, fill: "#000000"}
                                    }}
                                  />

                                  <Tooltip />
                                  <Bar dataKey="totalAmount" fill="#ffee00" label={{value:"totalAmount",style: {
                                    fontWeight: "bold",fontSize: 20, fill: "#fffbfb",angle: -90}}} />
                                  <Bar dataKey="totalProfit" fill="#2c2c2bc4" label={{value:"totalProfit",style: {
                                    fontWeight: "bold",fontSize: 20, fill: "#fffbfb",angle: -90}}} />

                                </BarChart>
                                
                              </ResponsiveContainer>
                            ) : (
                              "No Any Chart Data"
                          )}
                        </div>

                   </div>
                </div>
              
              </div>
            <Title/>
          </div>
        </div>
    </div>
  )
}

export default YearlySales
