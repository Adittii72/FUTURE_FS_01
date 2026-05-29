const Card = ({ children, className = '', hover = true }) => {
  return (
    <div className={`glass-card p-6 ${hover ? 'card-hover' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
