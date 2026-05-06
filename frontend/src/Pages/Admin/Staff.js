import Head from './Head';
import Sidebar from './Sidebar';
import Title from './title';
import React, { useState, useEffect } from "react";
import axios from "axios";
import './css/all.css';
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,BarChart, Bar, XAxis, YAxis
} from "recharts";


function Staff() {
  const [isOpen, setIsOpen] = useState(false);
  const [staff, setStaff] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [editingStaff, setEditingStaff] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [DeleteId ,setDeleteId] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [dailySale , setDailySale] = useState(false);
  const [monthlySale , setMonthlySale] = useState(false);
  const [yearlySale , setYearlySale] = useState(false);

  const COLORS = ["#0088FE", "#037741", "#FFBB28", "#FF8042", "#AF19FF"];
  const total = chartData.reduce((sum, item) => sum + item.sales, 0);




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
    setError(""); 
    setSuccessMessage("");
  } catch (err) {
    setError("Failed to add staff. Try again.");
    console.error("Error adding staff:", err);
  }
};

const handleDelete = (id) => {
  setDeleteId(id);       
  setShowDeletePopup(true);
};

  // Delete staff
  const DeleteConfirm = async () => {
    setEditLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/staff/deletestaff${DeleteId}`);
      fetchStaff();
      setShowDeletePopup(false);
    } catch (err) {
      console.error("Error deleting staff:", err);
    }
    setEditLoading(false);
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


const handleSales = (type) => {
  setLoading(true);
  axios
    .get(`http://localhost:5000/api/staff/staffsales/${type}`)
    .then((res) => {
      setChartData(res.data);
    })
    .catch((err) => console.error(err));
    setLoading(false);
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



          
        <div className="chartShow"> 
            <span className="headname"> Staff Sales Analyzes </span>
          <img className="background-pic" src="/images/staff.png" alt="staff" />
          <div className="staff-box">
            <div className="staff-sale" onClick={() => {setDailySale(true);handleSales("daily");}}>
                <img className="logo" src="/images/8566439.png" alt="staff" />
                <span>Daily</span>

            </div>
          
           <div className="staff-sale"  onClick={() => {setMonthlySale(true);handleSales("monthly");}}>
             <img className="logo" src="/images/10344199.png" alt="staff"/>
             <span>Monthly</span>
            </div>

           <div className="staff-sale" onClick={() => {setYearlySale(true);handleSales("yearly");}}>
            <img className="logo" src="/images/8420360.png" alt="staff"/>
             <span>Yearly</span>
            </div>
          </div>
          
          {dailySale && chartData && (

              <div className="popup-overlay">
                <div className="popup-box">
                  
                  <FaTimes
                    className="clos-btn"
                    onClick={() => setDailySale(false)}
                  />

                  <h2>Staff Sales Achievement(Daily)</h2>

                {loading ? (
                  "Loading chart..."
                ) : chartData.length > 0 ? (
                  <div className="viewchart" style={{ width: "100%", height: 300 }}>
                    <ResponsiveContainer>
                      <PieChart>

                        <text
                          x="50%"
                          y="50%"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          style={{ fontSize: "16px", fontWeight: "bold" }}
                        >
                          Rs: {total}
                        </text>

                        <Pie
                          data={chartData}
                          dataKey="sales"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          innerRadius={50}
                          label={({ name,sales }) =>
                            `${name} ${sales} `
                            
                          }
                        >
                          {chartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />

                          ))}
                        </Pie>
                          
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  ) : (
                    "No Any Chart Data"
                  )}
                          
                </div>
              </div>
          )} 

          {monthlySale && chartData && (

              <div className="popup-overlay">
                <div className="chart-box">
                  
                  <FaTimes className="clos-btn" onClick={() => setMonthlySale(false)} />

                  <h2>Staff Sales Achievement(Monthly)</h2>

                  <div className="viewchart" style={{ width: "100%", height: 500 }}>

                  {loading ? (
                      "Loading chart..."
                    ) : chartData.length > 0 ? (
                      <ResponsiveContainer style={{ width: "100%", height: 500 }}>
                        <BarChart data={chartData}>

                          <XAxis
                            dataKey="name"
                            label={{
                              value: "Staff Member",
                              position: "insideBottom",
                              offset: -5,
                              style: { fontSize: 16, fontWeight: "bold",fill:"black" }
                            }}
                          />

                          <YAxis
                          nameKey="name"
                            label={{
                              value: "Sales",
                              angle: -90,
                              position: "insideLeft",
                              style: { fontSize: 16, fontWeight: "bold" ,fill:"black"}
                            }}
                          />

                          <Tooltip
                            contentStyle={{ fontSize: "14px", fontWeight: "bold",fill:"black" }}
                          />

                          <Bar dataKey="totQuantity"  fill="#03412cc4" label={{angle: -90,style: { fill:"black",fontSize: 18, fontWeight: "bold" } }} />
                          <Bar dataKey="sales" fill="#6e6e70c4"  label={{angle: -90,style: { fill:"black",fontSize: 18, fontWeight: "bold" } }} />

                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      "No Any Chart Data"
                    )} 
                  </div>                         
                </div>
              </div>
          )} 

            {yearlySale && chartData && (

              <div className="popup-overlay">
                <div className="chart-box">
                  
                  <FaTimes className="clos-btn" onClick={() => setYearlySale(false)} />

                  <h2>Staff Sales Achievement(yearly)</h2>

                  <div className="viewchart" style={{ width: "100%", height: 500 }}>

                  {loading ? (
                      "Loading chart..."
                    ) : chartData.length > 0 ? (
                      <ResponsiveContainer style={{ width: "100%", height: 500 }}>
                        <BarChart data={chartData}>

                          <XAxis
                            dataKey="name"
                            label={{
                              value: "Staff Member",
                              position: "insideBottom",
                              offset: -5,
                              style: { fontSize: 16, fontWeight: "bold",fill:"black" }
                            }}
                          />

                          <YAxis
                          nameKey="name"
                            label={{
                              value: "Sales",
                              angle: -90,
                              position: "insideLeft",
                              style: { fontSize: 16, fontWeight: "bold" ,fill:"black"}
                            }}
                          />

                          <Tooltip
                            contentStyle={{ fontSize: "14px", fontWeight: "bold",fill:"black" }}
                          />

                          <Bar dataKey="totQuantity"  fill="#070341c4" label={{angle: -90,style: { fill:"black",fontSize: 18, fontWeight: "bold" } }} />
                          <Bar dataKey="sales" fill="#f0cd07"  label={{angle: -90,style: { fill:"black",fontSize: 18, fontWeight: "bold" } }} />

                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      "No Any Chart Data"
                    )} 
                  </div>                         
                </div>
              </div>
          )} 


          </div>


          {/* Staff Table */}
          <div className="card-block">
            <div className="rows">
              <h2> Staff Details</h2>
              <table className="table">
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

                  {editingStaff && (
                      <div className="popup-overlay">
                          <div className="update-box"> 
                            <FaTimes className="clos-btn"  onClick={() => setEditingStaff(null)} />
                            <h2> Update Staff Details</h2>
                              <img src="/images/customer.webp" style={{width:"10rem", height:"10rem"}}  alt="Userimage" className="img-circle"/>
                              <div className="form-row">
                                <div className="form-groups">
                                  <label className="customer-label">Name:</label>
                                  <input
                                    type="text"
                                    value={editingStaff.name}
                                    onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                                  />
                                </div>

                                <div className="form-groups">
                                  <label className="customer-label">Mobile:</label>
                                  <input
                                    type="text"
                                    value={editingStaff.mobile || ""}
                                    onChange={(e) => {
                                      const value = e.target.value.replace(/[^0-9]/g, ""); 

                                      setEditingStaff((prev) => ({
                                        ...prev,
                                        mobile: value,
                                      }));
                                    }}
                                  />
                                </div>  
                              </div>

                              <div className="form-row-staff">
                                <div className="form-group">
                                  <label>Email:</label>
                                  <input
                                    type="email"
                                    value={editingStaff.email}
                                    onChange={(e) => setEditingStaff({ ...editingStaff, email: e.target.value })}
                                  />
                                </div> 
                              </div>

                                <button type="submit" className="downbtn" onClick={handleUpdateStaff}  disabled={editLoading}>
                                  {editLoading ? "Updating..." : "Update"}
                                </button>

                          </div>
                      </div>
                  )}

                  {showDeletePopup && (
                    <div className="popup-overlay">
                      <div className="popup-box">   
                        <FaTimes className="clos-btn"  onClick={() => setShowDeletePopup(null)} />
                        <h2>Delete Alert</h2>
                        <img src="/images/Delete.png" style={{width:"10rem", height:"10rem"}}  alt="adeleteimage" className="img-circle"/>
                        <h4>
                          Are you sure you want to Delete this Staff Member?
                        </h4>
                        <button className="downbtn" onClick={DeleteConfirm} disabled={editLoading}> 
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

export default Staff;
