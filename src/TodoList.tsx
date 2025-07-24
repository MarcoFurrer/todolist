import React, { useState, useMemo } from 'react';
import clsx from 'clsx';
import { TodoItem, TodoListProps } from './types';

const TodoList: React.FC<TodoListProps> = ({
  items = [],
  onAddItem,
  onToggleItem,
  onDeleteItem,
  onEditItem,
  showCompleted = true,
  allowEdit = true,
  allowDelete = true,
  showPriority = false,
  showCategory = false,
  showDueDate = false,
  showAssignedTo = false,
  placeholder = 'Add a new todo...',
  className,
  theme = 'light',
  maxItems,
  sortBy = 'createdAt',
  sortOrder = 'desc'
}) => {
  const [newItemText, setNewItemText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Sort and filter items
  const processedItems = useMemo(() => {
    let filtered = items;

    // Apply filter
    if (filter === 'active') {
      filtered = items.filter(item => !item.completed);
    } else if (filter === 'completed') {
      filtered = items.filter(item => item.completed);
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'text':
          comparison = a.text.localeCompare(b.text);
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          const aPriority = priorityOrder[a.priority || 'low'];
          const bPriority = priorityOrder[b.priority || 'low'];
          comparison = bPriority - aPriority;
          break;
        case 'dueDate':
          if (a.dueDate && b.dueDate) {
            comparison = a.dueDate.getTime() - b.dueDate.getTime();
          } else if (a.dueDate) {
            comparison = -1;
          } else if (b.dueDate) {
            comparison = 1;
          }
          break;
        case 'createdAt':
        default:
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    // Apply max items limit
    if (maxItems && filtered.length > maxItems) {
      filtered = filtered.slice(0, maxItems);
    }

    return filtered;
  }, [items, filter, sortBy, sortOrder, maxItems]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemText.trim() && onAddItem) {
      onAddItem(newItemText.trim());
      setNewItemText('');
    }
  };

  const handleEdit = (item: TodoItem) => {
    setEditingId(item.id);
    setEditText(item.text);
  };

  const handleSaveEdit = () => {
    if (editingId && editText.trim() && onEditItem) {
      onEditItem(editingId, editText.trim());
      setEditingId(null);
      setEditText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const isOverdue = (dueDate?: Date) => {
    return dueDate && dueDate < new Date();
  };

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;

  return (
    <div className={clsx('todolist', `todolist--${theme}`, className)}>
      {/* Header */}
      <div className="todolist__header">
        <h2 className="todolist__title">Todo List</h2>
        <div className="todolist__stats">
          <span className="todolist__stat">
            {completedCount} of {totalCount} completed
          </span>
        </div>
      </div>

      {/* Add new item form */}
      {onAddItem && (
        <form onSubmit={handleSubmit} className="todolist__form">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder={placeholder}
            className="todolist__input"
          />
          <button 
            type="submit" 
            className="todolist__add-btn"
            disabled={!newItemText.trim()}
          >
            Add
          </button>
        </form>
      )}

      {/* Filter buttons */}
      <div className="todolist__filters">
        <button
          className={clsx('todolist__filter-btn', { 'active': filter === 'all' })}
          onClick={() => setFilter('all')}
        >
          All ({totalCount})
        </button>
        <button
          className={clsx('todolist__filter-btn', { 'active': filter === 'active' })}
          onClick={() => setFilter('active')}
        >
          Active ({totalCount - completedCount})
        </button>
        <button
          className={clsx('todolist__filter-btn', { 'active': filter === 'completed' })}
          onClick={() => setFilter('completed')}
        >
          Completed ({completedCount})
        </button>
      </div>

      {/* Todo items */}
      <div className="todolist__items">
        {processedItems.length === 0 ? (
          <div className="todolist__empty">
            {filter === 'all' ? 'No todos yet' : `No ${filter} todos`}
          </div>
        ) : (
          processedItems.map((item) => (
            <div
              key={item.id}
              className={clsx('todolist__item', {
                'todolist__item--completed': item.completed,
                'todolist__item--editing': editingId === item.id,
                'todolist__item--overdue': isOverdue(item.dueDate) && !item.completed
              })}
            >
              <div className="todolist__item-main">
                {/* Checkbox */}
                <button
                  className="todolist__checkbox"
                  onClick={() => onToggleItem?.(item.id)}
                  aria-label={item.completed ? 'Mark as incomplete' : 'Mark as complete'}
                >
                  {item.completed && <span className="todolist__checkmark">✓</span>}
                </button>

                {/* Text content */}
                <div className="todolist__content">
                  {editingId === item.id ? (
                    <div className="todolist__edit-form">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="todolist__edit-input"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit();
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                        autoFocus
                      />
                      <div className="todolist__edit-buttons">
                        <button
                          type="button"
                          onClick={handleSaveEdit}
                          className="todolist__edit-btn todolist__edit-btn--save"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="todolist__edit-btn todolist__edit-btn--cancel"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span className="todolist__text">{item.text}</span>
                      
                      {/* Meta information */}
                      <div className="todolist__meta">
                        {showPriority && item.priority && (
                          <span className={clsx('todolist__priority', getPriorityColor(item.priority))}>
                            {item.priority}
                          </span>
                        )}
                        
                        {showCategory && item.category && (
                          <span className="todolist__category">{item.category}</span>
                        )}
                        
                        {showAssignedTo && item.assignedTo && (
                          <span className="todolist__assigned">@{item.assignedTo}</span>
                        )}
                        
                        {showDueDate && item.dueDate && (
                          <span className={clsx('todolist__due-date', {
                            'todolist__due-date--overdue': isOverdue(item.dueDate) && !item.completed
                          })}>
                            Due: {formatDate(item.dueDate)}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Action buttons */}
                {editingId !== item.id && (
                  <div className="todolist__actions">
                    {allowEdit && onEditItem && (
                      <button
                        onClick={() => handleEdit(item)}
                        className="todolist__action-btn todolist__action-btn--edit"
                        aria-label="Edit todo"
                      >
                        ✎
                      </button>
                    )}
                    
                    {allowDelete && onDeleteItem && (
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="todolist__action-btn todolist__action-btn--delete"
                        aria-label="Delete todo"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer with additional info */}
      {maxItems && items.length > maxItems && (
        <div className="todolist__footer">
          Showing {maxItems} of {items.length} items
        </div>
      )}
    </div>
  );
};

export default TodoList;
