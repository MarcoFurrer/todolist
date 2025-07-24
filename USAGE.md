# Usage Examples

Here are several ways to use the TodoList component:

## Basic Usage

```jsx
import React, { useState } from 'react';
import { TodoList } from '@marcofurrer/react-todolist';
import '@marcofurrer/react-todolist/dist/TodoList.css';

function App() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = (text) => {
    const newTodo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTodos([...todos, newTodo]);
  };

  const handleToggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
        : todo
    ));
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleEditTodo = (id, text) => {
    setTodos(todos.map(todo =>
      todo.id === id
        ? { ...todo, text, updatedAt: new Date() }
        : todo
    ));
  };

  return (
    <TodoList
      items={todos}
      onAddItem={handleAddTodo}
      onToggleItem={handleToggleTodo}
      onDeleteItem={handleDeleteTodo}
      onEditItem={handleEditTodo}
    />
  );
}
```

## Advanced Usage with All Features

```jsx
import React, { useState } from 'react';
import { TodoList } from '@marcofurrer/react-todolist';
import '@marcofurrer/react-todolist/dist/TodoList.css';

function AdvancedApp() {
  const [todos, setTodos] = useState([
    {
      id: '1',
      text: 'Learn React TodoList component',
      completed: false,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      priority: 'high',
      category: 'learning',
      dueDate: new Date('2024-12-31'),
      assignedTo: 'john'
    },
    {
      id: '2',
      text: 'Build an awesome app',
      completed: true,
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-03'),
      priority: 'medium',
      category: 'development'
    }
  ]);

  // ... handler functions ...

  return (
    <TodoList
      items={todos}
      onAddItem={handleAddTodo}
      onToggleItem={handleToggleTodo}
      onDeleteItem={handleDeleteTodo}
      onEditItem={handleEditTodo}
      showPriority={true}
      showCategory={true}
      showDueDate={true}
      showAssignedTo={true}
      sortBy="priority"
      theme="light"
      placeholder="What needs to be done?"
    />
  );
}
```

## TypeScript Usage

```tsx
import React, { useState } from 'react';
import { TodoList, TodoItem } from '@marcofurrer/react-todolist';
import '@marcofurrer/react-todolist/dist/TodoList.css';

function TypeScriptApp() {
  const [todos, setTodos] = useState<TodoItem[]>([]);

  const handleAddTodo = (text: string): void => {
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: 'medium',
      category: 'general'
    };
    setTodos([...todos, newTodo]);
  };

  const handleToggleTodo = (id: string): void => {
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
        : todo
    ));
  };

  const handleDeleteTodo = (id: string): void => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleEditTodo = (id: string, text: string): void => {
    setTodos(todos.map(todo =>
      todo.id === id
        ? { ...todo, text, updatedAt: new Date() }
        : todo
    ));
  };

  return (
    <TodoList
      items={todos}
      onAddItem={handleAddTodo}
      onToggleItem={handleToggleTodo}
      onDeleteItem={handleDeleteTodo}
      onEditItem={handleEditTodo}
      showPriority={true}
      showCategory={true}
      theme="dark"
    />
  );
}
```

## Read-Only Mode

```jsx
import React from 'react';
import { TodoList } from '@marcofurrer/react-todolist';
import '@marcofurrer/react-todolist/dist/TodoList.css';

function ReadOnlyTodoList({ todos }) {
  return (
    <TodoList
      items={todos}
      allowEdit={false}
      allowDelete={false}
      showPriority={true}
      showCategory={true}
      showDueDate={true}
      showAssignedTo={true}
    />
  );
}
```
