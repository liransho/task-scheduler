import { useState, useCallback } from 'react';

export type AlertType = 'success' | 'error';

export interface Alert {
  type: AlertType;
  message: string;
}

export function useAlert(autoHideMs = 3000) {
  const [alert, setAlert] = useState<Alert | null>(null);

  const showAlert = useCallback((type: AlertType, message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), autoHideMs);
  }, [autoHideMs]);

  const showSuccess = useCallback((message: string) => {
    showAlert('success', message);
  }, [showAlert]);

  const showError = useCallback((message: string) => {
    showAlert('error', message);
  }, [showAlert]);

  const clearAlert = useCallback(() => {
    setAlert(null);
  }, []);

  return { alert, showAlert, showSuccess, showError, clearAlert };
}
