# @marcofurrer/react-todolist

A clean, customizable React TodoList component with TypeScript support. Perfect for adding todo functionality to your React applications.

## ✨ Features

- 🎨 **Clean & Modern Design** - Beautiful UI with light/dark theme support
- 🔧 **Highly Customizable** - Extensive props for customization
- 📱 **Responsive** - Works perfectly on mobile and desktop
- ⚡ **TypeScript Support** - Full type safety out of the box
- 🎯 **Feature Rich** - Priority levels, categories, due dates, assignments
- 🔍 **Filtering & Sorting** - Multiple filter and sort options
- ✏️ **Inline Editing** - Edit todos directly in the list
- 🗂️ **Advanced Editor** - Click on any task to open a detailed modal editor
- 🎭 **Accessible** - Full keyboard and screen reader support

## 📦 Installation

```bash
npm install @marcofurrer/react-todolist react-cart-editor
```

or

```bash
yarn add @marcofurrer/react-todolist react-cart-editor
```

> **Note**: `react-cart-editor` is required for the advanced modal editor feature.

## 🚀 Quick Start

```jsx
import React, { useState } from 'react';
import { TodoList } from '@marcofurrer/react-todolist';
import '@marcofurrer/react-todolist/dist/TodoList.css';
// Import cart editor styles for advanced editing modal
import 'react-cart-editor/dist/style.css';

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

export default App;
```

## 🗂️ Advanced Task Editor

The TodoList now includes an advanced modal editor that opens when you click on any task. This provides a rich editing experience with:

- **Detailed Form Fields**: Edit title, description, assignee, priority, and due date
- **Elegant Modal Interface**: Beautiful, responsive modal with smooth animations
- **Enhanced User Experience**: Better than inline editing for complex task details
- **Professional Design**: Matches the overall component aesthetic

### Using the Advanced Editor

Simply click on any task text to open the detailed editor modal. The editor will:

1. **Auto-populate** with the current task information
2. **Allow rich editing** of all task properties
3. **Save changes** back to your todo list
4. **Provide validation** and error handling

### Styling the Editor

The cart editor styles are automatically included when you import:

```css
/* Required for the advanced editor modal */
@import 'react-cart-editor/dist/style.css';
```

## 📋 API Reference

### TodoItem Interface

```typescript
interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  dueDate?: Date;
}
```

### TodoList Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `TodoItem[]` | `[]` | Array of todo items |
| `onAddItem` | `(text: string) => void` | - | Callback when adding new item |
| `onToggleItem` | `(id: string) => void` | - | Callback when toggling item completion |
| `onDeleteItem` | `(id: string) => void` | - | Callback when deleting item |
| `onEditItem` | `(id: string, text: string) => void` | - | Callback when editing item text |
| `showCompleted` | `boolean` | `true` | Whether to show completed items |
| `allowEdit` | `boolean` | `true` | Whether to allow editing items |
| `allowDelete` | `boolean` | `true` | Whether to allow deleting items |
| `showPriority` | `boolean` | `false` | Whether to show priority badges |
| `showCategory` | `boolean` | `false` | Whether to show category tags |
| `showDueDate` | `boolean` | `false` | Whether to show due dates |
| `showAssignedTo` | `boolean` | `false` | Whether to show assignments |
| `placeholder` | `string` | `'Add a new todo...'` | Input placeholder text |
| `className` | `string` | - | Additional CSS class name |
| `theme` | `'light' \| 'dark'` | `'light'` | Theme variant |
| `maxItems` | `number` | - | Maximum number of items to display |
| `sortBy` | `'createdAt' \| 'priority' \| 'dueDate' \| 'text'` | `'createdAt'` | Sort field |
| `sortOrder` | `'asc' \| 'desc'` | `'desc'` | Sort direction |

## 🎨 Advanced Examples

### With Priority and Categories

```jsx
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
  theme="dark"
/>
```

### Read-only Mode

```jsx
<TodoList
  items={todos}
  allowEdit={false}
  allowDelete={false}
  onAddItem={undefined}
  showCompleted={true}
/>
```

### Limited Items with Custom Styling

```jsx
<TodoList
  items={todos}
  onAddItem={handleAddTodo}
  onToggleItem={handleToggleTodo}
  maxItems={10}
  className="my-custom-todolist"
  placeholder="What needs to be done?"
  sortBy="dueDate"
  sortOrder="asc"
/>
```

## 🎭 Theming

The component includes built-in light and dark themes. You can also customize the appearance using CSS custom properties:

```css
.my-custom-todolist {
  --todolist-primary-color: #your-color;
  --todolist-background: #your-background;
  --todolist-text-color: #your-text-color;
}
```

## 🔧 Development

To contribute to this project:

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development: `npm run dev`
4. Build: `npm run build`
5. Run tests: `npm test`
6. Start Storybook: `npm run storybook`

### Development Commands

- `npm run dev` - Start development build with watch mode
- `npm run build` - Build the library for production
- `npm test` - Run Jest tests
- `npm run storybook` - Start Storybook for component development
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically

## 📄 License

MIT © Marco Furrer

## 🤝 Contributing

Contributions, issues and feature requests are welcome! Feel free to check the [issues page](https://github.com/MarcoFurrer/todolist/issues).

## ⭐ Show your support

Give a ⭐️ if this project helped you!
