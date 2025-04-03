import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './TaskStats.css';

function TaskStats({ tasks }) {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    active: 0,
    completionRate: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
    overdue: 0
  });
  
  const [showStats, setShowStats] = useState(true);

  useEffect(() => {
    const completed = tasks.filter(task => task.completed).length;
    const active = tasks.length - completed;
    const completionRate = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
    
    const highPriority = tasks.filter(task => task.priority === 'high').length;
    const mediumPriority = tasks.filter(task => task.priority === 'medium').length;
    const lowPriority = tasks.filter(task => task.priority === 'low').length;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const overdue = tasks.filter(task => {
      if (!task.dueDate || task.completed) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate < today;
    }).length;
    
    setStats({
      total: tasks.length,
      completed,
      active,
      completionRate,
      highPriority,
      mediumPriority,
      lowPriority,
      overdue
    });
  }, [tasks]);

  const toggleStats = () => {
    setShowStats(prev => !prev);
  };

  return (
    <div className="task-stats">
      <div className="stats-header" onClick={toggleStats}>
        <h3>Task Statistics</h3>
        <span className={`toggle-arrow ${showStats ? 'open' : 'closed'}`}>▼</span>
      </div>
      
      {showStats && (
        <div className="stats-content">
          <div className="stats-row">
            <div className="stat-item">
              <span className="stat-label">Total Tasks:</span>
              <span className="stat-value">{stats.total}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Completed:</span>
              <span className="stat-value">{stats.completed}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Active:</span>
              <span className="stat-value">{stats.active}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Completion Rate:</span>
              <span className="stat-value">{stats.completionRate}%</span>
            </div>
          </div>
          
          <div className="stats-row">
            <div className="stat-item">
              <span className="stat-label">High Priority:</span>
              <span className="stat-value">{stats.highPriority}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Medium Priority:</span>
              <span className="stat-value">{stats.mediumPriority}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Low Priority:</span>
              <span className="stat-value">{stats.lowPriority}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Overdue:</span>
              <span className={`stat-value ${stats.overdue > 0 ? 'overdue' : ''}`}>
                {stats.overdue}
              </span>
            </div>
          </div>
          
          <div className="completion-progress">
            <div className="progress-label">Overall Progress</div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${stats.completionRate}%` }}
              ></div>
            </div>
            <div className="progress-percentage">{stats.completionRate}%</div>
          </div>
        </div>
      )}
    </div>
  );
}

TaskStats.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      priority: PropTypes.string.isRequired,
      dueDate: PropTypes.string,
      completed: PropTypes.bool.isRequired
    })
  ).isRequired
};

export default TaskStats;