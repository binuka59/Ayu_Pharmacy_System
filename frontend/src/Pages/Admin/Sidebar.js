
import './css/sidebar.css';
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

import { HiUserGroup } from "react-icons/hi";


function Sidebar({ isOpen, toggleSidebar }) {
//  const [isOpen, setIsOpen] = useState(true);

 const [subcustomer, setCustomerOpen] = useState(false);

  return (
  <div>
      <div className="dashboard">
        {/* Sidebar */}
        <aside className={`sidebar ${isOpen ? "open" : ""}`}>
          <ul>
            <li>
              <div className={ `menu-item ${isOpen ? "open" : "close"}`} onClick={toggleSidebar}>
                <span></span> 
                <div className="showic">{isOpen ? <FaTimes />: <FaBars />}</div>
              </div>
            </li>

            <li>
              <Link to="/Admin" className="menu-item">
                <span><FaHome /> Dashboard</span>
                <div className="showic">{isOpen ? " " : <FaHome />}</div>
              </Link>
            </li>

           <li>
            <Link to="/Category" className="menu-item" >
                <span><FaTags /> Category</span>
                <div className="showic">{isOpen ? " " : <FaTags />}</div>
            </Link>
         </li>
          <li>
            <a href="#customer" className="menu-item"onClick={(e) => { e.preventDefault(); setCustomerOpen(!subcustomer); }}>
              <span><FaUserTie /> Customer</span><div class="showic">{isOpen ? " "  : <FaUserTie /> }</div>
            </a>
            {subcustomer && (
            <ul className="submenu">
                <li><Link to ="/Customer">Add Customer</Link></li>
                <li><a href="#button">View Customer</a></li>
                <li><a href="#label">Label Badge</a></li>
                
            </ul>
            )}
          </li>
          
         <li>
            <Link to="/Staffhome" className="menu-item">
              <span><HiUserGroup /> Staff</span><div class="showic">{isOpen ? " "  : <HiUserGroup /> }</div>
            </Link>
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

    </div>
 
  </div>
  );
}

export default Sidebar
