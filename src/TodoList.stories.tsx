import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { useState } from 'react';
import TodoList from './TodoList';
import { TodoItem } from './types';
import './TodoList.css';

const meta: Meta<typeof TodoList> = {
  title: 'Components/TodoList',
  component: TodoList,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A professional TodoList component with table layout, sorting, and comprehensive features.',
      },
    },
  },
  argTypes: {
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
    },
    sortBy: {
      control: { type: 'select' },
      options: ['createdAt', 'priority', 'dueDate', 'text'],
    },
    sortOrder: {
      control: { type: 'select' },
      options: ['asc', 'desc'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof TodoList>;

const sampleTodos: TodoItem[] = [
  {
    id: '1',
    text: 'Design new user interface mockups',
    completed: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    priority: 'high',
    category: 'design',
    dueDate: new Date('2024-12-31'),
    assignedTo: 'John Smith'
  },
  {
    id: '2',
    text: 'Implement user authentication system',
    completed: true,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-03'),
    priority: 'high',
    category: 'development'
  },
  {
    id: '3',
    text: 'Write comprehensive documentation',
    completed: false,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
    priority: 'medium',
    category: 'documentation',
    assignedTo: 'Jane Doe'
  },
  {
    id: '4',
    text: 'Setup CI/CD pipeline',
    completed: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    priority: 'low',
    category: 'devops',
    dueDate: new Date('2024-01-15'),
    assignedTo: 'Bob Wilson'
  },
  {
    id: '5',
    text: 'Conduct user testing sessions',
    completed: false,
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-04'),
    priority: 'medium',
    category: 'testing',
    dueDate: new Date('2025-02-01'),
    assignedTo: 'Alice Brown'
  },
  {
    id: '6',
    text: 'Optimize database queries',
    completed: true,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-06'),
    priority: 'high',
    category: 'performance'
  }
];

// Interactive wrapper component for Storybook
const InteractiveTodoList = (props: any) => {
  const [todos, setTodos] = useState<TodoItem[]>(props.items || []);

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
    action('onAddItem')(text);
  };

  const handleToggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
        : todo
    ));
    action('onToggleItem')(id);
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
    action('onDeleteItem')(id);
  };

  const handleEditTodo = (id: string, text: string) => {
    setTodos(todos.map(todo =>
      todo.id === id
        ? { ...todo, text, updatedAt: new Date() }
        : todo
    ));
    action('onEditItem')(id, text);
  };

  return (
    <TodoList
      {...props}
      items={todos}
      onAddItem={handleAddTodo}
      onToggleItem={handleToggleTodo}
      onDeleteItem={handleDeleteTodo}
      onEditItem={handleEditTodo}
    />
  );
};

export const Default: Story = {
  args: {
    items: sampleTodos,
    onAddItem: action('onAddItem'),
    onToggleItem: action('onToggleItem'),
    onDeleteItem: action('onDeleteItem'),
    onEditItem: action('onEditItem'),
  },
};

export const Interactive: Story = {
  render: (args) => <InteractiveTodoList {...args} />,
  args: {
    items: sampleTodos,
  },
};

export const Empty: Story = {
  render: (args) => <InteractiveTodoList {...args} />,
  args: {
    items: [],
  },
};

export const FullFeatured: Story = {
  render: (args) => <InteractiveTodoList {...args} />,
  args: {
    items: sampleTodos,
    showPriority: true,
    showCategory: true,
    showDueDate: true,
    showAssignedTo: true,
    sortBy: 'priority',
    placeholder: "What's your next task?"
  },
};

export const DarkTheme: Story = {
  render: (args) => <InteractiveTodoList {...args} />,
  args: {
    items: sampleTodos,
    theme: 'dark',
    showPriority: true,
    showCategory: true,
    showDueDate: true,
    showAssignedTo: true,
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};

export const ReadOnly: Story = {
  render: (args) => <InteractiveTodoList {...args} />,
  args: {
    items: sampleTodos,
    allowEdit: false,
    allowDelete: false,
    showPriority: true,
    showCategory: true,
    showDueDate: true,
    showAssignedTo: true,
  },
};

export const Limited: Story = {
  render: (args) => <InteractiveTodoList {...args} />,
  args: {
    items: sampleTodos,
    maxItems: 3,
    showPriority: true,
    showCategory: true,
  },
};

export const PriorityFocused: Story = {
  render: (args) => <InteractiveTodoList {...args} />,
  args: {
    items: sampleTodos,
    showPriority: true,
    sortBy: 'priority',
    sortOrder: 'desc',
  },
};
