import React, { useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { applyTheme } from '../theme';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useAppStore((state) => state.theme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-200">
      {children}
    </div>
  );
};