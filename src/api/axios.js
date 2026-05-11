import axios from "axios";
 
const api = axios.create({
  baseURL: "https://tektronics.businesssamadhan.in/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
 
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");
 
    if (token) {
     const token_ID = token.split("|")[1]
     console.log(token_ID)
      config.headers.Authorization = `Bearer ${token_ID}`;
    }
 
    return config;
  },
  (error) => Promise.reject(error)
);
 
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
 
      // Avoid redirect loop if we're already on /login
      if (!window.location.pathname.includes("/login")) {
        alert("Session expired. Please login again.");
        window.location.href = "/login";
      }
    }
 
    return Promise.reject(error);
  }
);
 
export default api;