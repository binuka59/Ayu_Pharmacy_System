import Head from './Head';
import Sidebar from './Sidebar';
import Title from './title';
import React, { useState, useEffect  } from "react";
import axios from "axios";
import './css/all.css';
import './css/customer.css';
import { FaEdit, FaTrash , FaTimes } from "react-icons/fa";

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
  const [loading, setLoading] = useState(false);
  const [showDeletePopup , setShowDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [customData , setCustomData] = useState(null);
  const [showSearchPopup , setShowSearchPopup] = useState(false);
  const [search, setSearch] = useState("");


  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Fetch customers from backend
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
      try {
      const res = await axios.get("http://localhost:5000/api/customer/GetCustomers");
      setCustomers(res.data.customers);
      setCustomData(res.data.count);

    } catch (err) {
      console.error("Error fetching customers:", err);
    }
    setLoading(false);
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

const handleDelete = (id) => {
  setDeleteId(id);       
  setShowDeletePopup(true);
};


  const Deletecustomer = async () => {
    setEditLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/customer/deleteCustomer/${deleteId}`);

      fetchCustomers(); 
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete customer. Try again.");
    }
    setEditLoading(false);
    setShowDeletePopup(false);
    fetchCustomers();
 
};

useEffect(() => {
  if (search.length > 0) {
    axios
      .get(`http://localhost:5000/api/customer/searchCustomer?mobile=${search}`)
      .then((res) => setCustomers(res.data))
      .catch((err) => console.error("Search error:", err));
  } else {
    setCustomers([]);
  }
}, [search]);

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
                <input
                  type="text"
                  name="mobile"
                  value={form.mobile}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, ""); 
                    setForm({ ...form, mobile: value });
                  }}
                  className="form-control customer-input"
                  placeholder="Enter Mobile Number"
                  maxLength="10"
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
          <div className="row">
           <div className="chartShow"> 
              <div className="disboxs"> 
                <span1>
                  <img className="img-fluid" src="/images/customer.png" alt="profit"  />
                </span1>
                <h2>Total Customers</h2>
                <h2>
                  {loading ? (
                      "Loading..."
                    ) : customData> 0 ? (
                      ` ${customData}`
                    ) : (
                      "No Data"
                    )}
                  </h2>
              </div> 

              <div className="disboxs" onClick = {() => setShowSearchPopup(true)}> 
                <span1>
                  <img className="img-fluid" src="/images/search.png" alt="profit"  />
                </span1>
                <h2>Search customer</h2>
                <h4>Click Me.</h4>
              </div> 
              
            </div>


            {showSearchPopup && (
              <div className="popup-overlay">
                <div className="chart-box">   
                  <FaTimes className="clos-btn"  onClick={() => setShowSearchPopup(false)} />
                  <h2>Find Customer</h2>
                  <img src="/images/search2.png" style={{width:"10rem", height:"10rem"}}  alt="adeleteimage" className="img-circle"/>
                  <input type="text" className="form-control customer-input"
                    placeholder="Only input Customer mobile number" value={search}
                    maxLength={10}
                    onChange={(e) => {
                     const value = e.target.value;
                     if (/^\d*$/.test(value) && value.length <= 10) {
                       setSearch(value);
                       }
                       }}
                  />

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
                   
                  </tr>
                </thead>
                <tbody>
                  {customers.length > 0 ? (
                    customers.map((cus) => (
                      <tr key={cus.Cid}>
                        <td>Cus{cus.Cid}</td>
                        <td>{cus.name}</td>
                        <td>{cus.age}</td>
                        <td>{cus.mobile}</td>
                        <td>{cus.email}</td>
                        <td>{cus.address}</td>
                        <td>{cus.gender}</td>
                        <td>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" style={{ textAlign: "center" }}>
                        {search ? "No customer found" : "Enter a mobile number to search"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
                  
                </div>
              </div>
            )} 
          </div>


          {/* Display Customers */}
          <div className="card-block">
            <div className="rows">
              <h2> Customer Details </h2>

              <table className="table">
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
                      <div className="popup-overlay">
                          <div className="update-box"> 
                            <FaTimes className="clos-btn"  onClick={() => setEditingCustomer(null)} />
                            <h2> Update Customer Details</h2>
                               <img src="/images/customer.webp" style={{width:"10rem", height:"10rem"}}  alt="Userimage" className="img-circle"/>
                              <div className="form-row">
                                <div className="form-groups">
                                  <label className="customer-label">Name:</label>
                                  <input
                                    type="text"
                                    value={editingCustomer.name || ""}
                                    onChange={(e) =>
                                      setEditingCustomer((prev) => ({ ...prev, name: e.target.value }))
                                    }
                                  />
                                </div>

                                <div className="form-groups">
                                  <label className="customer-label">Address:</label>
                                  <input
                                    type="text"
                                    value={editingCustomer.address || ""}
                                    onChange={(e) =>
                                      setEditingCustomer((prev) => ({ ...prev, address: e.target.value }))
                                    }
                                  />
                                </div>
                              </div>

                              <div className="form-row">
                                <div className="form-groups">
                                  <label className="customer-label">Age:</label>
                                  <input
                                    type="number"
                                    value={editingCustomer.age || ""}
                                    onChange={(e) =>
                                      setEditingCustomer((prev) => ({ ...prev, age: e.target.value }))
                                    }
                                  />
                                </div>

                                <div className="form-groups">
                                  <label className="customer-label">Mobile:</label>
                                  <input
                                    type="text"
                                    value={editingCustomer.mobile || ""}
                                    onChange={(e) => {
                                      const value = e.target.value.replace(/[^0-9]/g, ""); 

                                      setEditingCustomer((prev) => ({
                                        ...prev,
                                        mobile: value,
                                      }));
                                    }}
                                  />
                                </div>
                              </div>

                              <div className="form-row">
                                <div className="form-groups">
                                  <label className="customer-label">E-mail:</label>
                                  <input
                                    type="email"
                                    value={editingCustomer.email || ""}
                                    onChange={(e) =>
                                      setEditingCustomer((prev) => ({ ...prev, email: e.target.value }))
                                    }
                                  />
                                </div>



                                <div className="form-groups">
                                  <label className="customer-label">Gender:</label>

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
                              </div>

                                <button type="submit" className="downbtn" onClick={handleUpdateCustomer}  disabled={editLoading}>
                                  {editLoading ? "Updating..." : "Update"}
                                </button>

                          </div>
                      </div>
                  )}

                  {showDeletePopup && (
                    <div className="popup-overlay">
                      <div className="popup-box">   
                        <FaTimes className="clos-btn"  onClick={() => setShowDeletePopup(false)} />
                        <h2>Delete Alert</h2>
                        <img src="/images/Delete.png" style={{width:"10rem", height:"10rem"}}  alt="adeleteimage" className="img-circle"/>
                        <h4>
                          Are you sure you want to Delete this Customer?
                        </h4>
                        <button className="downbtn" onClick={Deletecustomer} disabled={editLoading}> 
                          {editLoading ? "Deleting..." : "yes"}
                        </button>
                        <button className="proclose" onClick={() => setShowDeletePopup(false)} >No</button>
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
