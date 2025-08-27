
import './css/Admin.css';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { Trans } from 'react-i18next';
import { useNavigate } from "react-router-dom";

import React, { useState,useEffect} from "react";
import {
  FaHome,
  FaTags,
  FaUserTie,
  FaFileInvoice,
  FaChartLine,
  FaBars,
  FaTimes,
  FaCloudDownloadAlt,
  FaHandsHelping 
} from "react-icons/fa";


function Sidebar() {
 const [isOpen, setIsOpen] = useState(true);
 const [submenuOpen, setSubmenuOpen] = useState(false);
 const [subcustomer, setCustomerOpen] = useState(false);

  return (
    <div>

    <div className="dashboard">
      
      {/* Mobile Toggle Button */}
 

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <ul>
          <li>
            <a href="#dashboard" className="menu-item">
              <span><FaHome /> Dashboard</span>
              <div class="showic">{isOpen ? " "  : <FaHome /> }</div>
            </a>
          </li>
          <li>
            <a href="#category" className="menu-item" onClick={(e) => { e.preventDefault(); setSubmenuOpen(!submenuOpen); }}>
                <span><FaTags /> Category</span>
                <div className="showic">{isOpen ? " " : <FaTags />}</div>
            </a>
            {submenuOpen && (
            <ul className="submenu">
                <li><a href="#accordion">Accordion</a></li>
                <li><a href="#button">Button</a></li>
                <li><a href="#label">Label Badge</a></li>
                <li><a href="#grid">Grid System</a></li>
            </ul>
            )}
         </li>
          <li>
            <a href="#customer" className="menu-item"onClick={(e) => { e.preventDefault(); setCustomerOpen(!subcustomer); }}>
              <span><FaUserTie /> Customer</span><div class="showic">{isOpen ? " "  : <FaUserTie /> }</div>
            </a>
            {subcustomer && (
            <ul className="submenu">
                <li><a href="#accordion">Add Customer</a></li>
                <li><a href="#button">View Customer</a></li>
                <li><a href="#label">Label Badge</a></li>
                
            </ul>
            )}
          </li>
          <li>
            <a href="#bill" className="menu-item">
              <span><FaFileInvoice /> Bill</span><div class="showic">{isOpen ? " "  : <FaFileInvoice /> }</div>
            </a>
          </li>
          <li>
            <a href="#sales" className="menu-item">
              <span><FaChartLine /> Sales</span><div class="showic">{isOpen ? " "  : <FaChartLine /> }</div>
            </a>
          </li>
          
          <li>
            <a href="#backup" className="menu-item">
              <span><FaCloudDownloadAlt /> Backup</span><div class="showic">{isOpen ? " "  : <FaCloudDownloadAlt /> }</div>
            </a>
          </li>

           <li>
            <a href="#help" className="menu-item">
              <span><FaHandsHelping  /> Help</span><div class="showic">{isOpen ? " "  : <FaHandsHelping  /> }</div>
            </a>
          </li>
        </ul>
      </aside>
        <button  className={`toggle-btn ${isOpen ? "open" : "close"}`} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FaTimes /> : <FaBars />}
        </button>
    </div>
 
    </div>
  );
}

export default Sidebar
