import Head from './Head';
import Sidebar from './Sidebar';
import Title from './title';
import React, { useState, useEffect } from "react";
import axios from "axios";
import './css/all.css';
import { FaEdit, FaTrash } from "react-icons/fa";

function Staff() {
  const [isOpen, setIsOpen] = useState(false);
  const [staff, setStaff] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [editingStaff, setEditingStaff] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: ""
  });

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Fetch staff
  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/staff/getstaff");
      setStaff(res.data);
    } catch (err) {
      console.error("Error fetching staff:", err);
    }
  };

  // Handle form change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form


const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: ""
      }));
      return;
    }

  try {
    await axios.post("http://localhost:5000/api/staff/Addstaff", formData);
    fetchStaff();
    setFormData({ name: "", email: "", mobile: "", password: "", confirmPassword: "" });
    setError(""); // clear error
  } catch (err) {
    setError("Failed to add staff. Try again.");
    console.error("Error adding staff:", err);
  }
};



  // Delete staff
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/staff/deletestaff${id}`);
      fetchStaff();
    } catch (err) {
      console.error("Error deleting staff:", err);
    }
  };




// ====================================================================
const handleUpdateStaff = async (e) => {
  e.preventDefault();

  if (!editingStaff?.id) {
    setError("No staff selected for update");
    return;
  }

  setEditLoading(true);
  setError("");
  setSuccessMessage("");

  try {
    const payload = {
      name: editingStaff.name,
      email: editingStaff.email,
      mobile: editingStaff.mobile,
    };
    

    const res = await axios.put(
      `http://localhost:5000/api/staff/updatestaff/${editingStaff.id}`,
      payload
    );

    setSuccessMessage(res.data?.message || "Staff updated successfully");
    await fetchStaff(); 
    setEditingStaff(null); 
  
  } catch (err) {
    console.error("Update error:", err);
    setError(err?.response?.data?.error || "Failed to update staff");
  } finally {
    setEditLoading(false);
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

  return (
    <div>
      <Head />
      <div className={`main-content ${isOpen ? "shifted" : ""}`}>
        <div className={`background ${isOpen ? "active" : ""}`}>
          <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
          <h1>S t a f f </h1>
          <div class="messageshow">
            {successMessage && <p style={{ color: "green"}}>{successMessage}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
          {/* Staff Form */}
          <form className="form-customer" onSubmit={(e) => e.preventDefault()}>
            <div className="row">
              <div className="col-md-1 form-item"></div>
              <div className="col-md-5">
                <label className="customer-label">Name:</label>
                <input
                  type="text"
                  name="name"
                  className="form-control customer-input"
                  placeholder="Enter Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-5 ">
                <label className="customer-label">E-mail Address:</label>
                <input
                  type="email"
                  name="email"
                  className="form-control customer-input"
                  placeholder="Enter E mail Address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
                <div className="col-md-1 form-item"></div>
              <div className="col-md-4">
                <label className="customer-label">Mobile Number:</label>
                <input
                  type="text"
                  name="mobile"
                  className="form-control customer-input"
                  placeholder="Enter Mobile Number"
                  value={formData.mobile}
                  maxLength="10"
                  onChange={(e) => {
                    if (/^\d*$/.test(e.target.value)) {
                      handleChange(e);
                    }
                  }}
                />
              </div>

              <div className="col-md-4 ">
                <label className="customer-label">Password:</label>
                <input
                  type="password"
                  name="password"
                  className="form-control customer-input"
                  placeholder="Enter New Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4 ">
                <label className="customer-label">Confirm Password:</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control customer-input"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              <div className="cuform-btn">
                <input
                  type="button"
                  className="customerbtn"
                  value="Submit"
                  onClick={handleSubmit}
                />
              </div>
            </div>
          </form>

          {/* Staff Table */}
          <div className="card-block">
            <div className="rows">
              <table className="table">
                <caption style={{ captionSide: "top", fontWeight: "bold", fontSize: "1.5rem", textAlign: "center" }}>
                  Staff Details
                </caption>
                <thead>
                  <tr>
                    <th>Nu</th>
                    <th>Name</th>
                    <th>Mobile number</th>
                    <th>E-mail Address</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.length > 0 ? (
                    staff.map((stf, i) => (
                      <tr key={stf.id}>
                        <td>stf{String(stf.id).padStart(4, "0")}</td>
                        <td>{stf.name}</td>
                        <td>{stf.mobile}</td>
                        <td>{stf.email}</td>
                        <td>
                          <FaEdit onClick={() => setEditingStaff(stf)} className="editbtn" />
                          <FaTrash onClick={() => handleDelete(stf.id)} className="deletebtn"/>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center" }}>No staff found</td>
                    </tr>
                  )}
                </tbody>
                {editingStaff && (
                  <div className="modal" onClick={() => setEditingStaff(null)}>
                    <div className="modal-content updatebox" onClick={(e) => e.stopPropagation()}>
                      <h3>Edit Staff</h3>
                      <form onSubmit={handleUpdateStaff} className="editbox">
                        <div className="form-row">
                        <label>Name:</label>
                        <input
                          type="text"
                          value={editingStaff.name}
                          onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                        />

                        <label>Email:</label>
                        <input
                          type="email"
                          value={editingStaff.email}
                          onChange={(e) => setEditingStaff({ ...editingStaff, email: e.target.value })}
                        />
                      </div>
                      <div className="form-rows">
                        <label>Mobile:</label>
                       </div> 
                       <input
                          type="text"
                          maxLength="10"
                          value={editingStaff.mobile}
                          onChange={(e) => setEditingStaff({ ...editingStaff, mobile: e.target.value.replace(/\D/g, "") })}
                        />

                      
                        <div className="edit-buttons">
                          <button type="submit" class="submit" disabled={editLoading}> {editLoading ? "Saving..." : "Update"}</button>
                          <button type="button"  class="cancel"onClick={() => setEditingStaff(false)}>Cancel</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

              </table>
            </div>
          </div>
          <Title/>
        </div>
      </div>
    </div>
  );
}

export default Staff;
