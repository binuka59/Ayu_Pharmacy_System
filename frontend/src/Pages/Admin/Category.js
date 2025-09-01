import Head from './Head'
import Sidebar from './Sidebar'
import React, { useState} from "react";
import './css/all.css';
import './css/category.css';



function Category() {
    const [isOpen, setIsOpen] = useState(false);
    
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };
      const [selectedRows, setSelectedRows] = useState([]);
    
      const rows = [
        { Category_Id :1,Category_Name:"Tablets"},
        { Category_Id :2,Category_Name:"Oils" },
        
      ];
    
      const handleCheckboxChange = (index) => {
        if (selectedRows.includes(index)) {
          setSelectedRows(selectedRows.filter((i) => i !== index));
        } else {
          setSelectedRows([...selectedRows, index]);
        }
      };
  return (
    <div>
      <Head />

      <div className={`main-content ${isOpen ? "shifted" : ""}`}>
            <div className={`background ${isOpen ? "active" : ""}`}>
                <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
                <h1>C a t e g o r y</h1>
              <form class="form-group">
                <div className="form-category">
                  <label>Add Category:</label>
                  <input type='text' name="category" placeholder='Enter New Category Here'/>
                </div>
              </form>
                <div className="form-btn">
                  <input type='button' name="categorybtn" value="Add Category"/>
                </div>

                <div class="card-block">
                    <div class="rows">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>✅ </th>
                                    <th>Category Id</th>
                                    <th>Category Name</th>

                                </tr>
                            </thead>
                            <tbody>
                            {rows.map((row, index) => (
                                <tr
                                key={row.code}
                                className={selectedRows.includes(index) ? "table-primary" : ""}
                                >
                                <td>
                                    <input
                                    type="checkbox"
                                    checked={selectedRows.includes(index)}
                                    onChange={() => handleCheckboxChange(index)}
                                    />
                                </td>

                                <td>{row.Category_Id}</td>
                                <td>{row.Category_Name}</td>


                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="form-btn">
                  <input type='button' class="removecat" name="removebtn" value="Remove Category"/>
                </div>
                
            </div>
            
        </div>
        
    </div>
  )};

export default Category
