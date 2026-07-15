import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Index from './components/Index';
import { Route, Routes, BrowserRouter, useLocation } from 'react-router-dom'
import Buisness from './pages/Buisness';
import Card from './pages/Card';
import Contact from './pages/Contact';
import Loan from './pages/Loan';
import Login from './pages/Login';
import Personal from './pages/Personal';
import Register from './pages/Register';
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



const AppLayout = ({ theme, setTheme }) => {
  const location = useLocation();
  const hideNav = ['/login', '/register'].includes(location.pathname)
    || location.pathname.startsWith('/dashboard');

  return (
    <div className="min-h-screen bg-zen-light-bg text-black dark:bg-zen-bg dark:text-zen-text transition-colors duration-500">
      {!hideNav && <Navbar theme={theme} setTheme={setTheme} />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/buisness" element={<Buisness />} />
        <Route path="/personal" element={<Personal />} />
        <Route path="/card" element={<Card />} />
        <Route path="/loan" element={<Loan />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login theme={theme} />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard/*' element={<Dashboard accountno={'90076689009'} theme={theme} setTheme={setTheme} />}>
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

      </Routes>
    </div>
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

