const Card = ({ children, className = '', hover = true }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 ${hover ? 'card-hover' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default Card;

