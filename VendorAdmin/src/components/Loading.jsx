import React, { useState } from "react";

const LoadingUI = (WrappedComponent) => {
  return function WithLoadingComponent(props) {
    const [loading, setLoading] = useState(false);

    const startLoading = () => setLoading(true);
    const stopLoading = () => setLoading(false);

    return (
      <>
        {loading && (
          <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
            role="alert"
            aria-busy="true"
          >
            <div className="relative flex items-center justify-center w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-ping" />
            </div>
            <p className="mt-4 text-white text-lg animate-fade-in">
              Please wait...
            </p>
          </div>
        )}
        <WrappedComponent
          {...props}
          startLoading={startLoading}
          stopLoading={stopLoading}
        />
      </>
    );
  };
};

export default LoadingUI;
