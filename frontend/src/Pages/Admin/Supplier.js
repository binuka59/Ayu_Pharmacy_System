import Head from './Head';
import Sidebar from './Sidebar';
import Title from './title';
import React, { useState, useEffect } from "react";
import axios from "axios";
import './css/all.css';
import { FaEdit, FaTrash } from "react-icons/fa";

function Supplier() {
  const [isOpen, setIsOpen] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    brand:"",
    mobile: "",
    password: "",
    confirmPassword: ""
  });

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Fetch suppliers
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/supplier/getsuppliers");
      setSuppliers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle form change
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Add supplier
  const handleAddSupplier = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/supplier/addsupplier", formData);
      setFormData({ name: "", email: "", brand:"", mobile: "", password: "", confirmPassword: "" });
      fetchSuppliers();
      setError("");
      setSuccessMessage("Supplier added successfully");
    } catch (err) {
      console.error(err);
      setError("Failed to add supplier");
    }
  };

  // Delete supplier
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/supplier/deletesupplier/${id}`);
      fetchSuppliers();
      setSuccessMessage("Supplier deleted successfully");
    } catch (err) {
      console.error(err);
      setError("Delete failed");
    }
  };

  // Update supplier
  const handleUpdateSupplier = async (e) => {
    e.preventDefault();
    if (!editingSupplier?.id) return setError("No supplier selected");

    setEditLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const payload = {
        name: editingSupplier.name,
        email: editingSupplier.email,
        mobile: editingSupplier.mobile,
        brand: editingSupplier.brand
      };
      await axios.put(`http://localhost:5000/api/supplier/updatesupplier/${editingSupplier.id}`, payload);
      fetchSuppliers();
      setEditingSupplier(null);
      setSuccessMessage("Supplier updated successfully");
    } catch (err) {
      console.error(err);
      setError("Update failed");
    } finally {
      setEditLoading(false);
    }
  };

  // Clear messages
  useEffect(() => {
    const timer = setTimeout(() => {
      setError("");
      setSuccessMessage("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [error, successMessage]);

  return (
    <div>
      <Head />
      <div className={`main-content ${isOpen ? "shifted" : ""}`}>
        <div className={`background ${isOpen ? "active" : ""}`}>
          <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
          <h1>Supplier</h1>

          <div className="messageshow">
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>

          {/* Supplier Form */}
          <form className="form-customer" onSubmit={(e) => e.preventDefault()}>
            <div className="row">
              
              <div className="col-md-3">
                <label className="customer-label">Name:</label>
                <input type="text" name="name" className="form-control customer-input" placeholder="Enter Name" value={formData.name} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="customer-label">Email:</label>
                <input type="email" name="email" className="form-control customer-input" placeholder="Enter Email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="col-md-3">
                <label className="customer-label">Selling brand:</label>
                <input type="text" name="brand" className="form-control customer-input" placeholder="Enter Brand Name" value={formData.brand} onChange={handleChange} />
              </div>
              
              <div className="col-md-4">
                <label className="customer-label">Mobile:</label>
                <input type="text" name="mobile" className="form-control customer-input" placeholder="Enter Mobile" value={formData.mobile} maxLength="10" onChange={(e) => {
                  if (/^\d*$/.test(e.target.value)) handleChange(e);
                }} />
              </div>
              <div className="col-md-4">
                <label className="customer-label">Password:</label>
                <input type="password" name="password" className="form-control customer-input" placeholder="Enter Password" value={formData.password} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <label className="customer-label">Confirm Password:</label>
                <input type="password" name="confirmPassword" className="form-control customer-input" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
              </div>
              <div className="cuform-btn">
                <input type="button" className="customerbtn" value="Submit" onClick={handleAddSupplier} />
              </div>
            </div>
          </form>

          {/* Supplier Table */}
          <div className="card-block">
            <div className="rows">
            <table className="table">
              <caption style={{ captionSide: "top", fontWeight: "bold", fontSize: "1.5rem", textAlign: "center" }}>Supplier Details</caption>
              <thead>
                <tr>
                  <th>Nu</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Brand</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.length > 0 ? suppliers.map((sup) => (
                  <tr key={sup.id}>
                    <td>sup{String(sup.id).padStart(4, "0")}</td>
                    <td>{sup.name}</td>
                    <td>{sup.mobile}</td>
                    <td>{sup.email}</td>
                    <td>{sup.brand}</td>
                    <td>
                      <FaEdit onClick={() => setEditingSupplier(sup)} className="editbtn" />
                      <FaTrash onClick={() => handleDelete(sup.id)} className="deletebtn" />
                    </td>
                  </tr>
                )) : <tr><td colSpan="6" style={{ textAlign: "center" }}>No suppliers found</td></tr>}
              </tbody>
            </table>
           </div>
          </div>

          {/* Edit Supplier Modal */}
          {editingSupplier && (
            <div className="modal" onClick={() => setEditingSupplier(null)}>
              <div className="modal-content updatebox" onClick={(e) => e.stopPropagation()}>
                <h3>Edit Supplier</h3>
                <form onSubmit={handleUpdateSupplier} className="editbox">
                  <div className="form-row">
                  <label>Name:</label>
                  <input type="text" value={editingSupplier.name} onChange={(e) => setEditingSupplier({ ...editingSupplier, name: e.target.value })} />
                  <label>Email:</label>
                  <input type="email" value={editingSupplier.email} onChange={(e) => setEditingSupplier({ ...editingSupplier, email: e.target.value })} />
                  </div>
                  <div className="form-row">
                  <label>Mobile:</label> 
                  <input type="text" maxLength="10" value={editingSupplier.mobile} onChange={(e) => setEditingSupplier({ ...editingSupplier, mobile: e.target.value.replace(/\D/g, "") })} />
                  <label>Brand :</label>
                  <input type="text" value={editingSupplier.brand} onChange={(e) => setEditingSupplier({ ...editingSupplier, brand: e.target.value })} />
                 
                  </div>

                  <div className="edit-buttons">
                    <button type="submit" className="submit" disabled={editLoading}>{editLoading ? "Saving..." : "Update"}</button>
                    <button type="button" className="cancel" onClick={() => setEditingSupplier(null)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
        <Title/>
      </div>
    </div>
  );
}

export default Supplier;
