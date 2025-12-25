const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-600 blur-xl opacity-50 animate-pulse"></div>
        <div className="relative w-16 h-16 border-4 border-transparent border-t-blue-600 border-r-purple-600 rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default Loader;