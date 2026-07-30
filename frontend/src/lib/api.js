import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach the stored token to every request, if we have one.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("leadforge_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// A 401 anywhere means the token is invalid/expired -- clear it and bounce to login.
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
  // Backend's /auth/login uses OAuth2PasswordRequestForm -- expects
  // application/x-www-form-urlencoded with "username" (=email) and "password".
  login: (email, password) => {
    const form = new URLSearchParams();
    form.append("username", email);
    form.append("password", password);
    return api.post("/auth/login", form, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
  },
  register: (payload) => api.post("/auth/register", payload),
  me: () => api.get("/auth/me"),
};

// Leads/Businesses endpoints don't exist on the backend yet (Phase 3).
// This module is written against the planned shape so swapping from mock
// data to real calls later is a one-line change per function -- see
// src/lib/mockData.js for what's powering the UI right now.
export const leadsApi = {
  list: (params) => api.get("/businesses", { params }),
  get: (id) => api.get(`/businesses/${id}`),
  updateStatus: (id, status) => api.patch(`/businesses/${id}`, { status }),
  addNote: (id, note) => api.post(`/businesses/${id}/notes`, { note }),
};
