import React from 'react';
import PropTypes from 'prop-types';
import Task from './Task';
import './TaskList.css';

function TaskList({ tasks, onToggleCompletion, onDeleteTask, onUpdateTask }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-list">
        <p>No tasks found. Add some tasks to get started!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <Task
          key={task.id}
          task={task}
          onToggleCompletion={onToggleCompletion}
          onDeleteTask={onDeleteTask}
          onUpdateTask={onUpdateTask}
        />
      ))}
    </div>
  );
}

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      priority: PropTypes.string.isRequired,
      dueDate: PropTypes.string,
      completed: PropTypes.bool.isRequired,
      createdAt: PropTypes.string.isRequired
    })
  ).isRequired,
  onToggleCompletion: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  onUpdateTask: PropTypes.func.isRequired
};

export default TaskList;