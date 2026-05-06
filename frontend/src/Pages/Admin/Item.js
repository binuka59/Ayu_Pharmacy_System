import Head from './Head'
import Sidebar from './Sidebar'
import React, { useState, useEffect } from "react";
import './css/all.css';
import {  FaEdit, FaTrash , FaTimes } from "react-icons/fa";
import axios from 'axios';
import Title from './title'

function Item() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };


  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [Icode, setCode] = useState("");
  const [Iname, setName] = useState("");
  const [Ibrand, setBrand] = useState("");
  const [Iquntity, setQuntity] = useState("");
  const [Iprice, setPrice] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); 
  const [packsize, setPacksize] = useState("");
  const [discount, setDiscount] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const [insertDate, setInsertDate] = useState(today);
  const [expiredDate, setExpiredDate] = useState("");

  const [editingItem, setEditingItem] = useState(null); 
  const [editLoading, setEditLoading] = useState(false);
  const [showDeletePopup , setShowDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [packUnit, setPackUnit] = useState("mg");

    const handleChange = (e) => {
    // Only allow numbers
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setPacksize(value);
    }
  };




  useEffect(() => {
  axios.get("http://localhost:5000/api/category/categories")
    .then((res) => {
      console.log("Categories response:", res.data);
      setCategories(res.data);
    })
    .catch((err) => {
      console.error("Error fetching categories:", err);
    });
}, []);


    useEffect(() => {
      fetchItems();
    }, []);

  const HandleItems = async (e) => 
  {
    e.preventDefault();
     const combinedPacksize = packsize ? `${packsize} ${packUnit}` : "";
    try {
      const response = await axios.post("http://localhost:5000/api/category/AddItems", {
        Icode,Iname,Ibrand,Iquntity,Iprice,categories: selectedCategory,packsize:combinedPacksize,discount,insertDate,expiredDate
      });

      console.log(response.data);
      setCode('');
      setName('');
      setBrand('');
      setQuntity('');
      setPrice('');
      setCategories('');
      setPacksize('');
      setPackUnit("mg");
      setDiscount('');
      setInsertDate('');
      setExpiredDate('');
      setSuccessMessage(response.data.message);
        window.location.reload(); 
      fetchItems()

    

    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
    } else {
        setError('Something went wrong. Please try again.');
    }
  }
};



  const [stock, setStock] = useState([]);

    const fetchItems = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/category/stock");
        setStock(res.data);
      } catch (err) {
        console.error("Error fetching stock data:", err);
      }
    };

      const openEditModal = (item) => {

        const selectedCategory = categories.find(
          (cat) => cat.name === item.caname
        );

        setEditingItem({
          ...item,
          category: selectedCategory?.id || ""
        });

      };


      const closeEditModal = () => {
        setEditingItem(null);
      };

const handleUpdate = async (e) => {
  e.preventDefault();
  setEditLoading(true);
;  if (!editingItem || !editingItem.id) return;

  try {

    const payload = {
      code: editingItem.code,
      name: editingItem.name,
      brand: editingItem.brand,
      quantity: editingItem.quantity,
      price: editingItem.price,
      category: editingItem.category,
      packsize: editingItem.packsize,
      discount: editingItem.discount,
      insertdate: editingItem.insertdate,
      expiredate: editingItem.expiredate,
    };

    await axios.put(
      `http://localhost:5000/api/category/updateItem/${editingItem.id}/${editingItem.batch}`,
      payload
    );

    await fetchItems(); 
    closeEditModal();

     window.location.reload();

  } catch (err) {
    console.error(err);
    alert("Update failed");
  }
  setEditLoading(false);
};

const handleDelete = (id) => {
  setDeleteId(id);       
  setShowDeletePopup(true);
};


const confirmDelete = async () => {
  setEditLoading(true);
  try {
    const res = await axios.delete(`http://localhost:5000/api/category/deleteItem/${deleteId}`);

    setStock((prev) => prev.filter((it) => it.id !== deleteId));

    setSuccessMessage(res.data?.message || "Item deleted successfully");
  } catch (err) {
    console.error("Delete error:", err);
    setError(err?.response?.data?.error || "Failed to delete item.");
  } 
   setShowDeletePopup(false);
   setEditLoading(false);
   fetchItems();
};





