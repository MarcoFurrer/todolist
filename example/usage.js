// Import the component
import { TodoList } from '@marcofurrer/react-todolist';

// Import the CSS styles (required for proper styling)
import '@marcofurrer/react-todolist/dist/TodoList.css';

// Or if you prefer the default export:
// import TodoList from '@marcofurrer/react-todolist';

// Now use the component in your React app
function App() {
  // ... your todo logic here
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
