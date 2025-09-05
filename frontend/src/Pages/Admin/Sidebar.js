
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
<<<<<<< HEAD
  FaHandsHelping 
=======
  FaHandsHelping,
  FaTruck
>>>>>>> 792cc480 (second commit)
} from "react-icons/fa";

import { HiUserGroup } from "react-icons/hi";


function Sidebar({ isOpen, toggleSidebar }) {
<<<<<<< HEAD
//  const [isOpen, setIsOpen] = useState(true);

 const [subcustomer, setCustomerOpen] = useState(false);
=======

 const [subcustomer, setCustomerOpen] = useState(false);
 const [subSales, setSalesOpen] = useState(false);
 const [subCategory, setCategoryOpen] = useState(false);
>>>>>>> 792cc480 (second commit)

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

<<<<<<< HEAD
           <li>
            <Link to="/Category" className="menu-item" >
                <span><FaTags /> Category</span>
                <div className="showic">{isOpen ? " " : <FaTags />}</div>
            </Link>
         </li>
=======
          <li>
            <a href="#category" className="menu-item"onClick={(e) => { e.preventDefault(); setCategoryOpen(!subCategory); }}>
                <span><FaTags /> Category</span><div className="showic">{isOpen ? " " : <FaTags />}</div>
            </a> 
            {subCategory && (
            <ul className="submenu">
                <li><Link to="/Category">Add Category</Link></li>
                <li><Link to="/Items">Add Items</Link></li>
                <li><Link to="/SearchItems">Search item</Link></li>
                
            </ul>
            )}
          </li>
>>>>>>> 792cc480 (second commit)
          <li>
            <a href="#customer" className="menu-item"onClick={(e) => { e.preventDefault(); setCustomerOpen(!subcustomer); }}>
              <span><FaUserTie /> Customer</span><div class="showic">{isOpen ? " "  : <FaUserTie /> }</div>
            </a>
            {subcustomer && (
            <ul className="submenu">
                <li><Link to ="/Customer">Add Customer</Link></li>
<<<<<<< HEAD
                <li><a href="#button">View Customer</a></li>
=======
                <li><Link to="/ViewCustomer">View Customer</Link></li>
>>>>>>> 792cc480 (second commit)
                <li><a href="#label">Label Badge</a></li>
                
            </ul>
            )}
          </li>
          
         <li>
            <Link to="/Staffhome" className="menu-item">
              <span><HiUserGroup /> Staff</span><div class="showic">{isOpen ? " "  : <HiUserGroup /> }</div>
            </Link>
          </li>
<<<<<<< HEAD
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
=======

         <li>
            <Link to="/Supplier" className="menu-item">
              <span>< FaTruck /> Supplier</span><div class="showic">{isOpen ? " "  : < FaTruck /> }</div>
            </Link>
          </li>

          <li>
            <Link to ="/Bill" className="menu-item">
              <span><FaFileInvoice /> Bill</span><div class="showic">{isOpen ? " "  : <FaFileInvoice /> }</div>
            </Link>
          </li>
          <li>
            <a href="#sales" className="menu-item"onClick={(e) => { e.preventDefault(); setSalesOpen(!subSales); }}>
            
              <span><FaChartLine /> Sales</span><div class="showic">{isOpen ? " "  : <FaChartLine /> }</div>
            </a>
            {subSales && (
            <ul className="submenu">
                <li><Link to ="/SalesDaily">Daily Sales</Link></li>
                <li><Link to="/SalesMonthly">Monthly sales</Link></li>
                <li><Link to="/SalesYearly">Yearly sales</Link></li>
                
            </ul>
            )}
            
          </li>
          
          <li>
            <Link to="/Backup" className="menu-item">
              <span><FaCloudDownloadAlt /> Backup</span><div class="showic">{isOpen ? " "  : <FaCloudDownloadAlt /> }</div>
            </Link>
          </li>

           <li>
            <Link to="/Help" className="menu-item">
              <span><FaHandsHelping  /> Help</span><div class="showic">{isOpen ? " "  : <FaHandsHelping  /> }</div>
            </Link>
>>>>>>> 792cc480 (second commit)
          </li>
        </ul>
      </aside>

    </div>
 
  </div>
  );
}

export default Sidebar
