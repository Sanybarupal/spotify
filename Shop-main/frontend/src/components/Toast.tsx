'use client';

import React from 'react';
import { useStore } from '../context/StoreContext';
import { CloseIcon, CheckCircleIcon } from './Icons';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <div className="toast-icon">
            <CheckCircleIcon size={18} />
          </div>
          <div className="toast-message">{toast.message}</div>
          <button
            onClick={() => dismissToast(toast.id)}
            className="toast-close"
            aria-label="Dismiss notification"
          >
            <CloseIcon size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
