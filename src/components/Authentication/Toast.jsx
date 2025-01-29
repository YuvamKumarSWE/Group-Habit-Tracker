const Toast = ({ message, type, isVisible }) => {
  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded shadow-lg transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      } ${
        type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      }`}
    >
      {message}
    </div>
  );
};

export default Toast;