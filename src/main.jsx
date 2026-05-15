
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { ToastProvider } from "./context/ToastContext";

const theme = localStorage.getItem("theme");
if (theme === "dark") {
  document.documentElement.classList.add("dark");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  
  <ToastProvider>
      <BrowserRouter>
      <App />
    </BrowserRouter>
  </ToastProvider>
  
);