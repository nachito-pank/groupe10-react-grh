import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: number;
    type: ToastType;
    message: string;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType, duration?: number) => void;
    removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info', duration = 4000) => {
        const id = Date.now() + Math.floor(Math.random() * 1000);
        const t: Toast = { id, type, message };
        setToasts((prev) => [t, ...prev]);
        setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), duration);
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast, removeToast }}>
            {children}

            {/* Toast container */}
            <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end space-y-2">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        role="status"
                        className={`max-w-sm w-full rounded-lg shadow-lg border p-3 flex items-start space-x-3 transition transform hover:scale-[1.01] ${t.type === 'success'
                                ? 'bg-green-50 border-green-200 text-green-800'
                                : t.type === 'error'
                                    ? 'bg-red-50 border-red-200 text-red-800'
                                    : t.type === 'warning'
                                        ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                                        : 'bg-slate-50 border-slate-200 text-slate-800'
                            }`}
                    >
                        <div className="flex-1 text-sm break-words">{t.message}</div>
                        <button
                            onClick={() => removeToast(t.id)}
                            className="text-xs text-gray-500 hover:text-gray-700 ml-2"
                        >
                            Fermer
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
}