useEffect(() => {
  let timer;

  if (successMessage) {
    timer = setTimeout(() => {
      setSuccessMessage("");     
    }, 3000);
  }

  if (error) {
    timer = setTimeout(() => {
      setError("");
    }, 3000);
  }

  return () => clearTimeout(timer); 
}, [successMessage, error]);


  return (
    <div>
      <Head />

      <div className={`main-content ${isOpen ? "shifted" : ""}`}>
            <div className={`background ${isOpen ? "active" : ""}`}>
                <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
                <h1>A d d _ I t e m s </h1>
                <div class="messageshow">
                  {successMessage && <p style={{ color: "green"}}>{successMessage}</p>}
                  {error && <p style={{ color: "red" }}>{error}</p>}
                </div>
                <form className="form-customer" onSubmit={HandleItems}>
                  <div className="row">
                    <div className="col-md-4 ">
                      <label className="customer-label">Item code:</label>
                      <input type="text" className="form-control customer-input" value={Icode} placeholder="Enter Code" onChange={(e) => setCode(e.target.value)} required/>
                    </div>

                    <div className="col-md-4  ">
                      <label className="customer-label">Name:</label>
                      <input type="text" className="form-control customer-input" value={Iname} placeholder="Enter Name" onChange={(e) => setName(e.target.value)} required/>
                    </div>

                    <div className="col-md-4 ">
                      <label className="customer-label">Brand:</label>
                      <input type="text" className="form-control customer-input" value={Ibrand} placeholder="Enter Brand" onChange={(e) => setBrand(e.target.value)} required/>
                    </div>

                    <div className="col-md-4">
                      <label className="customer-label">Quntity:</label>
                      <input
                        type="text"
                        className="form-control customer-input"
                        placeholder="Enter  Quntity count"
                        min="0"
                        maxLength="10"
                        value={Iquntity}
                        onInput={(e) => {
                          if (!/^\d*$/.test(e.target.value)) {
                            e.target.value = e.target.value.replace(/\D/g, "");
                          }
                        }}
                        onChange={(e) => setQuntity(e.target.value)} required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="customer-label">Price:</label>
                      <input
                        type="text"
                        className="form-control customer-input"
                        placeholder="Enter one item Price"
                        maxLength="10"
                        value={Iprice}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(/[^0-9.]/g, "");
                          if ((e.target.value.match(/\./g) || []).length > 1) {
                            e.target.value = e.target.value.substring(0, e.target.value.length - 1);
                          }
                        }}
                        onChange={(e) => setPrice(e.target.value)} required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="customer-label">Category:</label>
                      <select
                        className="form-control customer-input"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        <option value="">Select the category</option>
                        {Array.isArray(categories) && categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>


                    <div className="col-md-3">
                          <label className="customer-label">Package Size:</label>
                          <div className="d-flex">
                            <input
                              type="text"
                              className="form-control customer-input-package"
                              value={packsize}
                              placeholder="Enter Size"
                              onChange={handleChange}
                              required
                              
                            />
                            <select
                              className="form-control customer-input1"
                              value={packUnit}
                              onChange={(e) => setPackUnit(e.target.value)} 
                            >
                              <option value="mg">mg</option>
                              <option value="g">g</option>
                              <option value="ml">ml</option>
                              <option value="l">l</option>
                            </select>
                          </div>
                          
                        </div>

                    <div className="col-md-3 ">
                      <label className="customer-label">Discount:</label>
                      <input type="text" className="form-control customer-input" value={discount} placeholder="Enter discount" onChange={(e) => setDiscount(e.target.value)}  required/>
                    </div>

                    <div className="col-md-3  ">
                      <label className="customer-label">Insert Date:</label>
                      <input type="date" className="form-control customer-input" value={insertDate} onChange={(e) => setInsertDate(e.target.value)}/>
                    </div>

                    <div className="col-md-3 ">
                      <label className="customer-label">Expired Date:</label>
                      <input
                        type="date"
                        className="form-control customer-input"
                        value={expiredDate} 
                        min={new Date(Date.now() + 86400000).toISOString().split("T")[0]} 
                        onChange={(e) => setExpiredDate(e.target.value)}
                      />
                    </div>


                    <div className="cuform-btn">
                     <input type="submit" className="customerbtn" name="cusbtn" value="Add Item" />

                    </div>

                  </div>
                </form>

               <div className="card-block">
                <div className="rows">
                  <table className="table">
                    <caption style={{ captionSide: "top", fontWeight: "bold", fontSize: "1.5rem", textAlign: "center" }}>
                      Items Details
                    </caption>
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Brand</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Discount</th>
                        <th>Insert Date</th>
                        <th>Expired Date</th>
                        <th>Days</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stock.map((item, index) => (
                        <tr key={item.id}>
                          <td>{item.code}</td>
                          <td>{item.brand}</td>
                          <td>{item.itemName} {item.packsize}</td> 
                          <td> {item.quantity} {item.caname}</td>
                          <td>RS:{item.price.toFixed(2)}</td>
                          <td>{item.discount}%</td>
                          <td>{item.insertdate}</td>
                          <td>{item.expiredate}</td>
                          <td style={{color:"red"}}>{item.days}</td>
                          <td>
                          <FaEdit onClick={() => openEditModal(item)} className="editbtn" />
                          <FaTrash onClick={() => handleDelete(item.id)} className="deletebtn" />
                        </td>

                        </tr>
                      ))}

                      {editingItem && (
                        <div className="popup-overlay">
                          <div className="update-box"> 
                            <FaTimes className="clos-btn"  onClick={closeEditModal} />
                            <h2> {editingItem.itemName} {editingItem.packsize} Update</h2>
                               <img src="/images/tablet.png" style={{width:"10rem", height:"10rem"}}  alt="Userimage" className="img-circle"/>
                              <div className="form-row">
                                <div className="form-groups">
                                  <label className="customer-label">Code:</label>
                                  <input
                                    type="text"
                                    value={editingItem.code || ""}
                                    onChange={(e) =>
                                      setEditingItem((prev) => ({ ...prev, code: e.target.value }))
                                    }
                                    placeholder="Code"
                                    required
                                  />
                                </div>

                                <div className="form-groups">
                                  <label className="customer-label">Name:</label>
                                  <input
                                    type="text"
                                    value={editingItem.itemName || ""}
                                    onChange={(e) =>
                                      setEditingItem((prev) => ({ ...prev, name: e.target.value }))
                                    }
                                    placeholder="Name"
                                    required
                                  />
                                </div>
                              </div>

                              <div className="form-row">
                                <div className="form-groups">
                                  <label className="customer-label">Brand:</label>
                                  <input
                                    type="text"
                                    value={editingItem.brand || ""}
                                    onChange={(e) =>
                                      setEditingItem((prev) => ({ ...prev, brand: e.target.value }))
                                    }
                                    placeholder="Brand"
                                  />
                                </div>

                                <div className="form-groups">
                                  <label className="customer-label">Quantity:</label>
                                  <input
                                    type="text"
                                    value={editingItem.quantity ?? ""}
                                    onChange={(e) =>
                                      setEditingItem((prev) => ({ ...prev, quantity: e.target.value }))
                                    }
                                    onInput={(e) => {
                                      if (!/^\d*$/.test(e.target.value)) {
                                        e.target.value = e.target.value.replace(/\D/g, "");
                                      }
                                    }}
                                    placeholder="Quantity"
                                  />
                                </div>
                              </div>

                              <div className="form-row">
                                <div className="form-groups">
                                  <label className="customer-label">Price:</label>
                                  <input
                                    type="text"
                                    value={editingItem.price ?? "00"}
                                    onChange={(e) =>
                                      setEditingItem((prev) => ({ ...prev, price: e.target.value }))
                                    }
                                    placeholder="Price"
                                  />
                                </div>



                                <div className="form-groups">
                                  <label className="customer-label">Category:</label>

                                  <select
                                    value={editingItem.category || ""}
                                    onChange={(e) =>
                                      setEditingItem({
                                        ...editingItem,
                                        category: e.target.value
                                      })
                                    }
                                  >

                                    <option value="">Select Category</option>

                                    {categories.map((cat) => (
                                      <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                      </option>
                                    ))}

                                  </select>

                                </div>

   
                              </div>

                              <div className="form-row">
                                <div className="form-groups">
                                  <label className="customer-label">Pack Size:</label>
                                  <input
                                    type="text"
                                    value={editingItem.packsize ?? ""}
                                    onChange={(e) =>
                                      setEditingItem((prev) => ({ ...prev, packsize: e.target.value }))
                                    }
                                    placeholder="Package Size"
                                  />
                                </div>

                                <div className="form-groups">
                                  <label className="customer-label">Discount:</label>
                                  <input
                                    type="text"
                                    value={editingItem.discount ?? ""}
                                    onChange={(e) =>
                                      setEditingItem((prev) => ({ ...prev, discount: e.target.value }))
                                    }
                                    placeholder="Discount"
                                  />
                                </div>
                              </div>

                              <div className="form-row">
                                <div className="form-groups">
                                  <label className="customer-label">Insert Date:</label>
                                  <input
                                    type="date"
                                    value={editingItem.insertdate ?? ""}
                                    onChange={(e) =>
                                      setEditingItem((prev) => ({ ...prev, insertdate: e.target.value }))
                                    }
                                  />
                                </div>

                                <div className="form-groups">
                                  <label className="customer-label">Expire Date:</label>
                                  <input
                                    type="date"
                                    value={editingItem.expiredate ?? ""}
                                    onChange={(e) =>
                                      setEditingItem((prev) => ({ ...prev, expiredate: e.target.value }))
                                    }
                                  min={new Date(Date.now() + 86400000).toISOString().split("T")[0]} 
                                  />
                                </div>
                              </div>


                                <button type="submit" className="downbtn" onClick={handleUpdate}  disabled={editLoading}>
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
                                  Are you sure you want to Delete this Item?
                                </h4>
                              <button className="downbtn" onClick={confirmDelete} disabled={editLoading}> 
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
            </div>
            <Title/>
        </div>
    </div>
  )}

export default Item
