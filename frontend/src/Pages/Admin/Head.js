import React, { useState , useEffect , useRef} from "react";
import { Link } from 'react-router-dom';
import './css/head.css';
import './css/chatbot.css';
import { FaBell,FaCog, FaUser, FaSignOutAlt,FaTimes,FaPlus  } from "react-icons/fa";
import axios from "../../../src/api/axiosInstance";
import {  } from 'react-icons/fa';
import './css/profile.css';
import { createPortal } from "react-dom";
import { IoSend } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";





function Head() 
{
  const [user, setUser] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [notifiData, setNotifiData] = useState(null);

  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState('');
  const [profilePopup, setProfilePopup] = useState(false);
  const [password, setPassword] = useState("");
  const [showEditPopup,setShowEditPopup] = useState(false);
  const [editLoading , setEditLoading] = useState(false);
  const [shownotifiPopup,setShowNotifiPopup] = useState(false);
  const [botPopup , setShowBootPopup] =useState(false);
  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorPopup ,setErrorPopup] = useState(false);
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);





  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const logout = () => {
  localStorage.removeItem("token"); 
  window.location.href = "/"; 

};


  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);


  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5000/api/log/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUserId(res.data.id);
        setName(res.data.name);  
        setEmail(res.data.email);
        setMobile(res.data.mobile);
        
      })
      .catch((err) => console.log(err));
  }, []);


  const checkPassword = async () => {
    setEditLoading(true);
    const token = localStorage.getItem("token");

    if (password === "") {
      setError("Enter password");
      return;
    }

    else
    { 
      try{

        await axios.post(
          "http://localhost:5000/api/log/checkpassword",
          {password},
            {headers:{Authorization:`Bearer ${token}`}}
          );

          setProfilePopup(false);
          setPassword("");
          setShowEditPopup(true);

        }catch(err){
          setError("Wrong Password");

        }
    }
    setEditLoading(false);
  };

const updateProfile = async () => {
  setEditLoading(true);

  try {
  await axios.put("http://localhost:5000/api/log/updateprofile",
  {
    id: userId,  
    name,
    email,
    mobile
   }
  );


  } catch (err) {
  setError("Update Failed");

  }
  setEditLoading(false);
};





