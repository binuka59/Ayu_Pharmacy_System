import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {

      // token remove
      localStorage.removeItem("token");

      // redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;