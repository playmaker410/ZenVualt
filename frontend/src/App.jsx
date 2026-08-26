import { useState, useEffect } from 'react';
import { Route, Routes, BrowserRouter, useLocation, Outlet, Navigate } from 'react-router-dom'


import ProtectedRoute from './pages/Dashboard/routes/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';

//Public pages 
import Index from './components/Index';
import Buisness from './pages/Buisness';
import Card from './pages/Card';
import Contact from './pages/Contact';
import Loan from './pages/Loan';
import Login from './pages/Login';
import Personal from './pages/Personal';
import Register from './pages/Register';

//Dashboard 
import Dashboard from './pages/Dashboard/Dashboard';
import Transactions from './pages/Dashboard/Transactions';
import Overview from './pages/Dashboard/Overview';
import Cards from './pages/Dashboard/Cards';
import LocalTransfer from './pages/Dashboard/LocalTransfer';
import InternationalWire from './pages/Dashboard/InternationalWire';
import Deposit from './pages/Dashboard/Deposit';
import LoanReq from './pages/Dashboard/LoanReq';
import Irs from './pages/Dashboard/Irs';
import Loanhistory from './pages/Dashboard/Loanhistory';
import Setting from './pages/Dashboard/Setting';
import Support from './pages/Dashboard/Support';


// Admin
import { Adminlayout } from "./pages/admin/layout/Adminlayout";
import { AdminOverview } from "./pages/admin/AdminOverview";
// import { PendingRequests } from './pages/admin/AdminPendingReq';
import { KycVerification } from './pages/admin/KycVerification';
import { CardRequests } from './pages/admin/CardRequest';
import { LoanRequests } from './pages/admin/AdLoanRequest';
import { AllUsers } from './pages/admin/AllUsers';
import { ManualCreditDebit } from './pages/admin/ManualCredit';
import { Accounts } from './pages/admin/Account';
import { AdminTransactions } from './pages/admin/AdminTransaction';
import { NotificationCenter } from './pages/admin/AdminNotification';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminProtectedRoute } from './pages/admin/routes/AdminProtectedRoute';
import { AdminAuthProvider } from './pages/admin/admincontext/AdminAuthContext';


// Auth scoping layouts — pair each provider with its own route subtree
const UserAuthLayout = () => (
  <AuthProvider>
    <Outlet />
  </AuthProvider>
);

const AdminAuthLayout = () => (
  <AdminAuthProvider>
    <Outlet />
  </AdminAuthProvider>
);


const AppLayout = ({ theme, setTheme }) => {
  const location = useLocation();
  const hideNav = ['/login', '/register',].includes(location.pathname)
    || location.pathname.startsWith('/dashboard')
    || location.pathname.startsWith('/admin');


  return (
    <div className="min-h-screen bg-zen-light-bg text-black dark:bg-zen-bg dark:text-zen-text transition-colors duration-500">
      {!hideNav && <Navbar theme={theme} setTheme={setTheme} />}

      <Routes>
        {/* Everything that needs the USER auth context */}
        <Route element={<UserAuthLayout />}>
          {/* Public Route */}
          <Route path="/" element={<Index />} />
          <Route path="/business" element={<Buisness />} />
          <Route path="/buisness" element={<Navigate to="/business" replace />} />
          <Route path="/personal" element={<Personal />} />
          <Route path="/card" element={<Card />} />
          <Route path="/loan" element={<Loan />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login theme={theme} />} />
          <Route path='/register' element={<Register />} />

          {/* ProtectedRoute */}
          <Route element={<ProtectedRoute />}>
            {/* Dashboard */}
            <Route path='/dashboard/*' element={<Dashboard theme={theme} setTheme={setTheme} />}>

              <Route path='overview' element={<Overview />} />
              <Route path='transactions' element={<Transactions theme={theme} setTheme={setTheme} />} />
              <Route path='cards' element={<Cards theme={theme} setTheme={setTheme} />} />
              <Route path='local-transfer' element={<LocalTransfer theme={theme} setTheme={setTheme} />} />
              <Route path='international' element={<InternationalWire theme={theme} setTheme={setTheme} />} />
              <Route path='deposit' element={<Deposit theme={theme} setTheme={setTheme} />} />
              <Route path='loan-request' element={<LoanReq theme={theme} setTheme={setTheme} />} />
              <Route path='tax-refund' element={<Irs theme={theme} setTheme={setTheme} />} />
              <Route path='loan-history' element={<Loanhistory />} />
              <Route path='settings' element={<Setting />} />
              <Route path='support' element={<Support />} />
            </Route>
          </Route>
        </Route>


        {/* Everything that needs the ADMIN auth context */}
        <Route element={<AdminAuthLayout />}>
          <Route path="/admin/login" element={<AdminLogin theme={theme} />} />

          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin/*" element={<Adminlayout theme={theme} setTheme={setTheme} />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path='dashboard' element={<AdminOverview />} />
              {/* <Route path='pending-registrations' element={<PendingRequests />} /> */}
              <Route path='kyc-verification' element={<KycVerification />} />
              <Route path='card-requests' element={<CardRequests />} />
              <Route path='loan-requests' element={<LoanRequests />} />
              <Route path='manual-credit-debit' element={<ManualCreditDebit />} />
              <Route path='accounts' element={<Accounts />} />
              <Route path='transactions' element={<AdminTransactions />} />
              <Route path='notifications' element={<NotificationCenter />} />

              <Route path='users'>
                <Route path='all' element={<AllUsers />} />

              </Route>
            </Route>
          </Route>
        </Route>

      </Routes>
    </div >
  );
}



const App = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') ? localStorage.
    getItem('theme') : 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    localStorage.setItem('theme', theme);
  }, [theme]);

  return (

    <BrowserRouter>
      <AppLayout theme={theme} setTheme={setTheme} />
    </BrowserRouter>

  );
}
export default App;
