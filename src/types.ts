export interface TodoItem {
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

export interface TodoListProps {
  items?: TodoItem[];
  onAddItem?: (text: string) => void;
  onToggleItem?: (id: string) => void;
  onDeleteItem?: (id: string) => void;
  onEditItem?: (id: string, text: string) => void;
  showCompleted?: boolean;
  allowEdit?: boolean;
  allowDelete?: boolean;
  showPriority?: boolean;
  showCategory?: boolean;
  showDueDate?: boolean;
  showAssignedTo?: boolean;
  placeholder?: string;
  className?: string;
  theme?: 'light' | 'dark';
  maxItems?: number;
  sortBy?: 'createdAt' | 'priority' | 'dueDate' | 'text';
  sortOrder?: 'asc' | 'desc';
}
