import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { Trans } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import Head from './Head'
import Sidebar from './Sidebar'
import Title from './title'
import React, { useState, useEffect } from "react";
import './css/Admin.css';
import axios from "axios";

import {  FaSearch  } from "react-icons/fa";





function Homepage() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const [searchCode, setSearchCode] = useState("");
  const [quntity, setQuntity] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [cartitems, setCartitems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showBill, setShowBill] = useState(false);
  const [mobile, setMobile] = useState("");
  const [cash, setCash] = useState(0);

// Balance calculation
const balance = cash - totalAmount;



  const handleCheckboxChange = (index) => {
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter((i) => i !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
  };
    const [search, setSearch] = useState("");
    const [Items, setItems] = useState([]);
          // const mobileInput = document.querySelector("input[name='mobile']");
          // const mobile = parseInt(mobileInput.value, 10);

    useEffect(() => {
      if (search.length > 0) {
        axios
          .get(`http://localhost:5000/api/dashboard/getItem?code=${search}`)
          .then((res) => setItems(res.data))
          .catch((err) => console.error("Search error:", err));
      } else {
        setItems([]); 
      }
    }, [search]);
    

    const handleAddCart = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        setError("");

        if (!setItems) {
          setError("Please select an item first");
          setQuntity("");
          return;
        }


          const quantityInput = document.querySelector("input[name='quantity']");

          const quantity = parseInt(quantityInput.value, 10);
          

          // Assuming you already have the selected item
          const stock = setItems?.quantity || 0;

          if (!quantity || quantity <= 0) {
            setError("Enter a valid quantity");
            return;
          }
           const codes = Items.map(item => item.code);
            // console.log(codes);
       

        try {
          const res = await axios.post("http://localhost:5000/api/dashboard/addToCart", {
            code:codes, 
            quantity: quantity
            
            
          });
          setSuccessMessage(res.data.message || "Added successfully");
          setSearch("");
          fetchcartitems();
          
          quantityInput.value = "";
        } catch (err) {
          console.error(err);
          setError("Failed to add item to cart");
          
        }
      };

          
          

          const fetchcartitems = async () => {
            try {
              const res = await axios.get("http://localhost:5000/api/dashboard/Getcartitem");
              setCartitems(res.data.items);
              setTotalAmount(res.data.totalAmount);
            } catch (err) {
              console.error("Error fetching items:", err);
            }
          };

          useEffect(() => {
            fetchcartitems();
          }, []);



 
 
        const handleDeleteCart = async (e) => {
          e.preventDefault();
        if (selectedRows.length === 0) {
          setError("Please select at least one item to delete");
          
          return;
        }

        try {
         
          const selectedIds = selectedRows.map((rowIndex) => cartitems[rowIndex].id);

          
          for (const id of selectedIds) {
            await axios.delete(`http://localhost:5000/api/dashboard/deleteCartItem/${id}`);
          }

          
          setCartitems((prev) =>
            prev.filter((item, index) => !selectedRows.includes(index))
          );
          setSelectedRows([]); // clear selection
          setSuccessMessage( "Selected items deleted successfully");
          setSearch("");
          fetchcartitems();
          
        } catch (err) {
          console.error("Delete failed:", err);
          setError("Failed to delete items");
          
        }
      };


        const handlebillprint = async (e) => {
          e.preventDefault();
          const mobileInput = document.querySelector("input[name='mobile']");
          const mobile = mobileInput?.value.trim();

          if (!mobile) {
            setError("Please enter customer mobile number before confirming the bill!");
            return;
          }
          setShowBill(true);
          try {
            const res = await axios.post("http://localhost:5000/api/dashboard/updateBillMobile", {
              mobile
            });

            setError("");
            
            alert(res.data.message); 
          } catch (err) {
            console.error("Error updating mobile:", err.response?.data || err.message);
            setError(err.response?.data?.error || "Failed to confirm bill. Try again.");
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

          <h1>D a s h b o a r d</h1>
          <div class="messageshow">
            {successMessage && <p style={{ color: "green"}}>{successMessage}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
          <div className="page">
            <div className="section left">
              <form class="form-group">
                <div className="form-serach">
                  <label>< FaSearch />Search</label>
                  <input type='text' value={search} name="search" placeholder='Search Item 🔍' onChange={(e) => setSearch(e.target.value)}/>
                </div>
              </form>
           {Items.length > 0 ? (
              Items.map((Item, index) => (
              <div className="details" >
                <div class="form-group">
                  <div className="form">
                    <label className="form-label">Brand Name:</label>
                    <input type='text'  name="brand" value={Item.brand} readOnly/>
                  </div>
                </div>
              

                <div class="form-group">
                  <div className="form">
                    <label className="form-label">Item Name:</label>
                    <input type='text'  name="iname" value={Item.name} readOnly/>
                  </div>
                </div>

                <div class="form-group">
                  <div className="form">
                    <label className="form-label">Item Type:</label>
                    <input type='text'  name="type" value={Item.category_name} readOnly/>
                  </div>
                </div>

                <div class="form-group">
                  <div className="form">
                    <label className="form-label">Item  Size:</label>
                    <input type='text'  name="size"value={Item.packsize} readOnly/>
                  </div>
                </div>

                <div class="form-group">
                  <div className="form">
                    <label className="form-label">Item  Price:</label>
                    <input type='text'  name="price" value={Item.price}  readOnly/>
                  </div>
                </div>

                <div class="form-group">
                  <div className="form-stock">
                    <label className="form-label">Available Items of Stock:</label>
                    <input type='text'  name="stock" value={Item.quantity} readOnly/>
                  </div>
                </div>

                <div className="form-group">
                  <div className="form">
                    <label className="form-label">Quantity:</label>
                    <input
                      type="text"
                      name="quantity"
                      min="0"
                      onInput={(e) => {
                        // Allow only positive numbers, else clear input
                        if (!/^\d*$/.test(e.target.value)) {
                          e.target.value = e.target.value.replace(/\D/g, ""); 
                        }
                      }}
                    />
                  </div>
                </div>


            
              </div>

        ))
            ) : (
              <div className="details" >
                <div class="form-group">
                  <div className="form">
                    <label className="form-label">Brand Name:</label>
                    <input type='text'  name="brand"  readOnly/>
                  </div>
                </div>
              

                <div class="form-group">
                  <div className="form">
                    <label className="form-label">Item Name:</label>
                    <input type='text'  name="iname"  readOnly/>
                  </div>
                </div>

                <div class="form-group">
                  <div className="form">
                    <label className="form-label">Item Type:</label>
                    <input type='text'  name="type"  readOnly/>
                  </div>
                </div>

                <div class="form-group">
                  <div className="form">
                    <label className="form-label">Item  Size:</label>
                    <input type='text'  name="size" readOnly/>
                  </div>
                </div>

                <div class="form-group">
                  <div className="form">
                    <label className="form-label">Item  Price:</label>
                    <input type='text'  name="price"   readOnly/>
                  </div>
                </div>

                <div class="form-group">
                  <div className="form-stock">
                    <label className="form-label">Available Items of Stock:</label>
                    <input type='text'  name="stock" readOnly/>
                  </div>
                </div>

                <div className="form-group">
                  <div className="form">
                    <label className="form-label">Quantity:</label>
                    <input
                      type="text"
                      name="quantity"
                      min="0"
                      onInput={(e) => {
                        // Allow only positive numbers, else clear input
                        if (!/^\d*$/.test(e.target.value)) {
                          e.target.value = e.target.value.replace(/\D/g, ""); 
                        }
                      }} readOnly
                    />
                  </div>
                </div>

              </div>
            )}
            </div>

            <div className="section right">
              <div class="card-block">
                <div class="rows">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>✅ </th>
                        <th>Name</th>
                        <th>Size</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      
                      {cartitems.map((cart, index) => (
                        <tr
                          key={cart.id || index}  
                          className={selectedRows.includes(index) ? "table-primary" : ""}
                        >
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(index)}
                              onChange={() => handleCheckboxChange(index)}
                            />
                          </td>

                          
                          <td>{cart.name}</td>
                          <td>{cart.size}</td>
                          <td>{cart.quantity}</td>
                          <td>{cart.price.toFixed(2)}</td>
                          <td>{cart.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div class="form-group">
                <div className="form amounts">
                  <label className="form-label ">Total Amount:</label>
                  <input type='text' class="amount"  name="totamount" value={totalAmount.toFixed(2)} readOnly/>
                </div>
              </div>
              <div className="form-group">
                  <div className="form amounts">
                    <label className="form-label">Mobile :</label>
                    <input type="text" class="amount" name="mobile" min="0" maxLength="10"
                      onInput={(e) => {
                        // Allow only positive numbers, else clear input
                        if (!/^\d*$/.test(e.target.value)) {
                          e.target.value = e.target.value.replace(/\D/g, ""); 
                        }
                      }}
                    />
                </div>
              </div>

            </div>
            

          </div>
            <form class="button-group">
              <input type="button" name="submitbtn" value="Add Cart" onClick={handleAddCart} />
              <input type="button" name="submitbtn" value="Delete Item" onClick={handleDeleteCart}  />
              <input type="button" name="submitbtn" value="Confirm" onClick={handlebillprint} />
            </form>
          {showBill && (
      <div className="modal printbill">
        <div className="modal-content">
          <h3>Ayu Pharmacy </h3>
          <p>Colombo Road,Pothuhera</p>
          <p>037-3456789/0774567890</p>
          <p>Date: {new Date().toLocaleDateString()}</p>
          <p>Bill No: {cartitems.at(-1)?.Billnum}</p>

          
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Size</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {cartitems.map((item, i) => (
                <tr key={i}>
                  <td>{item.name}</td>
                  <td>{item.size}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price.toFixed(2)}</td>
                  <td>{item.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="lastbill">
            <p>Total: <span>{totalAmount.toFixed(2)}</span></p>
            <p>Cash: <span>{cash > 0 ? cash.toFixed(2) : ""}</span></p>
            <p>Balance: <span>{cash > 0 ? balance.toFixed(2) : ""}</span></p>
          </div>
          <p>Thank you ..Come Again...</p>
        </div>
          <div className="printform">
            <input 
              type="text" 
              name="cash" 
              min="0" 
              maxLength="10"
              onInput={(e) => {
                if (!/^\d*$/.test(e.target.value)) {
                  e.target.value = e.target.value.replace(/\D/g, ""); 
                }
                setCash(Number(e.target.value || 0)); // cash update wenawa
              }}
              placeholder="Cash value"
            />
            <div className="btnprint">
              <button
                onClick={async () => {
                  try {
                    // API call → update bill action
                    await axios.post("http://localhost:5000/api/dashboard/updateBillAction", {
                      action: "successfull"
                     
                    });

                    // Print after update
                    window.print();
                  } catch (err) {
                    console.error("Failed to update bill:", err);
                    alert("Bill update failed!");
                  }
                }}
              >
                Print
              </button>

              <button onClick={() => setShowBill(false)}>Close</button>
            </div>

          </div>
       
      </div>
    )}
            <Title/>
        </div>
      </div>
    </div>
  );
}

export default Homepage
