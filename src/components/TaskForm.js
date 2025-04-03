import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './TaskForm.css';

class TaskForm extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.titleInput = React.createRef();
  }

  getInitialState() {
    return {
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      formErrors: {
        title: '',
        description: '',
        dueDate: ''
      },
      formValid: false
    };
  }

  static defaultProps = {
    priorityOptions: ['low', 'medium', 'high']
  };

  componentDidMount() {
    this.titleInput.current.focus();
  }

  validateField = (fieldName, value) => {
    const { formErrors } = this.state;
    let fieldError = '';

    switch (fieldName) {
      case 'title':
        fieldError = value.trim() === '' ? 'Task title is required' : '';
        break;
      case 'description':
        fieldError = value.length > 200 ? 'Description too long (max 200 characters)' : '';
        break;
      case 'dueDate':
        if (value) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const selectedDate = new Date(value);
          fieldError = selectedDate < today ? 'Due date cannot be in the past' : '';
        }
        break;
      default:
        break;
    }

    this.setState({
      formErrors: {
        ...formErrors,
        [fieldName]: fieldError
      }
    }, this.validateForm);
  }

  validateForm = () => {
    const { formErrors, title } = this.state;
    const formValid = title.trim() !== '' && 
                     !formErrors.title && 
                     !formErrors.description && 
                     !formErrors.dueDate;
    
    this.setState({ formValid });
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    
    this.setState({ [name]: value }, () => {
      this.validateField(name, value);
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    
    if (!this.state.formValid) {
      return;
    }
    
    const { title, description, priority, dueDate } = this.state;
    
    const newTask = {
      title,
      description,
      priority,
      dueDate,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    this.props.onAddTask(newTask);
    
    this.setState(this.getInitialState());
    this.titleInput.current.focus();
  }

  render() {
    const { title, description, priority, dueDate, formErrors, formValid } = this.state;
    const { priorityOptions } = this.props;
    
    return (
      <div className="task-form-container">
        <h2>Add New Task</h2>
        <form onSubmit={this.handleSubmit} className="task-form">
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              ref={this.titleInput}
              value={title}
              onChange={this.handleChange}
              className={formErrors.title ? 'error' : ''}
            />
            {formErrors.title && <span className="error-message">{formErrors.title}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={this.handleChange}
              className={formErrors.description ? 'error' : ''}
            />
            {formErrors.description && <span className="error-message">{formErrors.description}</span>}
            <span className="char-counter">{description.length}/200</span>
          </div>
          
          <div className="form-group">
            <label htmlFor="priority">Priority:</label>
            <select
              id="priority"
              name="priority"
              value={priority}
              onChange={this.handleChange}
            >
              {priorityOptions.map(option => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="dueDate">Due Date (optional):</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={dueDate}
              onChange={this.handleChange}
              className={formErrors.dueDate ? 'error' : ''}
            />
            {formErrors.dueDate && <span className="error-message">{formErrors.dueDate}</span>}
          </div>
          
          <button 
            type="submit" 
            className="submit-btn"
            disabled={!formValid}
          >
            Add Task
          </button>
        </form>
      </div>
    );
  }
}

TaskForm.propTypes = {
  onAddTask: PropTypes.func.isRequired,
  priorityOptions: PropTypes.arrayOf(PropTypes.string)
};

export default TaskForm;