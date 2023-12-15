import React from 'react';

const MessageBox = ({ variant = 'info', children }) => {
  const backgroundColor = (() => {
    switch (variant) {
      case 'danger':
        return 'bg-red-50 dark:bg-gray-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-gray-800';
      case 'success':
        return 'bg-green-50 dark:bg-gray-800';
      default:
        return 'bg-blue-50 dark:bg-gray-800';
    }
  })();

  const textColor = (() => {
    switch (variant) {
      case 'danger':
      case 'warning':
        return 'text-red-800 dark:text-red-400';
      case 'success':
        return 'text-green-800 dark:text-green-400';
      default:
        return 'text-blue-800 dark:text-blue-400';
    }
  })();

  return (
    <div className={`p-4 mb-4 text-sm ${textColor} rounded-lg ${backgroundColor}`} role="alert">
      {children}
    </div>
  );
};

export default MessageBox;