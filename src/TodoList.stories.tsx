import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import TodoList from './TodoList';
import { TodoItem } from './types';

const meta: Meta<typeof TodoList> = {
  title: 'Components/TodoList',
  component: TodoList,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A customizable TodoList component with full TypeScript support.',
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
  },
  {
    id: '4',
    text: 'Overdue task example',
    completed: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    priority: 'high',
    category: 'urgent',
    dueDate: new Date('2024-01-15'),
    assignedTo: 'bob'
  }
];

export const Default: Story = {
  args: {
    items: sampleTodos,
    onAddItem: action('onAddItem'),
    onToggleItem: action('onToggleItem'),
    onDeleteItem: action('onDeleteItem'),
    onEditItem: action('onEditItem'),
  },
};

export const Empty: Story = {
  args: {
    items: [],
    onAddItem: action('onAddItem'),
    onToggleItem: action('onToggleItem'),
    onDeleteItem: action('onDeleteItem'),
    onEditItem: action('onEditItem'),
  },
};

export const FeatureRich: Story = {
  args: {
    items: sampleTodos,
    onAddItem: action('onAddItem'),
    onToggleItem: action('onToggleItem'),
    onDeleteItem: action('onDeleteItem'),
    onEditItem: action('onEditItem'),
    showPriority: true,
    showCategory: true,
    showDueDate: true,
    showAssignedTo: true,
    sortBy: 'priority',
  },
};

export const DarkTheme: Story = {
  args: {
    items: sampleTodos,
    onAddItem: action('onAddItem'),
    onToggleItem: action('onToggleItem'),
    onDeleteItem: action('onDeleteItem'),
    onEditItem: action('onEditItem'),
    theme: 'dark',
    showPriority: true,
    showCategory: true,
  },
};

export const ReadOnly: Story = {
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
  args: {
    items: sampleTodos,
    onAddItem: action('onAddItem'),
    onToggleItem: action('onToggleItem'),
    onDeleteItem: action('onDeleteItem'),
    onEditItem: action('onEditItem'),
    maxItems: 2,
    showPriority: true,
  },
};
