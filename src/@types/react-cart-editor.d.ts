declare module 'react-cart-editor' {
  export interface CartItem {
    id: string;
    title: string;
    description: string;
    complete: boolean;
    assignedTo: string;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string;
    tags?: string[];
    comments?: Comment[];
  }

  export interface Comment {
    id: string;
    author: string;
    content: string;
    timestamp: string;
    avatar?: string;
  }

  export interface CartEditorProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (item: CartItem) => void;
    item?: CartItem;
    title?: string;
    showComments?: boolean;
    onAddComment?: (itemId: string, content: string) => void;
    currentUser?: string;
    commentsLoading?: boolean;
  }

  export const CartEditor: React.FC<CartEditorProps>;
}

declare module 'react-cart-editor/dist/style.css';
