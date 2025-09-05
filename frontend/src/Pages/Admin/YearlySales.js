import Head from './Head'
import Sidebar from './Sidebar'
import React, { useState} from "react";
import './css/all.css';
import './css/bill.css';

function YearlySales() {
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
                <h1>Y e a r l y  S a l e s    R e p o r t  </h1>
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
            </div>
        </div>
    </div>
  )
}

export default YearlySales
