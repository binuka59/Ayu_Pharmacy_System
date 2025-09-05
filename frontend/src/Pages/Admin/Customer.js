import Head from './Head';
import Sidebar from './Sidebar';
import Title from './title';
import React, { useState, useEffect } from "react";
import axios from "axios";
import './css/all.css';
import './css/customer.css';
import { FaEdit, FaTrash } from "react-icons/fa";

function Customer() {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [form, setForm] = useState({
    name: "",
    address: "",
    age: "",
    mobile: "",
    email: "",
    gender: ""
  });
  const [customers, setCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);
const [editLoading, setEditLoading] = useState(false);



  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Fetch customers from backend
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/customer/GetCustomers");
      setCustomers(res.data);
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setSuccessMessage("");
  setError("");

  try {
    const response = await axios.post(
      "http://localhost:5000/api/customer/AddCustomer",
      form
    );


    setSuccessMessage(response.data.message || "Customer added successfully");

    setForm({
      name: "",
      address: "",
      age: "",
      mobile: "",
      email: "",
      gender: ""
    });


    fetchCustomers();
  } catch (err) {
    console.error("Error adding customer:", err);
    setError(
      err.response?.data?.error || "Failed to add customer. Try again "
    );
  }
};

const handleUpdateCustomer = async (e) => {
  e.preventDefault();

  // Make sure we have the DB primary key (Cid)
  if (!editingCustomer?.Cid) {
    setError("No customer selected for update");
    return;
  }

  setEditLoading(true);
  setError("");
  setSuccessMessage("");

  try {
    // Build payload exactly as backend expects
    const payload = {
      name: editingCustomer.name,
      address: editingCustomer.address,
      age: editingCustomer.age,
      mobile: editingCustomer.mobile,
      email: editingCustomer.email,
      gender: editingCustomer.gender,
    };

    const res = await axios.put(
      `http://localhost:5000/api/customer/updateCustomer/${editingCustomer.Cid}`,
      payload
    );

    setSuccessMessage(res.data?.message || "Customer updated successfully");
    await fetchCustomers(); // refresh list from server
    setEditingCustomer(null); // close modal
  } catch (err) {
    console.error("Update error:", err);
    setError(err?.response?.data?.error || "Failed to update customer");
  } finally {
    setEditLoading(false);
  }
};




  const handleDelete = async (id) => {
  if (window.confirm("Are you sure you want to delete this customer?")) {
    try {
      const res = await axios.delete(`http://localhost:5000/api/customer/deleteCustomer/${id}`);
      alert(res.data.message);
      fetchCustomers(); 
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete customer. Try again.");
    }
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
          <h1>C u s t o m e r </h1>
          <div class="messageshow">
            {successMessage && <p style={{ color: "green"}}>{successMessage}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>

          <form className="form-customer" onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-3 form-item">
                <label className="customer-label">Name:</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} className="form-control customer-input" placeholder="Enter Name"/>
              </div>

              <div className="col-md-6">
                <label className="customer-label">Address:</label>
                <input type="text" name="address" value={form.address} onChange={handleChange} className="form-control customer-input" placeholder="Enter Address"/>
              </div>

              <div className="col-md-3">
                <label className="customer-label">Customer Age:</label>
                <input type="number" name="age" value={form.age} onChange={handleChange} className="form-control customer-input" placeholder="Enter Age"/>
              </div>

              <div className="col-md-3">
                <label className="customer-label">Mobile Number:</label>
                <input type="text" name="mobile" value={form.mobile} onChange={handleChange}
                  className="form-control customer-input" placeholder="Enter Mobile Number" maxLength="10"
                />
              </div>

              <div className="col-md-6">
                <label className="customer-label">E-mail Address:</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className="form-control customer-input" placeholder="Enter Email"/>
              </div>

              <div className="col-md-3">
                <label className="customer-label">Gender:</label>
                <select name="gender" value={form.gender} onChange={handleChange} className="form-control customer-input">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="cuform-btn">
                <button type="submit" className="customerbtn">Add Customer</button>
              </div>
            </div>
          </form>

          {/* Display Customers */}
          <div className="card-block">
            <div className="rows">
              <table className="table">
                <caption style={{ captionSide: "top", fontWeight: "bold", fontSize: "1.5rem", textAlign: "center" }}>
                  Customer Details
                </caption>
                <thead>
                  <tr>
                    <th>C_Num</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Mobile</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Gender</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((cus) => (
                    <tr key={cus.Cid}>
                      <td>Cus{cus.Cid}</td>
                      <td>{cus.name}</td>
                      <td>{cus.age}</td>
                      <td>{cus.mobile}</td>
                      <td>{cus.email}</td>
                      <td>{cus.address}</td>
                      <td>{cus.gender}</td>
                      <td>
                        <FaEdit onClick={() => setEditingCustomer(cus)} className="editbtn" />
                        <FaTrash onClick={() => handleDelete(cus.Cid)}  className="deletebtn"  />
                      </td>
                    </tr>
                  ))}
                  {editingCustomer && (
                    <div className="modal" onClick={() => setEditingCustomer(null)}>
                      <div className="modal-content updatebox" onClick={(e) => e.stopPropagation()}>
                        <h3>Edit Customer</h3>
                        <form onSubmit={handleUpdateCustomer} className="editbox">
                          <div className="form-row">
                            <label>Name:</label>
                            <input
                              type="text"
                              value={editingCustomer.name || ""}
                              onChange={(e) =>
                                setEditingCustomer((prev) => ({ ...prev, name: e.target.value }))
                              }
                            />

                            <label>Address:</label>
                            <input
                              type="text"
                              value={editingCustomer.address || ""}
                              onChange={(e) =>
                                setEditingCustomer((prev) => ({ ...prev, address: e.target.value }))
                              }
                            />
                          </div>

                          <div className="form-row">
                            <label>Age:</label>
                            <input
                              type="number"
                              value={editingCustomer.age || ""}
                              onChange={(e) =>
                                setEditingCustomer((prev) => ({ ...prev, age: e.target.value }))
                              }
                            />

                            <label>Mobile:</label>
                            <input
                              type="text"
                              value={editingCustomer.mobile || ""}
                              onChange={(e) =>
                                setEditingCustomer((prev) => ({ ...prev, mobile: e.target.value }))
                              }
                            />
                          </div>

                          <div className="form-row">
                            <label>Email:</label>
                            <input
                              type="email"
                              value={editingCustomer.email || ""}
                              onChange={(e) =>
                                setEditingCustomer((prev) => ({ ...prev, email: e.target.value }))
                              }
                            />

                            <label>Gender:</label>
                            <select
                              value={editingCustomer.gender || ""}
                              onChange={(e) =>
                                setEditingCustomer((prev) => ({ ...prev, gender: e.target.value }))
                              }
                            >
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </select>
                          </div>

                          <div className="edit-buttons">
                            <button type="submit" class="submit" disabled={editLoading}>{editLoading ? "Saving..." : "Update"}
                            </button>
                            <button type="button" class="cancel" onClick={() => setEditingCustomer(null)}>
                              Cancel
                            </button>
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

export default Customer;
