import './css/head.css';
import './css/Admin.css';

import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { Trans } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import Head from './Head'
import Sidebar from './Sidebar'
import React, { useState,useEffect} from "react";





function Homepage() {

  return (
    <div>
    
      <Sidebar/>
      <Head/>
    </div>
  )
};

export default Homepage
