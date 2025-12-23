import axios from "axios";

//const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const API = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 10000,
});

API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.detail ||
      err.message ||
      "Unknown API error";
    return Promise.reject({ ...err, message: msg });
  }
);

/* ================= AUTH ================= */
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getProfile = () => API.get("/auth/profile");

/* ================= SKILLS ================= */
export const addSkill = (data) => API.post("/skills", data);
export const getSkills = () => API.get("/skills");
export const updateSkill = (id, data) => API.put(`/skills/${id}`, data);
export const deleteSkill = (id) => API.delete(`/skills/${id}`);

/* ================= TRADE ================= */
export const sendTradeRequest = (data) => API.post("/trade/request", data);
export const getTradeRequests = () => API.get("/trade/requests");
export const acceptTradeRequest = (id) =>
  API.put(`/trade/requests/${id}/accept`);
export const rejectTradeRequest = (id) =>
  API.put(`/trade/requests/${id}/reject`);

/* ================= CHAT ================= */
export const getChatHistory = (requestId) =>
  API.get(`/chat/${requestId}`);
export const sendChatMessage = (data) =>
  API.post("/chat/send", data);

export const getMarketplaceSkills = () =>
  API.get("/skills/marketplace");


export default API;
