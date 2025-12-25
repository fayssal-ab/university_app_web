// Card.jsx
const Card = ({ title, children, className = '', actions }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${className}`}>
      {title && (
        <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h3>
          {actions && <div className="flex space-x-2">{actions}</div>}
        </div>
      )}
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
};

export default Card;