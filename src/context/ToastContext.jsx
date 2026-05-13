import { createContext, useContext, useState } from "react";

/* =====================================
   CREATE CONTEXT
===================================== */

const ToastContext = createContext();

/* =====================================
   CUSTOM HOOK
===================================== */

export const useToast = () => {
  return useContext(ToastContext);
};

/* =====================================
   PROVIDER
===================================== */

export const ToastProvider = ({ children }) => {
  // store all toasts
  const [toasts, setToasts] = useState([]);

  /* =====================================
     SHOW TOAST FUNCTION
  ===================================== */

  const showToast = (message, type = "success") => {
    // unique id
    const id = Date.now();

    // new toast object
    const newToast = {
      id,
      message,
      type,
    };

    // add toast to array
    setToasts((prev) => [...prev, newToast]);

    // remove toast after 3 seconds
    setTimeout(() => {
      setToasts((prev) =>
        prev.filter((toast) => toast.id !== id)
      );
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* TOAST CONTAINER */}
      <div className="fixed top-5 right-5 flex flex-col gap-3 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              px-5
              py-3
              rounded-lg
              text-white
              shadow-lg
              w-fit
              max-w-[300px]
              animate-toast

              ${
                toast.type === "success"
                  ? "bg-green-600"
                  : "bg-red-600"
              }
            `}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};