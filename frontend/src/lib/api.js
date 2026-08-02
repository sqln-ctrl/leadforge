import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";


export const api = axios.create({
  baseURL: API_BASE_URL,
});


// Attach token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("leadforge_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


// Handle expired token
api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("leadforge_token");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);



export const authApi = {

  // Login endpoint
  login: (email, password) => {
    const form = new URLSearchParams();

    form.append("username", email);
    form.append("password", password);

    return api.post("/auth/login", form, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  },


  // Register endpoint
  register: (payload) => {
    return api.post("/auth/register", payload);
  },


  // Current user
  me: () => api.get("/auth/me"),
};



export const leadsApi = {

  list: (params) =>
    api.get("/businesses", { params }),


  get: (id) =>
    api.get(`/businesses/${id}`),


  updateStatus: (id, status) =>
    api.patch(`/businesses/${id}`, { status }),


  addNote: (id, note) =>
    api.post(`/businesses/${id}/notes`, { note }),
};