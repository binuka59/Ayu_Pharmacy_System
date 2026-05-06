import Head from './Head';
import Sidebar from './Sidebar';
import Title from './title'
import './css/all.css';
import './css/category.css';
import { FaEdit, FaTrash ,FaTimes } from "react-icons/fa";
import axios from 'axios';
import React, { useState, useEffect} from "react";


function Category() {
  const [category, setCategory] = useState("");
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [categories, setCategories] = useState([]); 

  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);
  const [showDeletePopup , setShowDeletePopup] = useState(false);
  const [editLoading , setEditLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

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
  setEditLoading(true);
  try {
    await axios.put(`http://localhost:5000/api/category/updateCategory/${editCategory.id}`, {
      name: editCategory.name
    });

    
    setCategories(categories.map(cat => 
      cat.id === editCategory.id ? { ...cat, name: editCategory.name } : cat
    ));
    setEditLoading(false);
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
const handleDelete = (id) => {
  setDeleteId(id);       
  setShowDeletePopup(true);
};

const confirmDelete = async () => {
  setEditLoading(true);

  try {
    await axios.delete(`http://localhost:5000/api/category/deleteCategory/${deleteId}`);
    
    setCategories(categories.filter((cat) => cat.id !== deleteId));
    setShowDeletePopup(false);
    setDeleteId(null);

  } catch (err) {
    console.error("Delete error:", err);
  }

  setEditLoading(false);
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

  return (
    <div>
      <Head />

      <div className={`main-content ${isOpen ? "shifted" : ""}`}>
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
                    <th>Category Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat, index) => (
                    <tr key={cat.id}> 
                      
                      <td>{cat.name}</td>
                      <td>
                        <FaEdit onClick={() => openEditModal(cat)} className="editbtn" />
                        <FaTrash onClick={() => handleDelete(cat.id)}  className="deletebtn"  />
                      </td>
                      
                        </tr>
                      ))}
                       {showDeletePopup && (
                          <div className="popup-overlay">
                            <div className="popup-box">   
                              <FaTimes className="clos-btn"  onClick={() => setShowDeletePopup(false)} />
                                <h2>Delete Alert</h2>
                                <img src="/images/Delete.png" style={{width:"10rem", height:"10rem"}}  alt="adeleteimage" className="img-circle"/>
                                <h4>
                                  Are you sure you want to Delete this category?
                                </h4>
                              <button className="downbtn" onClick={confirmDelete} disabled={editLoading}> 
                                {editLoading ? "Deleting..." : "yes"}
                              </button>
                              <button className="proclose" onClick={() => setShowDeletePopup(false)} >No</button>
                            </div>
                          </div>
                        )} 

                    {isEditOpen && (
                      <div className="popup-overlay">
                        <div className="profile-up">   
                          <FaTimes className="clos-btn"  onClick={closeEditModal} />
                            <h2>Update Category</h2>
                            {error && <p style={{ color: "red" }}>{error}</p>}
                            <img src="/images/yy.png"  alt="Userimage" className="img-circle"/>
                            <form className="form-customer ">
                              <input 
                              type="text" 
                              value={editCategory.name} 
                              className="form-password"
                              onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })} 
                              />
                              </form>
                             <button type="submit" className="prook" onClick = {handleUpdate} disabled={editLoading}> 
                                {editLoading ? "Updating..." : "Update"}
                            </button>


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
