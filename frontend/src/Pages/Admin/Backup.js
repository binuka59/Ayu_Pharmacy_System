import Head from './Head'
import Sidebar from './Sidebar'
import React, { useState} from "react";
import './css/all.css';
import './css/backup.css';

function Backup() {
const [isOpen, setIsOpen] = useState(false);
            
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };
  return (
    <div>
      <Head />

      <div className={`main-content ${isOpen ? "shifted" : ""}`}>
            <div className={`background backup ${isOpen ? "active" : ""}`}>
                <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

                    <h1>B a c k u p  </h1>

                  <div class="container">
                    <div class="left-section">
                    </div>
                    <div class="right-section">
                      <div class="box">
                        <h1>Instruction</h1>
                      
                      
                      <p>Backing up data can make the system more efficient.</p>
                      <div class="btn">
                        <input type="button" class="restore" value="Backup Data"></input>
                        <input type="button" class="restore" value="Restore Data"></input>

                      </div>
                      </div>
                    </div>
                  </div>


                
            </div>
        </div>
    </div>
  )
}

export default Backup
