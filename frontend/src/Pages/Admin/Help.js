import Head from './Head'
import Sidebar from './Sidebar'
import React, { useState} from "react";
import './css/all.css';
import './css/help.css';

function Help() {
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
                <h1>H e l p _ S e c t i o n   </h1>
                  <div class="container help">
                    <div class="left-section">
                    </div>
                    <div class="right-section">
                      <div class="box-help">
                        <h1>Contact</h1>
                      
                      
                      <p>077-4573584</p>
                      <p>Binuka.lakshan715@gmail.com</p>
</div>
                    </div>
                  </div>
            </div>
        </div>
    </div>
  )
}

export default Help
