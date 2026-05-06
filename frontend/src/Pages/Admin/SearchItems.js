import Head from './Head';
import Sidebar from './Sidebar';
import React, { useState, useEffect } from "react";
import './css/all.css';
import './css/category.css';
import { FaSearch } from "react-icons/fa";
import axios from "axios";

const SearchItems = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // 🔥 Debounced search
  useEffect(() => {
    const delay = setTimeout(() => {

      if (!search.trim()) {
        setItems([]);
        return;
      }

      setLoading(true);

      axios.get(`http://localhost:5000/api/category/search?q=${search}`)
        .then((res) => setItems(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));

    }, 400);

    return () => clearTimeout(delay);

  }, [search]);

  return (
    <div>
      <Head />

      <div className={`main-content ${isOpen ? "shifted" : ""}`}>
        <div className={`background ${isOpen ? "active" : ""}`}>

          <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

          <h1>F i n d _ I t e m s</h1>

          {/* 🔍 Search Bar */}
          <form className="form-items">
            <div className="row">
              <div className="col-md-12 Search-bar">
                <label className="label">
                  <FaSearch /> Search Item Name:
                </label>
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

          {/* 📊 Table */}
          <div className="card-block">
            <div className="rows">
              <h3>Items Details</h3>

              <table className="table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Brand</th>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Price</th> 
                    <th>Discount</th>
                    <th>Insert Date</th>
                    <th>Expired Date</th>
                    <th>Days</th>
                  </tr>
                </thead>

                <tbody>

                  {/* 🔥 Empty search */}
                  {!search ? (
                    <tr>
                      <td colSpan="11" style={{ textAlign: "center" }}>
                        Type something to search...
                      </td>
                    </tr>

                  ) : loading ? (
                    <tr>
                      <td colSpan="11" style={{ textAlign: "center" }}>
                        Loading...
                      </td>
                    </tr>

                  ) : items.length === 0 ? (
                    <tr>
                      <td colSpan="11" style={{ textAlign: "center" }}>
                        No items found
                      </td>
                    </tr>

                  ) : (
                    items.map((item, index) => (
                      <tr key={item.Iid}>
                        <td>{index + 1}</td>
                        <td>{item.brand}</td>
                        <td>{item.iname} {item.packsize}</td>
                        <td>{item.quantity || 0} {item.category}</td>
                        <td>Rs:{item.price || 0}</td>
                        <td>{item.discount || 0}%</td>
                        <td>
                          {item.insertdate 
                            ? new Date(item.insertdate).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td>
                          {item.expiredate 
                            ? new Date(item.expiredate).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td>{item.days}</td>
                      </tr>
                    ))
                  )}

                </tbody>
              </table>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SearchItems;