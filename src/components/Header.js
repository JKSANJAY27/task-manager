import React from 'react';
import PropTypes from 'prop-types';
import './Header.css';

function Header({ tasksCount, onForceRerender }) {
  const [theme, setTheme] = React.useState('light');
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.className = newTheme;
  };
  
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo">
          <h1>Task Master</h1>
          <span className="task-count">
            {tasksCount} {tasksCount === 1 ? 'task' : 'tasks'}
          </span>
        </div>
        
        <div className="header-actions">
          <button 
            className="theme-toggle"
            onClick={toggleTheme}
          >
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
          
          <button 
            className="refresh-btn"
            onClick={onForceRerender}
          >
            ↻ Refresh
          </button>
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  tasksCount: PropTypes.number.isRequired,
  onForceRerender: PropTypes.func.isRequired,
  onFocusForm: PropTypes.func.isRequired
};

export default Header;