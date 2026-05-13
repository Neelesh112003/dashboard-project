import axios from "axios";

const api = axios.create({
  baseURL: "https://tektronics.businesssamadhan.in/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {

    // Get token from storage
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    // Attach token
    if (token) {
      const token_ID = token.split("|")[1];

      console.log(token_ID);

      config.headers.Authorization = `Bearer ${token_ID}`;
    }

    console.log("TOKEN SENT:", token);

    return config;
  },
  (error) => Promise.reject(error),
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;

    const message =
      error.response?.data?.message?.toLowerCase() || "";

    console.log("API ERROR:", error.response);

    // ONLY logout for actual auth errors
    if (
      status === 401 ||
      message.includes("unauthenticated") ||
      message.includes("invalid token") ||
      message.includes("token expired")
    ) {

      localStorage.removeItem("token");
      sessionStorage.removeItem("token");

      localStorage.removeItem("user");
      sessionStorage.removeItem("user");

      // Avoid redirect loop
      if (!window.location.pathname.includes("/login")) {

        alert("Session expired. Please login again.");

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;