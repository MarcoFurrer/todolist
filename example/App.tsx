import React, { useState } from 'react';
import { TodoList, TodoItem } from '../src';

const ExampleApp: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([
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
    },
    {
      id: '3',
      text: 'Share with the community',
      completed: false,
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03'),
      priority: 'low',
      category: 'community',
      assignedTo: 'jane'
    }
  ]);

  const handleAddTodo = (text: string) => {
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

  const handleToggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
        : todo
    ));
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleEditTodo = (id: string, text: string) => {
    setTodos(todos.map(todo =>
      todo.id === id
        ? { ...todo, text, updatedAt: new Date() }
        : todo
    ));
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>TodoList Component Examples</h1>
      
      <section style={{ marginBottom: '3rem' }}>
        <h2>Basic Example</h2>
        <TodoList
          items={todos}
          onAddItem={handleAddTodo}
          onToggleItem={handleToggleTodo}
          onDeleteItem={handleDeleteTodo}
          onEditItem={handleEditTodo}
        />
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2>Feature-Rich Example</h2>
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
          placeholder="What's on your mind?"
        />
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2>Dark Theme Example</h2>
        <TodoList
          items={todos}
          onAddItem={handleAddTodo}
          onToggleItem={handleToggleTodo}
          onDeleteItem={handleDeleteTodo}
          onEditItem={handleEditTodo}
          theme="dark"
          showPriority={true}
          showCategory={true}
          maxItems={5}
        />
      </section>

      <section>
        <h2>Read-Only Example</h2>
        <TodoList
          items={todos}
          allowEdit={false}
          allowDelete={false}
          showPriority={true}
          showCategory={true}
          showDueDate={true}
          showAssignedTo={true}
        />
      </section>
    </div>
  );
};

export default ExampleApp;
