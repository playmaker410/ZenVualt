import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Index from './components/Index';



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
    <div className="bg-zen-light-bg text-black dark:bg-zen-bg dark:text-zen-text transition-colors duration-500">
      <Navbar theme={theme} setTheme={setTheme} />
      <Index />

    </div>

  );
}
export default App;

