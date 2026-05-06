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

  const handleBackup = async () => {
    const res = await fetch("http://localhost:5000/api/backup/backups");
    const data = await res.json();
    alert(data.message);
  };

const handleRestore = async () => {
  const fileName = prompt("Enter backup file name", "backup_123456.sql");

if (!fileName) return;

  const res = await fetch("http://localhost:5000/api/backup/restore", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fileName }),
  });

  const data = await res.json();
  alert(data.message);
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
                        <input type="button" class="restore" value="Backup Data" onClick={handleBackup}></input>
                        <input type="button" class="restore" value="Restore Data" onClick={handleRestore}></input>

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
