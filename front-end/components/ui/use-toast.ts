import * as React from "react";

// Define types
export interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  open: boolean;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id" | "open">) => string;
  removeToast: (id: string) => void;
  updateToast: (id: string, toast: Partial<Toast>) => void;
}

// Create context
const ToastContext = React.createContext<ToastContextType | undefined>(
  undefined
);

// Provider component
export function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((toast: Omit<Toast, "id" | "open">) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((toasts) => [...toasts, { ...toast, id, open: true }]);
    return id;
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
  }, []);

  const updateToast = React.useCallback((id: string, toast: Partial<Toast>) => {
    setToasts((toasts) =>
      toasts.map((t) => (t.id === id ? { ...t, ...toast } : t))
    );
  }, []);

  return React.createElement(ToastContext.Provider, {
    value: { toasts, addToast, removeToast, updateToast },
    children,
  });
}

// Hook
export function useToast() {
  const context = React.useContext(ToastContext);
  const toast = React.useCallback(
    ({
      title,
      description,
      action,
    }: {
      title?: string;
      description?: string;
      action?: React.ReactNode;
    }) => {
      if (!context) {
        console.log("Toast:", { title, description });
        return;
      }
      const id = context.addToast({ title, description, action });
      setTimeout(() => {
        context.removeToast(id);
      }, 5000);
    },
    [context]
  );

  return { toast };
}
