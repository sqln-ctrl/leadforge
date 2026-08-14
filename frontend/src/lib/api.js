import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("leadforge_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired/invalid token
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

// =========================
// AUTH API
// =========================

export const authApi = {
  // Login
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

  // Register
  register: (payload) => {
    return api.post("/auth/register", payload);
  },

  // Current logged-in user
  me: () => {
    return api.get("/auth/me");
  },
};

// =========================
// BUSINESS / LEADS API
// =========================

export const leadsApi = {
  // Get all businesses
  list: (params) => {
    return api.get("/businesses/", { params });
  },

  // Get one business
  get: (id) => {
    return api.get(`/businesses/${id}`);
  },

  updateStatus: (id, status) => {
    return api.patch(`/businesses/${id}`, { status });
  },

  addNote: (id, text) => {
    return api.post(`/businesses/${id}/notes`, {
      text,
    });
  },

  delete: (id) => {
    return api.delete(`/businesses/${id}`);
  },
};


// =========================
// QUALIFIED LEADS API
// =========================

export const qualifiedLeadsApi = {

  // ONLY records from qualified_leads
  list: () => {
    return api.get("/qualified-leads/");
  },

  // Get one QualifiedLead
  get: (id) => {
    return api.get(`/qualified-leads/${id}`);
  },

  // Delete qualified lead
  delete: (id) => {
    return api.delete(`/qualified-leads/${id}`);
  },
};


// =========================
// AI API
// =========================

export const aiApi = {
  analyze: (qualifiedLeadId) => {
    return api.post(
      `/ai/analyze/${qualifiedLeadId}`
    );
  },
};