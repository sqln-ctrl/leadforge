import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// ==================================================
// JWT TOKEN
// ==================================================

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

// ==================================================
// HANDLE AUTH ERRORS
// ==================================================

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

// ==================================================
// AUTH API
// ==================================================

export const authApi = {
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

  register: (payload) => {
    return api.post("/auth/register", payload);
  },

  me: () => {
    return api.get("/auth/me");
  },
};

// ==================================================
// BUSINESS API
// ==================================================

export const leadsApi = {
  // Get businesses
  list: (params) => {
    return api.get("/businesses/", {
      params,
    });
  },

  // Get one business
  get: (id) => {
    return api.get(`/businesses/${id}`);
  },

  // Update business status
  updateStatus: (id, status) => {
    return api.patch(`/businesses/${id}`, {
      status,
    });
  },

  // Add note to business
  addNote: (id, text) => {
    return api.post(`/businesses/${id}/notes`, {
      text,
    });
  },

  // Delete business
  delete: (id) => {
    return api.delete(`/businesses/${id}`);
  },
};

// ==================================================
// DISCOVERY API
// ==================================================

export const discoveryApi = {
  // Search businesses using Geoapify
  search: (data) => {
    return api.post("/discovery/search", data);
  },
};

// ==================================================
// QUALIFIED LEADS API
// ==================================================

export const qualifiedLeadsApi = {
  // Get ONLY qualified leads
  list: () => {
    return api.get("/qualified-leads/");
  },

  // Get one qualified lead
  get: (id) => {
    return api.get(`/qualified-leads/${id}`);
  },

  // Delete qualified lead
  delete: (id) => {
    return api.delete(`/qualified-leads/${id}`);
  },
};

// ==================================================
// AI API
// ==================================================

export const aiApi = {
  // Gemini analyzes ONLY a QualifiedLead
  analyze: (qualifiedLeadId) => {
    return api.post(`/ai/analyze/${qualifiedLeadId}`);
  },
};

// ==================================================
// PROPOSAL API
// ==================================================

export const proposalApi = {
  generate: (qualifiedLeadId) => {
    return api.post(
      `/proposals/generate/${qualifiedLeadId}`
    );
  },
};