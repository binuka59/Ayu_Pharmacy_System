import Head from './Head'
import Sidebar from './Sidebar'
import React, { useState, useEffect } from "react";
import './css/all.css';
import './css/category.css';
import { FaSearch } from "react-icons/fa";
import axios from "axios";

const SearchItems = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);

  const toggleSidebar = () => setIsOpen(!isOpen);



useEffect(() => {
  const fetchItems = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/category/search?q=${search}`);
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchItems();
}, [search]); 

  return (
    <div>
      <Head />

      <div className={`main-content ${isOpen ? "shifted" : ""}`}>
        <div className={`background ${isOpen ? "active" : ""}`}>
          <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
          <h1>F i n d _ I t e m s</h1>

          <form className="form-items">
            <div className="row">
              <div className="col-md-12 Search-bar ">
                <label className="label"><FaSearch /> Search Item Name:</label>
                <input
                  type="text"
                  className="form-control customer-input"
                  placeholder="Search here..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
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
                      <th>Nu</th>
                      <th>Name</th>
                      <th>Brand</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Category</th>
                      <th>Size</th>
                      <th>Discount</th>
                      <th>Insert Date</th>
                      <th>Expired Date</th>
                      <th>Days</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length ? (
                      items.map(item => (
                        <tr key={item.Sid}>
                          <td>{item.code}</td>
                          <td>{item.name}</td>
                          <td>{item.brand}</td>
                          <td>{item.quantity}</td>
                          <td>Rs: {item.price}</td>
                          <td>{item.category}</td>
                          <td>{item.packsize}</td>
                          <td>{item.discount}%</td>
                          <td>{item.insertdate}</td>
                          <td>{item.expiredate}</td>
                          <td>{item.days}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" style={{ textAlign: "center" }}>No items found</td>
                      </tr>
                    )}
                  </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default SearchItems;
