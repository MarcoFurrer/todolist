import React, { useState, useMemo } from 'react';
import clsx from 'clsx';
import { TodoItem, TodoListProps } from './types';
import { CartEditor, CartItem } from 'react-cart-editor';

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
  // State - keeping it simple and focused
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'createdAt' | 'priority' | 'dueDate' | 'text'>(sortBy);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(sortOrder);
  
  // Cart Editor state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState<TodoItem | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Pure utility functions - beautiful in their simplicity
  const formatDate = (date: Date) => date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const getPriorityVariant = (priority?: string): string => {
    const variants = { high: 'danger', medium: 'warning', low: 'success' };
    return variants[priority as keyof typeof variants] || 'secondary';
  };

  const isOverdue = (dueDate?: Date): boolean => !!dueDate && dueDate < new Date();

  // Convert TodoItem to CartItem for the editor
  const todoToCartItem = (todo: TodoItem): CartItem => ({
    id: todo.id,
    title: todo.text,
    description: `Created: ${formatDate(todo.createdAt)}${todo.updatedAt !== todo.createdAt ? ` | Updated: ${formatDate(todo.updatedAt)}` : ''}`,
    complete: todo.completed,
    assignedTo: todo.assignedTo || 'Unassigned',
    dueDate: todo.dueDate ? todo.dueDate.toISOString().split('T')[0] : undefined,
    comments: []
  });

  // Convert CartItem back to TodoItem updates
  const cartItemToTodoUpdate = (cartItem: CartItem, originalTodo: TodoItem) => ({
    ...originalTodo,
    text: cartItem.title,
    completed: cartItem.complete,
    assignedTo: cartItem.assignedTo === 'Unassigned' ? undefined : cartItem.assignedTo,
    dueDate: cartItem.dueDate ? new Date(cartItem.dueDate) : undefined,
    updatedAt: new Date()
  });

  // Event handlers - clean and purposeful
  const toggleTodo = (id: string) => onToggleItem?.(id);

  // Cart Editor handlers
  const openEditor = (item: TodoItem) => {
    setCurrentEditItem(item);
    setIsCreatingNew(false);
    setIsEditorOpen(true);
  };

  const openNewTodoEditor = () => {
    setCurrentEditItem(null);
    setIsCreatingNew(true);
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setCurrentEditItem(null);
    setIsCreatingNew(false);
  };

  const saveFromEditor = (cartItem: CartItem) => {
    if (isCreatingNew && onAddItem) {
      // Creating a new todo
      onAddItem(cartItem.title);
    } else if (currentEditItem && onEditItem) {
      // Editing existing todo
      const updatedTodo = cartItemToTodoUpdate(cartItem, currentEditItem);
      onEditItem(updatedTodo.id, updatedTodo.text);
    }
    closeEditor();
  };

  // Create a new CartItem for new todo creation
  const createNewCartItem = (): CartItem => ({
    id: Date.now().toString(),
    title: '',
    description: 'New task',
    complete: false,
    assignedTo: 'Unassigned',
    dueDate: undefined,
    comments: []
  });

  const handleSort = (field: string) => {
    const validField = field as 'createdAt' | 'priority' | 'dueDate' | 'text';
    if (sortField === validField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(validField);
      setSortDirection('asc');
    }
  };

  // Smart filtering and sorting - elegant logic
  const processedItems = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    
    // Filter chain - readable and efficient
    let filtered = items
      .filter(item => showCompleted || !item.completed)
      .filter(item => !searchTerm || 
        item.text.toLowerCase().includes(searchLower) ||
        item.category?.toLowerCase().includes(searchLower) ||
        item.assignedTo?.toLowerCase().includes(searchLower)
      );

    // Smart sorting - handles all types elegantly
    const getSortValue = (item: TodoItem, field: string) => {
      switch (field) {
        case 'text': return item.text.toLowerCase();
        case 'priority': return { high: 3, medium: 2, low: 1 }[item.priority as 'high' | 'medium' | 'low'] || 0;
        case 'dueDate': return item.dueDate?.getTime() || 0;
        case 'createdAt': 
        default: return item.createdAt.getTime();
      }
    };

    filtered.sort((a, b) => {
      const aVal = getSortValue(a, sortField);
      const bVal = getSortValue(b, sortField);
      const comparison = typeof aVal === 'string' 
        ? aVal.localeCompare(bVal as string)
        : (aVal as number) - (bVal as number);
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return maxItems ? filtered.slice(0, maxItems) : filtered;
  }, [items, searchTerm, showCompleted, sortField, sortDirection, maxItems]);

  // Elegant sortable header component
  const SortableHeader = ({ children, field }: { children: React.ReactNode; field: string }) => {
    const isActive = sortField === field;
    const icon = isActive ? (sortDirection === 'asc' ? '↑' : '↓') : '↕';
    
    return (
      <th className="user-select-none" style={{ cursor: 'pointer' }} onClick={() => handleSort(field)}>
        <div className="d-flex justify-content-between align-items-center">
          <span>{children}</span>
          <span className="text-muted ms-1">{icon}</span>
        </div>
      </th>
    );
  };

  // Clean derived state
  const stats = {
    total: items.length,
    completed: items.filter(item => item.completed).length,
    get remaining() { return this.total - this.completed; }
  };

  const columns = [
    { show: true, key: 'status', label: 'Status', width: '60px' },
    { show: true, key: 'text', label: 'Task', sortable: true },
    { show: showPriority, key: 'priority', label: 'Priority', sortable: true },
    { show: showCategory, key: 'category', label: 'Category' },
    { show: showDueDate, key: 'dueDate', label: 'Due Date', sortable: true },
    { show: showAssignedTo, key: 'assignedTo', label: 'Assigned To', sortable: true },
    { show: true, key: 'createdAt', label: 'Created', sortable: true }
  ].filter(col => col.show);

  const totalColumns = columns.length;

  return (
    <div className={clsx('todolist', `todolist--${theme}`, className)}>
      <div className="container-fluid">
        <div className="card shadow-sm">
          <div className="card-body">
            {/* Header with clean layout */}
            <div className="row align-items-center mb-3">
              <div className="col-md-6">
                <div className="d-flex align-items-center">
                  <span className="badge bg-primary me-2">{processedItems.length}</span>
                  <small className="text-muted">
                    {stats.completed} of {stats.total} completed
                  </small>
                </div>
              </div>
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fas fa-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Add new todo button */}
            {onAddItem && (
              <div className="mb-3">
                <button
                  className="btn btn-primary"
                  onClick={openNewTodoEditor}
                  type="button"
                >
                  <i className="fas fa-plus me-2"></i>
                  Add New Todo
                </button>
              </div>
            )}

            {/* Dynamic table with smart column rendering */}
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    {columns.map(({ key, label, sortable, width }) => (
                      sortable ? (
                        <SortableHeader key={key} field={key}>
                          {label}
                        </SortableHeader>
                      ) : (
                        <th key={key} style={width ? { width } : undefined}>
                          {label}
                        </th>
                      )
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {processedItems.length === 0 ? (
                    <tr>
                      <td colSpan={totalColumns} className="text-center py-4">
                        <div className="text-muted">
                          <i className="fas fa-tasks fa-2x mb-3 d-block"></i>
                          {searchTerm ? 'No tasks found matching your search' : 'No tasks yet. Add one above!'}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    processedItems.map((item) => (
                      <TodoRow 
                        key={item.id}
                        item={item}
                        onToggle={toggleTodo}
                        onOpenEditor={openEditor}
                        formatDate={formatDate}
                        getPriorityVariant={getPriorityVariant}
                        isOverdue={isOverdue}
                        showPriority={showPriority}
                        showCategory={showCategory}
                        showDueDate={showDueDate}
                        showAssignedTo={showAssignedTo}
                        allowEdit={allowEdit}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Smart footer with stats */}
            {processedItems.length > 0 && (
              <div className="mt-3 pt-3 border-top">
                <div className="row text-center">
                  <div className="col-md-4">
                    <div className="text-muted">
                      <i className="fas fa-list me-1"></i>
                      <strong>{processedItems.length}</strong> task{processedItems.length !== 1 ? 's' : ''} shown
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-success">
                      <i className="fas fa-check-circle me-1"></i>
                      <strong>{stats.completed}</strong> completed
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-primary">
                      <i className="fas fa-clock me-1"></i>
                      <strong>{stats.remaining}</strong> remaining
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cart Editor Modal */}
        {isEditorOpen && (
          <CartEditor
            item={isCreatingNew ? createNewCartItem() : todoToCartItem(currentEditItem!)}
            isOpen={isEditorOpen}
            onSave={saveFromEditor}
            onClose={closeEditor}
          />
        )}
      </div>
    </div>
  );
};

// Separate TodoRow component for better organization and readability
interface TodoRowProps {
  item: TodoItem;
  onToggle: (id: string) => void;
  onOpenEditor: (item: TodoItem) => void;
  formatDate: (date: Date) => string;
  getPriorityVariant: (priority?: string) => string;
  isOverdue: (dueDate?: Date) => boolean;
  showPriority: boolean;
  showCategory: boolean;
  showDueDate: boolean;
  showAssignedTo: boolean;
  allowEdit: boolean;
}

const TodoRow: React.FC<TodoRowProps> = ({
  item,
  onToggle,
  onOpenEditor,
  formatDate,
  getPriorityVariant,
  isOverdue,
  showPriority,
  showCategory,
  showDueDate,
  showAssignedTo,
  allowEdit
}) => {
  const rowClass = clsx({
    'table-success': item.completed
  });

  return (
    <tr className={rowClass}>
      {/* Status Button */}
      <td>
        <button
          className={clsx('btn btn-sm rounded-circle', {
            'btn-success': item.completed,
            'btn-outline-secondary': !item.completed
          })}
          onClick={() => onToggle(item.id)}
          title={item.completed ? 'Mark as incomplete' : 'Mark as complete'}
          style={{ width: '32px', height: '32px' }}
        >
          <i className={`fas fa-${item.completed ? 'check' : 'circle'}`}></i>
        </button>
      </td>

      {/* Task Text */}
      <td>
        <span 
          className={clsx('d-inline-block', { 
            'text-decoration-line-through text-muted': item.completed,
            'cursor-pointer': allowEdit
          })}
          onClick={allowEdit ? () => onOpenEditor(item) : undefined}
          title={allowEdit ? "Click to edit in detailed editor" : undefined}
          style={allowEdit ? { cursor: 'pointer' } : undefined}
        >
          {item.text}
        </span>
      </td>

      {/* Priority */}
      {showPriority && (
        <td>
          {item.priority && (
            <span className={`badge bg-${getPriorityVariant(item.priority)}`}>
              <i className="fas fa-exclamation-triangle me-1"></i>
              {item.priority}
            </span>
          )}
        </td>
      )}

      {/* Category */}
      {showCategory && (
        <td>
          {item.category && (
            <span className="badge bg-info">
              <i className="fas fa-tag me-1"></i>
              {item.category}
            </span>
          )}
        </td>
      )}

      {/* Due Date */}
      {showDueDate && (
        <td>
          {item.dueDate ? (
            <span className={clsx('small', {
              'text-muted': item.completed
            })}>
              <i className="fas fa-calendar me-1"></i>
              {formatDate(item.dueDate)}
            </span>
          ) : (
            <span className="text-muted">-</span>
          )}
        </td>
      )}

      {/* Assigned To */}
      {showAssignedTo && (
        <td>
          {item.assignedTo ? (
            <span className="small">
              <i className="fas fa-user me-1"></i>
              {item.assignedTo}
            </span>
          ) : (
            <span className="text-muted">-</span>
          )}
        </td>
      )}

      {/* Created Date */}
      <td>
        <span className="small text-muted">
          <i className="fas fa-clock me-1"></i>
          {formatDate(item.createdAt)}
        </span>
      </td>
    </tr>
  );
};

export default TodoList;
