import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Task.css';

class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      editTitle: props.task.title,
      editDescription: props.task.description,
      editPriority: props.task.priority,
      editDueDate: props.task.dueDate,
      formErrors: {
        editTitle: ''
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.task !== nextProps.task) {
      this.setState({
        editTitle: nextProps.task.title,
        editDescription: nextProps.task.description,
        editPriority: nextProps.task.priority,
        editDueDate: nextProps.task.dueDate
      });
    }
  }

  handleToggleCompletion = () => {
    this.props.onToggleCompletion(this.props.task.id);
  }

  handleDeleteTask = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      this.props.onDeleteTask(this.props.task.id);
    }
  }

  toggleEditMode = () => {
    this.setState(prevState => ({
      isEditing: !prevState.isEditing
    }));
  }

  handleEditChange = (event) => {
    const { name, value } = event.target;
    
    this.setState({ [name]: value }, () => {
      if (name === 'editTitle') {
        const error = value.trim() === '' ? 'Title is required' : '';
        this.setState({
          formErrors: {
            ...this.state.formErrors,
            editTitle: error
          }
        });
      }
    });
  }

  handleEditSubmit = (event) => {
    event.preventDefault();
    
    const { editTitle, editDescription, editPriority, editDueDate } = this.state;
    
    if (editTitle.trim() === '') {
      return;
    }
    
    const updatedTask = {
      ...this.props.task,
      title: editTitle,
      description: editDescription,
      priority: editPriority,
      dueDate: editDueDate
    };
    
    this.props.onUpdateTask(updatedTask);
    this.setState({ isEditing: false });
  }

  formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  renderTaskView() {
    const { task } = this.props;
    const isPastDue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
    
    return (
      <div className={`task ${task.completed ? 'completed' : ''} ${isPastDue ? 'past-due' : ''}`}>
        <div className="task-header">
          <div className="task-checkbox">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={this.handleToggleCompletion}
              id={`task-${task.id}`}
            />
            <label htmlFor={`task-${task.id}`}></label>
          </div>
          
          <h3 className={task.completed ? 'completed-text' : ''}>
            {task.title}
          </h3>
          
          <div className="task-actions">
            <button 
              className="edit-btn"
              onClick={this.toggleEditMode}
              disabled={task.completed}
            >
              Edit
            </button>
            <button 
              className="delete-btn"
              onClick={this.handleDeleteTask}
            >
              Delete
            </button>
          </div>
        </div>
        
        <div className="task-details">
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}
          
          <div className="task-meta">
            <span className={`priority priority-${task.priority}`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
            
            {task.dueDate && (
              <span className={`due-date ${isPastDue ? 'past-due-text' : ''}`}>
                Due: {this.formatDate(task.dueDate)}
              </span>
            )}
            
            <span className="created-at">
              Created: {new Date(task.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    );
  }

  renderEditForm() {
    const { 
      editTitle, 
      editDescription, 
      editPriority, 
      editDueDate,
      formErrors
    } = this.state;
    
    return (
      <div className="task task-edit">
        <form onSubmit={this.handleEditSubmit}>
          <div className="form-group">
            <label htmlFor={`edit-title-${this.props.task.id}`}>Title:</label>
            <input
              type="text"
              id={`edit-title-${this.props.task.id}`}
              name="editTitle"
              value={editTitle}
              onChange={this.handleEditChange}
              className={formErrors.editTitle ? 'error' : ''}
            />
            {formErrors.editTitle && (
              <span className="error-message">{formErrors.editTitle}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor={`edit-description-${this.props.task.id}`}>Description:</label>
            <textarea
              id={`edit-description-${this.props.task.id}`}
              name="editDescription"
              value={editDescription}
              onChange={this.handleEditChange}
            />
            <span className="char-counter">{editDescription.length}/200</span>
          </div>
          
          <div className="form-group">
            <label htmlFor={`edit-priority-${this.props.task.id}`}>Priority:</label>
            <select
              id={`edit-priority-${this.props.task.id}`}
              name="editPriority"
              value={editPriority}
              onChange={this.handleEditChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor={`edit-dueDate-${this.props.task.id}`}>Due Date:</label>
            <input
              type="date"
              id={`edit-dueDate-${this.props.task.id}`}
              name="editDueDate"
              value={editDueDate || ''}
              onChange={this.handleEditChange}
            />
          </div>
          
          <div className="edit-actions">
            <button 
              type="submit" 
              className="save-btn"
              disabled={editTitle.trim() === ''}
            >
              Save
            </button>
            <button 
              type="button" 
              className="cancel-btn"
              onClick={this.toggleEditMode}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  render() {
    return this.state.isEditing ? this.renderEditForm() : this.renderTaskView();
  }
}

Task.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    priority: PropTypes.string.isRequired,
    dueDate: PropTypes.string,
    completed: PropTypes.bool.isRequired,
    createdAt: PropTypes.string.isRequired
  }).isRequired,
  onToggleCompletion: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  onUpdateTask: PropTypes.func.isRequired
};

export default Task;