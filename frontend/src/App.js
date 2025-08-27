import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from "react-helmet";


import Reset from './Pages/Login/Resetpass';
import ChangePassword from './Pages/Login/ChangePassword';
import ResetPassword from './Pages/Login/ResetPassword';
import Admin from './Pages/Admin/Homepage';
import LoginPage from './Pages/Login/Login';
import Staff from './Pages/Staff/staffhome';
import PrivateRoute from './Pages/Admin/PrivateRoute';

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
        </Routes>
      </Router>
    </>
  );
}

export default App;
