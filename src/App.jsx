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



const AppLayout = ({ theme, setTheme }) => {
  const location = useLocation();
  const hideNav = ['/login', '/register'].includes(location.pathname);

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

