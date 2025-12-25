import { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay with blur */}
        <div
          className="fixed inset-0 transition-opacity bg-slate-900/60 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div
          className={`inline-block w-full ${sizeClasses[size]} my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all"
            >
              <FaTimes size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;