import React from "react";

const AlertMessage = ({ type, message, onClose }) => {
  if (!message) return null;

  const bgColor = type === 'error' ? 'bg-red-100' : 'bg-green-100';
  const borderColor = type === 'error' ? 'border-red-400' : 'border-green-400';
  const textColor = type === 'error' ? 'text-red-700' : 'text-green-700';

  return (
    <div className={`mb-4 p-3 ${bgColor} border ${borderColor} ${textColor} rounded relative`}>
      {message}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default AlertMessage;
