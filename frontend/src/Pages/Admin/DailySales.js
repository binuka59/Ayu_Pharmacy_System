import Head from './Head'
import Sidebar from './Sidebar'
import React, { useState} from "react";
import './css/all.css';
import './css/bill.css';
import { FaSearch ,FaCapsules, FaTimes } from "react-icons/fa";
import Title from './title';
import { useEffect } from 'react';
import axios from 'axios';
import html2pdf from "html2pdf.js";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";


function DailySales() {
const [isOpen, setIsOpen] = useState(false);

const [sdate , setDate] = useState("");
const [itemData, setItemData] = useState([]);
const [billData, setBillData] = useState([]);
const [showPopup, setShowPopup] = useState(false); 
const [searchData, setSearchData] = useState([]);  
const [editLoading , setEditLoading] = useState(false);
const [itemShowPopup , setItemShowPopup] = useState(false);
const [avData , setAvData] = useState([]);
const [selectItem , setSelectItem] = useState(null);
const [loarding ,setLoarding] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const totalAmount = billData.reduce(
        (sum, sales) => sum + sales.totalAmount,
    0
    );

    const totalProfit = billData.reduce(
        (sum, sales) => sum + sales.totalProfit,
    0
    );
    const totalQuantity = itemData.reduce(
        (sum, sales) => sum + sales.totalQuantity,
    0
    );

    const searchTotalAmount = searchData.reduce(
        (sum, item) => sum + item.totalAmount,
        0
    );

     const searchTotalProfit = searchData.reduce(
        (sum, item) => sum + item.totalProfit,
        0
    );

 

    useEffect(() => {
        setLoarding(true);
    axios
        .get("http://localhost:5000/api/bill/Dailysales")
        .then((res) => {
        setItemData(res.data.itemWise);
        setBillData(res.data.billWise);
        })
        .catch((err) => console.error(err));
        setLoarding(false);
    }, []);

    const searchDate = (date) =>
    {
        setLoarding(true);
        axios.get(`http://localhost:5000/api/bill/Searchdate/${date}`)
        .then((res)=>
        {

            setSearchData(res.data.itemWise);
            setShowPopup(true);
            
            
        })
        .catch((err) => (console.error(err)));
        setLoarding(false);
        // setDate("");
    };

    const handleDownload = () => {
        setEditLoading(true);
        const element = document.querySelector(".popup-table");

        const opt = {
            margin: 0.5,
            filename: `${sdate}_Sales_Report.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 9},
            jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
        };

        html2pdf().set(opt).from(element).save().then(() => {
        setEditLoading(false); 
        });
    };
    const availableItems = (id ,item) => 
    {
        setSelectItem(item);
        axios.get(`http://localhost:5000/api/bill/AvailableItem/${id}`)
        .then((res)=>
        {
            setAvData(res.data);

            setItemShowPopup(true);

            
        })
        .catch((err) => (console.error(err)));
    };

  return (
    <div>
      <Head />

      <div className={`main-content ${isOpen ? "shifted" : ""}`}>
            <div className={`background ${isOpen ? "active" : ""}`}>
                <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
                <h1>D a i l y   S a l e s   R e p o r t  </h1>
                <div class="itembox">
                    <div class="disbox">
                    <img className="box-imag" src="/images/dailyitem.png" alt="dailyitem" />
                    <span>Sold Items</span>
                    <span1>
                    {loarding ? (
                        "Loarding..."
                    ):totalQuantity >0 ?(
                        `${totalQuantity}`
                    ):(
                        "0"
                    )}
                    </span1>

                    </div>

                    <div class="disbox">
                        <img className="box-imag" src="/images/dailyamount.png" alt="dailyamount" />
                        <span> Amount</span>
                        <span1>
                        {loarding ? (
                            "Loarding..."
                        ):totalAmount >0 ?(
                            `RS:${totalAmount.toFixed(2)}`
                        ):(
                            "No Details"
                        )}
                        </span1>

                    </div> 

                    <div class="disbox">
                        <img className="box-imag" src="/images/dailyprofit.png" alt="dailyprofit" />
                        <span>Profit:</span>
                        <span1>
                        {loarding ? (
                            "Loarding..."
                        ):totalProfit >0 ?(
                            `RS:${totalProfit.toFixed(2)}`
                        ):(
                            "No Details"
                        )}
                        </span1>

                    </div> 

                </div>

            <div className="row">
                <div className="col-md-12 sale-Search-bar">
                    <label className="label">
                    <FaSearch /> Search Date:
                    </label>
                    <input type="date" className="form-control customer-input" value={sdate} 
                    max={new Date().toISOString().split("T")[0]} 
                    onChange={(e) => {setDate(e.target.value); searchDate(e.target.value);setShowPopup(true);}}/>

                </div>
                </div> 
            </div>

            <div className="card-block">
                <div className="rows">

                    <h2>Today Sales Report</h2>

                    <table className="table">
                    <thead>
                        <tr>
                        <th>Description</th>
                        <th>Total</th>
                        <th>Profit</th>
                        <th>💊See More...</th>
                        </tr>
                    </thead>
                    <tbody>
                        { itemData > 0 ?( 
                        itemData.map((item, index) => (
                        <tr key={index}>
                        <td style={{  letterSpacing: "0.5px", wordSpacing: "6px" }}>
                            {item.itemName} {item.packsize}  | Qty: {item.totalQuantity} {item.category}
                        </td>
                            <td>RS: {item.totalAmount.toFixed(2)}</td>
                            <td>RS: {item.totalProfit.toFixed(2)}</td>
                            <td> <FaCapsules  className="capsule-icon" style={{ cursor: "pointer" }} onClick={() =>availableItems(item.id,item)}/></td>
                            
                        </tr>
                        ))
                        ):(
                            <tr>
                                <td colspan="4">No Any Table Data</td>
                            </tr>
                        )}
                    </tbody>
                    </table>
                    {itemShowPopup && avData && (
                        <div className="popup-overlay">
                        <div className="popup-box">
                        <FaTimes className="clos-btn"  onClick={() => setItemShowPopup(false)} />
                            <h2>{selectItem.itemName} {selectItem.packsize} Available Stock</h2>
                        { loarding ?
                        (
                            "Loarding..."
                        ):avData > 0 ? (
                            <div className="form-viewcustomer">
                            <ResponsiveContainer width="100%" height={400}>
                            <PieChart>

                                <Pie
                                data={[
                                    { name: "Stock Quantity", value: avData.stockQty },
                                    { name: "Sold Quantity", value: avData.soldQty }
                                ]}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={150}
                                label={({ name, value }) => `${name}: ${value}`}
                                >
                                <Cell fill="#fac003dc" />
                                <Cell fill="#000000" />
                                </Pie>

                                <Tooltip />

                            </PieChart>
                            </ResponsiveContainer>

                            </div>
                        ):(
                            "NO  Any Chart  Data"
                        )}
                        </div>
                        </div>
                    )}

                </div>
          
            </div>
            {showPopup && searchData && (
            <div className="popup-overlay">
              <div className="popup-box">
                <FaTimes className="clos-btn"  onClick={() => {setShowPopup(false);setDate("");}} />
                <h2>{sdate} Sales Report</h2>
              <div className="popup-table">
                {loarding ?
                (
                    "Loarding..."
                ):searchData.length > 0 ? (
                
                    <table className="table ">                     
                        <thead>
                            <tr>
                            <th>Description</th>
                            <th>Total</th>
                            <th>Profit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchData.map((item, index) => (
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
                                <th>Total Amount</th>
                                <th>Rs: {searchTotalAmount.toFixed(2)}</th>
                            </tr>
                            <tr>
                                <th></th>
                                <th>Total Profit</th>
                                <th>Rs: {searchTotalProfit.toFixed(2)}</th>
                            </tr>
                        </tbody>
                    </table>
                
                ):(
                   "No Any Details." 
                )}
                </div> 

                   
                
                <button className="downbtn" onClick={handleDownload} disabled={editLoading}>  
                     {editLoading ? "Downloading..." : "Download Pdf "}
                </button>
              </div>
            </div>
          )}
            <Title/>
        </div>
    </div>
  )
}

export default DailySales
