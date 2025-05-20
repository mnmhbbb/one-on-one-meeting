const LoadingUI = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center rounded-md bg-black/40">
      <div className="flex space-x-2">
        <div className="h-3 w-3 animate-bounce rounded-full bg-white [animation-delay:-0.3s]" />
        <div className="h-3 w-3 animate-bounce rounded-full bg-white [animation-delay:-0.15s]" />
        <div className="h-3 w-3 animate-bounce rounded-full bg-white" />
      </div>
    </div>
  );
};

export default LoadingUI;
