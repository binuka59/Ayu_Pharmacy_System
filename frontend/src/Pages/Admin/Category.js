<<<<<<< HEAD
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
=======
import Head from './Head';
import Sidebar from './Sidebar';
import Title from './title'
import './css/all.css';
import './css/category.css';
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from 'axios';
import React, { useState, useEffect } from "react";

function Category() {
  const [category, setCategory] = useState("");
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [categories, setCategories] = useState([]); 

  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editCategory, setEditCategory] = useState({ id: null, name: "" });

  const openEditModal = (cat) => {
    setEditCategory(cat); // set current category data
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setEditCategory({ id: null, name: "" });
  };

  const handleUpdate = async (e) => {
  e.preventDefault();
  try {
    await axios.put(`http://localhost:5000/api/category/updateCategory/${editCategory.id}`, {
      name: editCategory.name
    });

    
    setCategories(categories.map(cat => 
      cat.id === editCategory.id ? { ...cat, name: editCategory.name } : cat
    ));

    closeEditModal();
  } catch (err) {
    console.error("Update error:", err);
  }
  };


  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/category/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };

  const handleCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/category/Addcategory", {
        category
      });

      console.log(response.data);
      setCategory('');
      setSuccessMessage(response.data.message);

    
      fetchCategories();

    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this category?")) return;

  try {
    await axios.delete(`http://localhost:5000/api/category/deleteCategory/${id}`);
    setCategories(categories.filter((cat) => cat.id !== id)); 
  } catch (err) {
    console.error("Delete error:", err);
  }
};

  
useEffect(() => {
  let timer;

  if (successMessage) {
    timer = setTimeout(() => {
      setSuccessMessage("");     
    }, 2000);
  }

  if (error) {
    timer = setTimeout(() => {
      setError("");
    }, 2000);
  }

  return () => clearTimeout(timer); 
}, [successMessage, error]);

>>>>>>> 792cc480 (second commit)
  return (
    <div>
      <Head />

      <div className={`main-content ${isOpen ? "shifted" : ""}`}>
<<<<<<< HEAD
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
=======
        <div className={`background ${isOpen ? "active" : ""}`}>
          <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
          <h1>C a t e g o r y</h1>
          <div class="messageshow">
            {successMessage && <p style={{ color: "green"}}>{successMessage}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
          <form className="form-group" onSubmit={handleCategory}>
            <div className="form-category">
              <label>Add New Category:</label>
              <input 
                type="text" 
                name="category" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                placeholder="Enter New Category Here" 
              />
            </div>
            <div className="form-btn">
              <button type="submit">Add Category</button>
            </div>
          </form>

          <div className="card-block">
            <div className="rows">
              <table className="table">
                <caption style={{ captionSide: "top", fontWeight: "bold", fontSize: "1.5rem", textAlign: "center" }}>
                Category Details
                </caption>
                <thead>
                  <tr>
                    
                    <th>Category Id</th>
                    <th>Category Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat, index) => (
                    <tr key={cat.id}>
                      
                      <td>{cat.id}</td>
                      <td>{cat.name}</td>
                      <td>
                        <FaEdit onClick={() => openEditModal(cat)} className="editbtn" />
                        <FaTrash onClick={() => handleDelete(cat.id)}  className="deletebtn"  />
                      </td>
                    </tr>
                  ))}

                    {isEditOpen && (
                      <div className="modal">
                        <div className="modal-content">
                          <h3>Edit Category</h3>
                          <form onSubmit={handleUpdate} className="editbox">
                            <input 
                              type="text" 
                              value={editCategory.name} 
                              onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })} 
                            />

                            <div className="edit-buttons">
                              <button type="submit" className="update-btn">Update</button>
                              <button type="button" onClick={closeEditModal} className="cancel-btn">Cancel</button>
                            </div>
                          </form>
                        </div>

                      </div>
                    )}

                </tbody>
              </table>
            </div>
          </div>
        <Title/>
        </div>
      </div>
      
    </div>
  );
}

export default Category;
>>>>>>> 792cc480 (second commit)
