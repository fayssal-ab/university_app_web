const Card = ({ title, children, className = '', actions }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${className}`}>
      {title && (
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {actions && <div className="flex space-x-2">{actions}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};

export default Card;