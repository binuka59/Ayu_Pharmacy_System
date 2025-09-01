import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from "react-helmet";


import Reset from './Pages/Login/Resetpass';
import ChangePassword from './Pages/Login/ChangePassword';
import ResetPassword from './Pages/Login/ResetPassword';
import Admin from './Pages/Admin/Homepage';
import LoginPage from './Pages/Login/Login';
import Staff from './Pages/Staff/staffhome';
import PrivateRoute from './Pages/Admin/PrivateRoute';
import Category from './Pages/Admin/Category';
import Title from './Pages/Admin/title';
import Customer from './Pages/Admin/Customer';
import Staffhome from './Pages/Admin/Staff';

function App() {
  return (
    <>
      <Helmet>
        <title> |Ayu Pharmacy</title>
      </Helmet>

      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/ChangePassword" element={<ChangePassword />} />
          <Route path="/ResetPassword" element={<ResetPassword />} />
          <Route path="/Admin" element={<PrivateRoute role="admin"><Admin /></PrivateRoute>} />
          <Route path="/Staff" element={<PrivateRoute role="staff"><Staff /></PrivateRoute>} />
          <Route path="/Category" element={<Category />} />
          <Route path="/Title" element={<Title />} />
          <Route path="/Customer" element={<Customer />} />
          <Route path="/Staffhome" element={<Staffhome />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
