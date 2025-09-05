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
<<<<<<< HEAD
import Title from './Pages/Admin/title';
import Customer from './Pages/Admin/Customer';
import Staffhome from './Pages/Admin/Staff';
=======
import Items from './Pages/Admin/Item';
import SearchItems from './Pages/Admin/SearchItems';
import Title from './Pages/Admin/title';
import Customer from './Pages/Admin/Customer';
import ViewCustomer from './Pages/Admin/ViewCustomer';
import Staffhome from './Pages/Admin/Staff';
import Supplier from './Pages/Admin/Supplier';
import Bill from './Pages/Admin/Bill';
import Profile from './Pages/Admin/Profile';
import SalesDaily from './Pages/Admin/DailySales';
import SalesMonthly from './Pages/Admin/MonthlySales';
import SalesYearly from './Pages/Admin/YearlySales';
import Backup from './Pages/Admin/Backup';
import Help from './Pages/Admin/Help';

>>>>>>> 792cc480 (second commit)

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
<<<<<<< HEAD
          <Route path="/Title" element={<Title />} />
          <Route path="/Customer" element={<Customer />} />
          <Route path="/Staffhome" element={<Staffhome />} />
=======
          <Route path="/Items" element={<Items />} />
          <Route path="/SearchItems" element={<SearchItems />} />
          <Route path="/Title" element={<Title />} />
          <Route path="/Customer" element={<Customer />} />
          <Route path="/ViewCustomer" element={<ViewCustomer />} />
          <Route path="/Staffhome" element={<Staffhome />} />
          <Route path="/Supplier" element={<Supplier />} />
          <Route path="/Bill" element={<Bill />} />
          <Route path="/SalesDaily" element={<SalesDaily />} />
          <Route path="/SalesMonthly" element={<SalesMonthly />} />
          <Route path="/SalesYearly" element={<SalesYearly />} />
          <Route path="/Backup" element={<Backup />} />
          <Route path="/Help" element={<Help />} />

          <Route path="/Profile" element={<Profile />} />
>>>>>>> 792cc480 (second commit)
        </Routes>
      </Router>
    </>
  );
}

export default App;
