const TypingIndicator = ({
  color = "bg-gray-400",
  size = "w-2 h-2",
  className = "",
}) => {
  return (
    <div className={`flex items-center space-x-1.5 ${className}`}>
      <span
        className={`${size} ${color} rounded-full animate-bounce`}
        style={{ animationDelay: "0ms" }}
      />
      <span
        className={`${size} ${color} rounded-full animate-bounce`}
        style={{ animationDelay: "150ms" }}
      />
      <span
        className={`${size} ${color} rounded-full animate-bounce`}
        style={{ animationDelay: "300ms" }}
      />
    </div>
  );
};

export default TypingIndicator;
