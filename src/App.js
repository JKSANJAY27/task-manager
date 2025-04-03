import React, { Component } from 'react';
import './App.css';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskStats from './components/TaskStats';
import Header from './components/Header';
import Footer from './components/Footer';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      filter: 'all'
    };
    this.taskFormRef = React.createRef();
  }

  componentWillMount() {
    console.log('App component will mount');
    // Load tasks from localStorage if available
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      this.setState({ tasks: JSON.parse(savedTasks) });
    }
  }

  componentDidMount() {
    console.log('App component did mount');
    document.title = 'Task Management System';
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('App component did update');
    // Save tasks to localStorage whenever they change
    if (prevState.tasks !== this.state.tasks) {
      localStorage.setItem('tasks', JSON.stringify(this.state.tasks));
    }
  }

  componentWillUnmount() {
    console.log('App component will unmount');
    // Cleanup code if needed
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Optimize renders by checking if state actually changed
    return (
      this.state.tasks !== nextState.tasks || 
      this.state.filter !== nextState.filter
    );
  }

  addTask = (newTask) => {
    this.setState(prevState => ({
      tasks: [...prevState.tasks, { ...newTask, id: Date.now() }]
    }));
  }

  deleteTask = (taskId) => {
    this.setState(prevState => ({
      tasks: prevState.tasks.filter(task => task.id !== taskId)
    }));
  }

  updateTask = (updatedTask) => {
    this.setState(prevState => ({
      tasks: prevState.tasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    }));
  }

  toggleTaskCompletion = (taskId) => {
    this.setState(prevState => ({
      tasks: prevState.tasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    }));
  }

  setFilter = (filter) => {
    this.setState({ filter });
  }

  getFilteredTasks = () => {
    const { tasks, filter } = this.state;
    
    switch(filter) {
      case 'active':
        return tasks.filter(task => !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      case 'high':
        return tasks.filter(task => task.priority === 'high');
      case 'medium':
        return tasks.filter(task => task.priority === 'medium');
      case 'low':
        return tasks.filter(task => task.priority === 'low');
      default:
        return tasks;
    }
  }

  clearCompletedTasks = () => {
    this.setState(prevState => ({
      tasks: prevState.tasks.filter(task => !task.completed)
    }));
  }

  forceRerender = () => {
    this.forceUpdate();
    console.log('Component forcefully re-rendered');
  }

  focusTaskForm = () => {
    if (this.taskFormRef.current) {
      const firstInput = this.taskFormRef.current.querySelector('input');
      if (firstInput) {
        firstInput.focus();
      }
    }
  }

  findDOMNode(component) {
    return component;
  }

  render() {
    const { tasks, filter } = this.state;
    const filteredTasks = this.getFilteredTasks();
    
    return (
      <div className="app-container">
        <Header 
          tasksCount={tasks.length} 
          onForceRerender={this.forceRerender}
          onFocusForm={this.focusTaskForm}
        />
        
        <main className="main-content">
          <TaskForm 
            ref={this.taskFormRef}
            onAddTask={this.addTask} 
          />
          
          <div className="filter-controls">
            <button 
              className={filter === 'all' ? 'active' : ''} 
              onClick={() => this.setFilter('all')}
            >
              All
            </button>
            <button 
              className={filter === 'active' ? 'active' : ''} 
              onClick={() => this.setFilter('active')}
            >
              Active
            </button>
            <button 
              className={filter === 'completed' ? 'active' : ''} 
              onClick={() => this.setFilter('completed')}
            >
              Completed
            </button>
            <button 
              className={filter === 'high' ? 'active' : ''} 
              onClick={() => this.setFilter('high')}
            >
              High Priority
            </button>
            <button 
              className={filter === 'medium' ? 'active' : ''} 
              onClick={() => this.setFilter('medium')}
            >
              Medium Priority
            </button>
            <button 
              className={filter === 'low' ? 'active' : ''} 
              onClick={() => this.setFilter('low')}
            >
              Low Priority
            </button>
            {tasks.some(task => task.completed) && (
              <button 
                className="clear-completed"
                onClick={this.clearCompletedTasks}
              >
                Clear Completed
              </button>
            )}
          </div>
          
          <TaskList 
            tasks={filteredTasks}
            onToggleCompletion={this.toggleTaskCompletion}
            onDeleteTask={this.deleteTask}
            onUpdateTask={this.updateTask}
          />
          
          <TaskStats tasks={tasks} />
        </main>
        
        <Footer />
      </div>
    );
  }
}

export default App;
