import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoList from './TodoList';
import { TodoItem } from './types';

const mockTodos: TodoItem[] = [
  {
    id: '1',
    text: 'Test todo 1',
    completed: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    text: 'Test todo 2',
    completed: true,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
];

describe('TodoList', () => {
  it('renders without crashing', () => {
    render(<TodoList />);
    expect(screen.getByText('Todo List')).toBeInTheDocument();
  });

  it('displays todo items', () => {
    render(<TodoList items={mockTodos} />);
    expect(screen.getByText('Test todo 1')).toBeInTheDocument();
    expect(screen.getByText('Test todo 2')).toBeInTheDocument();
  });

  it('shows correct counts', () => {
    render(<TodoList items={mockTodos} />);
    expect(screen.getByText('1 of 2 completed')).toBeInTheDocument();
  });

  it('calls onAddItem when form is submitted', () => {
    const mockOnAddItem = jest.fn();
    render(<TodoList onAddItem={mockOnAddItem} />);
    
    const input = screen.getByPlaceholderText('Add a new todo...');
    const button = screen.getByText('Add');
    
    fireEvent.change(input, { target: { value: 'New todo' } });
    fireEvent.click(button);
    
    expect(mockOnAddItem).toHaveBeenCalledWith('New todo');
  });

  it('calls onToggleItem when checkbox is clicked', () => {
    const mockOnToggleItem = jest.fn();
    render(<TodoList items={mockTodos} onToggleItem={mockOnToggleItem} />);
    
    const checkboxes = screen.getAllByRole('button', { name: /mark as/i });
    fireEvent.click(checkboxes[0]);
    
    expect(mockOnToggleItem).toHaveBeenCalledWith('1');
  });

  it('filters todos correctly', () => {
    render(<TodoList items={mockTodos} />);
    
    // Click on "Active" filter
    fireEvent.click(screen.getByText('Active (1)'));
    expect(screen.getByText('Test todo 1')).toBeInTheDocument();
    expect(screen.queryByText('Test todo 2')).not.toBeInTheDocument();
    
    // Click on "Completed" filter
    fireEvent.click(screen.getByText('Completed (1)'));
    expect(screen.queryByText('Test todo 1')).not.toBeInTheDocument();
    expect(screen.getByText('Test todo 2')).toBeInTheDocument();
  });

  it('shows empty state when no todos', () => {
    render(<TodoList items={[]} />);
    expect(screen.getByText('No todos yet')).toBeInTheDocument();
  });

  it('respects maxItems prop', () => {
    render(<TodoList items={mockTodos} maxItems={1} />);
    expect(screen.getByText('Showing 1 of 2 items')).toBeInTheDocument();
  });
});
