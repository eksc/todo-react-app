import React, { Component } from 'react';

import AppHeader from '../app-header'
import SearchPanel from '../search-panel'
import TodoList from '../todo-list'
import ItemStatusFilter from '../item-status-filter'
import ItemAddForm from '..//item-add-form'

import './app.css'

export default class App extends Component {

  maxId = 0;

  state = {
    todoData: [
      this.createTodoItem("Drink Coffee"),
      this.createTodoItem("Make Awesome App"),
      this.createTodoItem("Have a lunch")
    ],
    term: '',
    filter: 'all'
  };

  createTodoItem(label) {
    return {
      label: label, 
      important: false, 
      done: false,
      id: this.maxId++
    };
  }

  toggleProperty(arr, id, propName) {
    const idx = arr.findIndex((el) => el.id === id);
    const oldItem = arr[idx];
    const newItem = {...oldItem, [propName]: !oldItem[propName]};
    
    return [...arr.slice(0, idx), newItem, ...arr.slice(idx+1)];
  }

  deletedItem = (id) => {
    this.setState(({todoData}) => {
      const idx = todoData.findIndex((el) => el.id === id);

      const newArray = [...todoData.slice(0, idx), ...todoData.slice(idx+1)];

      return {
        todoData: newArray
      };
    })
  };

  addItem = (text) => {
    this.setState(({todoData}) => {
      return {
        todoData: [...todoData, this.createTodoItem(text)]
      };
    })
  }

  onToggleImportant = (id) => {
    this.setState(({todoData}) => {
      return {
        todoData: this.toggleProperty(todoData, id, 'important')
      };
    })
  };

  onToggleDone = (id) => {
    this.setState(({todoData}) => {
      return {
        todoData: this.toggleProperty(todoData, id, 'done')
      };
    })
  }

  search(items, term) {
    if (term.length===0){
      return items;
    }

    return items.filter((item) => {
      return item.label.toLowerCase().indexOf(term.toLowerCase()) > -1;
    })
  }

  filter(items, filter) {
    switch(filter) {
      case 'all':
        return items;
      case 'active':
        return items.filter((item) => !item.done);
      case 'done':
        return items.filter((item) => item.done);
      default:
        return items;
    }
  }

  onSearchChange = (term) => {
    this.setState({term});
  }

  onFilterChange = (filter) => {
    this.setState({filter});
  }

  render() {

    const {todoData, term, filter} = this.state;

    const visibleItems = this.filter(this.search(todoData, term), filter);
    const doneCount = todoData.filter((el) => el.done).length;
    const toDoCount = todoData.length-doneCount;

    return (
      <div className="todo-app">
          <AppHeader toDo={toDoCount} done={doneCount}/>
          <div className="top-panel d-flex">
            <SearchPanel onSearchChange={this.onSearchChange}/>
            <ItemStatusFilter 
            filter={filter}
            onFilterChange={this.onFilterChange}/>
          </div>
    
          <TodoList 
          todos={visibleItems}
          onDeleted={(id) => this.deletedItem(id)}
          onToggleImportant={this.onToggleImportant}
          onToggleDone={this.onToggleDone}/>
          <ItemAddForm onAddItem={(text) => this.addItem(text)}/>
        </div>
      );
  }
}