useEffect(() => {

  const token = localStorage.getItem("token");

  axios.get("http://localhost:5000/api/log/user", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then((res)=>{
    setUser(res.data.name)
  })

},[])



useEffect(()=>{

 axios.get("http://localhost:5000/api/notification/notifications")
 .then(res=>{
    setNotifications(res.data);
 });

},[]);

useEffect(()=>{

 axios.get("http://localhost:5000/api/log/updateExpireDays")
 .then(res=>{
    
 });

},[]);

const Notifymessage = (id) => {
  
  axios.get(`http://localhost:5000/api/notification/checknotifi/${id}`)
  .then((res) => {
    setNotifiData(res.data);
    setShowNotifiPopup(true);

  })
  .catch((err) => {



 });
};
// -------------------------------image upload----------------------------------------------


const handlePlusClick = () => {
    fileInputRef.current.click(); 
  };

const handleFileChange = (e) => {
  if (!e.target.files || e.target.files.length === 0) return;

  const file = e.target.files[0];
  setSelectedImage(file);

  const imageUrl = URL.createObjectURL(file);
  setPreview(imageUrl);

   e.target.value = "";
};

// -----------------------------------chat bot --------------------------------------------


const SendMessage = async () => {
  if (!input.trim() && !selectedImage) return;

  const formData = new FormData();

  if (input.trim()) {
    formData.append("message", input);
  }

  if (selectedImage) {
    formData.append("image", selectedImage);
  }

  // ----------------------user message (text + image preview)---------------------
  
  setChat(prev => [
    ...prev,
    {
      text: input || null,
      image: preview || null,
      type: "user"
    }
  ]);

  setLoading(true);

  try {
    const res = await axios.post(
      "http://localhost:5000/api/chat/chats",
      formData
    );

    const med = res.data.medicine;


      if (med) {
        setChat(prev => [
          ...prev,
          {
            format: "card",
            type: "bot",
            data: med
          }
        ]);
      } else {
        setChat(prev => [
          ...prev,
          {
            text: res.data.reply || "No data found",
            type: "bot"
          }
        ]);
      }
    

    setInput("");
    setSelectedImage(null);
    setPreview(null);

  } catch (err) {
    console.error(err);
  }

  setLoading(false);
};



/* ---------------- API FIRST ---------------- */


const MedicineCard = ({ data }) => {
  return (
    <div className="reply">
      <h3>💊 {data.name}</h3>

      <p><b>🩺Uses:</b>
        {Array.isArray(data.uses)
          ? data.uses.map((u, i) => <p key={i}>{u}</p>)
          : <p>{data.uses}</p>}
      </p>

      <p><b>⚠️Warnings:</b> {data.warnings}</p>
      <p><b>💉Side Effects:</b> {data.sideEffects}</p>
      
    </div>
  );
};


// ---------------------------------------------------------------------------------------------

  useEffect(() => {
    let timer;

  
    if (error) {
      timer = setTimeout(() => {
        setError("");
      }, 2000);
    }
  
    return () => clearTimeout(timer); 
  }, [ error]);

  useEffect(() => {
    let timer;

  
    if (error) {
      setErrorPopup(true);
  
      timer = setTimeout(() => {
        setErrorPopup(false);
        setError("");
      }, 2000);
    }
  
    return () => clearTimeout(timer);
  }, [error]);
    
  return (
<div class="sidebar-mini fixed"> 
      <div class="wrapper">
        <header class="main-header-top hidden-print">
          <div class="banner-head">
            <div class="logo-row-f">
                <span>A<span1>yu</span1></span>
            </div>
            <div class="logo-row-s">
              <img class="img-fluid logo" src="/logo1.png" alt="logo"/>
              <span>P<span1>harmacy</span1></span>
            </div>
          </div>
        

          <nav class="nav">
          
            <ul class="top-nav">
              {/* <h4>Nice Day,Good Morning</h4> */}
            </ul>
            <div class="navbar-custom-menu f-right">

            <ul class="top-nav">
               <img src="/images/Ai.png" alt="Ai_bot" className="bot-ai" onClick={()=> setShowBootPopup(true)}/>
            </ul>
            { botPopup &&createPortal(
              <div className="popup-overlay">
                <div className="chatbot-box"> 
                  <FaTimes className="clos-btn"  onClick={() => setShowBootPopup(false)} />
                    {errorPopup &&(
                      <div className="popup-error">
                        <div class="messageshow">
                          {error && <p style={{ color: "white" }}>{error}</p>}
                        </div>
                      </div>

                    )}
                    <div className="section left">
                      <h2>Ayu  Assistent</h2>
                      <img src="/images/ai.png" style={{width:"15rem", height:"19rem"}}  alt="alertimage" className="bot-ai"/>
                      <span> V 1.0 </span>
                    </div> 
                    <div className="section-right">
                    <div className="chat-bot">
                      <h4>What’s on your mind today?</h4>

                      
                    {chat.map((msg, index) => (
                      msg.format === "card" ? (
                        <MedicineCard key={index} data={msg.data} className="reply" />
                      ) : (
                        <div key={index} className={msg.type === "user" ? "message" : "reply"}>
                          <p>{msg.text}</p>
                        {msg.image && (
                          <img src={msg.image}  alt="medicine"
                                style={{ width: "150px", borderRadius: "10px", marginTop: "5px" }} />
                        )}

                        </div>
                      )
                    ))}
                    <div ref={chatEndRef}></div>

                    {loading && <p className="typing">L o a r d i n g . . .</p>}


                    </div>
                     <div className="searchdata">
                    <FaPlus className="icon plus" onClick={handlePlusClick} />

                    {/* hidden file input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      hidden
                      onChange={handleFileChange}
                    />

                    {/* main input wrapper */}
                    <div className="input-wrapper">

                      {/* preview inside input */}
                      {preview && (
                        <div className="preview-box">
                          <img src={preview} alt="preview" />
                          <FaTimes
                            className="remove"
                            onClick={() => {
                              setPreview(null);
                              setSelectedImage(null);
                            }}
                          />
                        </div>
                      )}

                      {/* text input */}
                      <input
                        type="text"
                        className="input-box"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask Anything"
                        onKeyDown={(e) => e.key === "Enter" && SendMessage()}
                      />
                    </div>

                    {/* send button */}
                    {loading ? (
                      <AiOutlineLoading3Quarters className="icon spin" />
                    ) : (
                      <IoSend className="icon send" onClick={SendMessage} />
                    )}
                  </div>
                    </div>

                </div>

              </div>,
              document.body
            )}

              <ul class="top-nav">
                <li class="dropdown notification-menu">
                 
                    <div class="icons"><FaBell /></div>
                    <span class="badge  header-badge">{notifications.length}</span>
                  
                  <ul className="dropdown-menu">

                    <li className="not-head">
                    You have <b className="text-primary">{notifications.length}</b> notifications
                    </li>

                    {notifications.map((item,index)=>{

                      const today = new Date();
                      const expDate = new Date(item.expiredate);

                      let message = "";

                      if (item.quantity === 0) {
                        message = `${item.iname} is out of stock`;
                      } else if (expDate <= today) {
                        message = `${item.iname} is expired`;
                      } else {
                        message = `${item.iname} is expiring soon`;
                      }

                      return(

                      <li key={index} className="bell-notification">


                          <div className="media-body">
                            <span className="block" onClick={() => Notifymessage(item.itemId) }>{message}</span>
                          </div>



                      </li>

                      );

                    })}
                    

                    </ul>
                </li>
                  {shownotifiPopup &&  notifiData && createPortal(
                      <div className="popup-overlay">
                        <div className="profile-up">   
                          <FaTimes className="clos-btn"  onClick={() => setShowNotifiPopup(false)} />
                            <h2>Notification Alert</h2>
                            <img src="/images/bell.jpg" style={{width:"10rem", height:"10rem"}}  alt="alertimage" className="img-circle"/>
                            <h4>
                              {notifiData.iname} {notifiData.packsize} {notifiData.categoryName}
                            </h4>

                            <h5>
                              This {notifiData.brand}  Brand  {notifiData.iname} {notifiData.packsize}  Product {" "}
                              
                              {notifiData.quantity === 0
                                ? "Out of Stock"
                                : new Date(notifiData.expiredate) <= new Date()
                                ? `${notifiData.quantity} ${notifiData.categoryName} in (${notifiData.expiredate}) this Day Expired`
                                : `${notifiData.quantity} ${notifiData.categoryName} Expiring Soon`}
                            </h5>
 
                         

                        </div>
                      </div>,
                      document.body
                    )} 
                

                <li className="dropdown">
                  <a href="#!" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" class="dropdown-toggle drop icon-circle drop-image">
                    <span>
                      <img src="/logo1.png" style={{width:"40px",border:"3px solid black"}} alt="Userimage" className="img-circle"/>
                    </span>
                    <span>{user || "Name"} <i className=" icofont icofont-simple-down"></i></span>

                  </a>
                  <ul className="dropdown-menu settings-menu">
                    <li><i className="icon-profile"><FaCog/></i>  Settings</li>
                    <li onClick={() => setProfilePopup(true) }><i className="icon-profile"><FaUser/></i> Profile</li>
                    <li onClick={toggleFullScreen}><i className="icon-profile"><FaUser/></i>  Full Screen</li>                   
                    <li class="p-0"><div class="dropdown-divider m-0"></div></li>
                    
                  <li>
                      <Link to="/" onClick={logout}>
                       <i className="icon-profile"><FaSignOutAlt /></i> Logout
                      </Link>
                    </li>

                  </ul>
                </li>
              </ul>

                {profilePopup && createPortal(
                  <div className="popup-overlay">
                    <div className="profile-up">   
                      <FaTimes className="clos-btn"  onClick={() => setProfilePopup(false)} />
                        <h2>Edit Profile</h2>
                         {error && <p style={{ color: "red" }}>{error}</p>}
                         <img src="/images/y1.png"  alt="Userimage" className="img-circle"/>
                        <form className="form-customer ">
                            <input
                              type="password"
                              className="form-password"
                              placeholder="Enter password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                            />
                          </form>
                        <button className="prook" onClick={checkPassword} disabled={editLoading}> 
                          {editLoading ? "Cheking Password..." : "Confirm "}
                       </button>


                    </div>
                  </div>,
                  document.body
                )} 

                {showEditPopup && createPortal(
                  <div className="popup-overlay">
                    <div className="profile-up">
                      <FaTimes className="clos-btn"  onClick={() => setShowEditPopup(false)} />
                      <h2>Update Profile</h2>
                      {error && <p style={{ color: "red" }}>{error}</p>}
                      <form className="form-customer">
                        <div className="row">
                          <div className="form-data">
                            <span1>Name:</span1>
                            <input type="text" className="form-control" value={name} style={{width : "30rem"}}
                              onChange={(e)=>setName(e.target.value)} />
                          </div>
                          <div className="form-data">
                            <span1>Email Address:</span1>
                            <input type="email" className="form-control" value={email} style={{width : "30rem"}}
                              onChange={(e)=>setEmail(e.target.value)} />
                          </div>
                          <div className="form-data">
                            <span1>Mobile Number:</span1>
                            <input type="text" className="form-control" value={mobile} style={{width : "30rem"}}
                              onChange={(e)=>{const value = e.target.value.replace(/[^0-9]/g, "");setMobile(value)}}  maxLength="10" />
                          </div>

                        </div>
                      </form>
                      <button className="prook" onClick={updateProfile} disabled={editLoading}> 
                        {editLoading ? "Updating Profile..." : "Update "}
                      </button>

                    </div>

                  </div>,
                   document.body
                        
                )} 

                      
            </div>
          </nav>
        </header>
      </div>
    </div>
  )
}

export default Head
