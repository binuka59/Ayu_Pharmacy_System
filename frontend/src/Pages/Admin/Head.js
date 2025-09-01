import React from 'react';
import './css/head.css';
import { FaBell,FaCog, FaUser, FaSignOutAlt } from "react-icons/fa";

function Head() {
      const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };
    
  return (
<div class="sidebar-mini fixed"> 
      <div class="wrapper">
        <header class="main-header-top hidden-print">
          <div class="banner-head">
            <div class="logo-row-f">
                <span>A<span1>yu</span1></span>
            </div>
            <div class="logo-row-s">
              <img class="img-fluid logo" src="/logo1.png" alt="logo"/>
              <span>P<span1>harmacy</span1></span>
            </div>
          </div>
        

          <nav class="nav">
          
            <ul class="top-nav lft-nav">
              {/* <h4>Hi,Good Morning</h4> */}
            </ul>
            <div class="navbar-custom-menu f-right">


              <ul class="top-nav">
                <li class="dropdown notification-menu">
                 
                    <div class="icons"><FaBell /></div>
                    <span class="badge  header-badge">9</span>
                  
                  <ul class="dropdown-menu">
                    <li class="not-head">You have <b class="text-primary">4</b> new notifications.</li>
                    <li class="bell-notification">
                      <a href="" class="media">
                           <div class="media-body">
                                <span class="block">Lisa sent you a mail</span>
                                
                           </div>
                      </a>
                    </li>

                    <li class="not-footer">
                      See all notifications.
                    </li>
                  </ul>
                </li>
                
            
                <li class="dropdown">
                  <a href="#!" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" class="dropdown-toggle drop icon-circle drop-image">
                    <span>
                      <img class="img-circle " src="/logo1.png" style={{width:"40px",border:"3px solid black"}} alt="User Image"/>
                    </span>
                    <span>John <i class=" icofont icofont-simple-down"></i></span>

                  </a>
                  <ul class="dropdown-menu settings-menu">
                    <li><a href="#!"><i class="icon-profile"><FaCog/></i>  Settings</a></li>
                    <li><a href="#"><i class="icon-profile"><FaUser/></i>  Profile</a></li>
                    <li onClick={toggleFullScreen}><a href="#"><i class="icon-profile"><FaUser/></i>  Full Screen</a></li>
                    
                    
                    <li class="p-0">
                        <div class="dropdown-divider m-0"></div>
                    </li>
                    
                    <li><a href=""><i class="icon-profile"><FaSignOutAlt/> </i>  Logout</a></li>

                  </ul>
                </li>
              </ul>
            </div>
          </nav>
        </header>
      </div>
    </div>
  )
}

export default Head
