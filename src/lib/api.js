/**
 * src/lib/api.js
 *
 * Thin fetch wrapper around the Tuinuie Wasichana Flask API.
 *
 * - Base URL comes from VITE_API_URL (see .env.example). Falls back to
 *   http://localhost:5000/api for local development.
 * - Attaches the JWT access token to every authenticated request.
 * - On a 401 caused by an expired access token, transparently exchanges
 *   the refresh token for a new access token and retries the request once.
 * - Exposes one small helper per backend route so callers never have to
 *   remember exact paths / trailing slashes.
 */

const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/+$/, "");

const ACCESS_TOKEN_KEY = "tw_token";
const REFRESH_TOKEN_KEY = "tw_refresh_token";
const USER_KEY = "tw_user";

// ---------------------------------------------------------------------------
// Token storage helpers
// ---------------------------------------------------------------------------
export function getAccessToken() {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY) || null;
  } catch {
    return null;
  }
}

export function getRefreshToken() {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY) || null;
  } catch {
    return null;
  }
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSession({ user, accessToken, refreshToken }) {
  try {
    if (user !== undefined) localStorage.setItem(USER_KEY, JSON.stringify(user));
    if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } catch (e) {
    console.error("Failed to persist session", e);
  }
}

export function setAccessToken(token) {
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } catch (e) {
    console.error("Failed to persist access token", e);
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (e) {
    console.error("Failed to clear session", e);
  }
}

// Called by authSlice on store setup so this module can force a logout
// (clearing storage + redux state) when a refresh attempt fails.
let unauthorizedHandler = null;
export function setUnauthorizedHandler(fn) {
  unauthorizedHandler = fn;
}

// ---------------------------------------------------------------------------
// Core request helper
// ---------------------------------------------------------------------------
class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

let refreshPromise = null;

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  if (!refreshPromise) {
    refreshPromise = fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { Authorization: `Bearer ${refreshToken}` },
    })
      .then(async (res) => {
        if (!res.ok) return null;
        const data = await res.json().catch(() => null);
        if (data?.access_token) {
          setAccessToken(data.access_token);
          return data.access_token;
        }
        return null;
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

/**
 * @param {string} path        e.g. "/charities/" — appended to BASE_URL
 * @param {object} options
 * @param {string} [options.method]
 * @param {object|FormData} [options.body]
 * @param {object} [options.params]  query params, appended to the URL
 * @param {boolean} [options.auth]   attach the access token (default true)
 * @param {boolean} [options._retried] internal — prevents infinite retry loops
 */
async function request(path, { method = "GET", body, params, auth = true, _retried = false } = {}) {
  let url = `${BASE_URL}${path}`;
  if (params && Object.keys(params).length) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") qs.append(k, v);
    });
    const qsString = qs.toString();
    if (qsString) url += `?${qsString}`;
  }

  const headers = { Accept: "application/json" };
  let payload;
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }
  if (auth) {
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(url, { method, headers, body: payload });
  } catch (networkErr) {
    throw new ApiError(
      "Could not reach the server. Check your connection or that the API is running.",
      0,
      null
    );
  }

  // Transparent access-token refresh on expiry
  if (res.status === 401 && auth && !_retried && getRefreshToken()) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return request(path, { method, body, params, auth, _retried: true });
    }
    clearSession();
    if (unauthorizedHandler) unauthorizedHandler();
  }

  let data = null;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    data = await res.json().catch(() => null);
  }

  if (!res.ok) {
    const message = data?.error || data?.message || `Request failed (${res.status})`;
    if (res.status === 401 && auth && unauthorizedHandler) {
      clearSession();
      unauthorizedHandler();
    }
    throw new ApiError(message, res.status, data);
  }

  return data;
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
export const authApi = {
  register: (payload) => request("/auth/register", { method: "POST", body: payload, auth: false }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload, auth: false }),
  logout: () => request("/auth/logout", { method: "POST" }),
  me: () => request("/auth/me"),
};

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------
export const usersApi = {
  get: (id) => request(`/users/${id}`),
  update: (id, payload) => request(`/users/${id}`, { method: "PATCH", body: payload }),
  changePassword: (id, payload) => request(`/users/${id}/password`, { method: "PATCH", body: payload }),
  getReminder: (id) => request(`/users/${id}/reminder`),
  upsertReminder: (id, payload) => request(`/users/${id}/reminder`, { method: "PUT", body: payload }),
};

// ---------------------------------------------------------------------------
// Charities
// ---------------------------------------------------------------------------
export const charitiesApi = {
  list: (params) => request("/charities/", { params, auth: false }),
  get: (id) => request(`/charities/${id}`, { auth: false }),
  stats: (id) => request(`/charities/${id}/stats`, { auth: false }),
  update: (id, payload) => request(`/charities/${id}`, { method: "PATCH", body: payload }),
  apply: (payload) => request("/charities/apply", { method: "POST", body: payload }),
};

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------
export const projectsApi = {
  list: (params) => request("/projects/", { params, auth: false }),
  get: (id) => request(`/projects/${id}`, { auth: false }),
  create: (payload) => request("/projects/", { method: "POST", body: payload }),
  update: (id, payload) => request(`/projects/${id}`, { method: "PATCH", body: payload }),
  archive: (id) => request(`/projects/${id}`, { method: "DELETE" }),
};

// ---------------------------------------------------------------------------
// Donations
// ---------------------------------------------------------------------------
export const donationsApi = {
  create: (payload) => request("/donations/", { method: "POST", body: payload }),
  listMine: (params) => request("/donations/", { params }),
  get: (id) => request(`/donations/${id}`),
  listForCharity: (charityId, params) => request(`/donations/charity/${charityId}`, { params }),
  refund: (id) => request(`/donations/${id}/refund`, { method: "POST" }),
};

// ---------------------------------------------------------------------------
// Recurring plans
// ---------------------------------------------------------------------------
export const recurringPlansApi = {
  create: (payload) => request("/recurring-plans/", { method: "POST", body: payload }),
  list: (params) => request("/recurring-plans/", { params }),
  get: (id) => request(`/recurring-plans/${id}`),
  update: (id, payload) => request(`/recurring-plans/${id}`, { method: "PATCH", body: payload }),
  cancel: (id) => request(`/recurring-plans/${id}`, { method: "DELETE" }),
};

// ---------------------------------------------------------------------------
// Beneficiaries
// ---------------------------------------------------------------------------
export const beneficiariesApi = {
  list: (params) => request("/beneficiaries/", { params, auth: false }),
  get: (id) => request(`/beneficiaries/${id}`, { auth: false }),
  create: (payload) => request("/beneficiaries/", { method: "POST", body: payload }),
  update: (id, payload) => request(`/beneficiaries/${id}`, { method: "PATCH", body: payload }),
  remove: (id) => request(`/beneficiaries/${id}`, { method: "DELETE" }),
};

// ---------------------------------------------------------------------------
// Inventory
// ---------------------------------------------------------------------------
export const inventoryApi = {
  list: (params) => request("/inventory/", { params }),
  get: (id) => request(`/inventory/${id}`),
  create: (payload) => request("/inventory/", { method: "POST", body: payload }),
  update: (id, payload) => request(`/inventory/${id}`, { method: "PATCH", body: payload }),
  remove: (id) => request(`/inventory/${id}`, { method: "DELETE" }),
  distribute: (id, payload) => request(`/inventory/${id}/distribute`, { method: "POST", body: payload }),
};

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------
export const storiesApi = {
  list: (params) => request("/stories/", { params, auth: false }),
  get: (id) => request(`/stories/${id}`, { auth: false }),
  create: (payload) => request("/stories/", { method: "POST", body: payload }),
  update: (id, payload) => request(`/stories/${id}`, { method: "PATCH", body: payload }),
  remove: (id) => request(`/stories/${id}`, { method: "DELETE" }),
};

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------
export const notificationsApi = {
  list: (params) => request("/notifications/", { params }),
  markRead: (id) => request(`/notifications/${id}/read`, { method: "PATCH" }),
  markAllRead: () => request("/notifications/read-all", { method: "POST" }),
  remove: (id) => request(`/notifications/${id}`, { method: "DELETE" }),
};

// ---------------------------------------------------------------------------
// Payment methods
// ---------------------------------------------------------------------------
export const paymentMethodsApi = {
  list: () => request("/payment-methods/"),
  create: (payload) => request("/payment-methods/", { method: "POST", body: payload }),
  remove: (id) => request(`/payment-methods/${id}`, { method: "DELETE" }),
  setDefault: (id) => request(`/payment-methods/${id}/default`, { method: "PATCH" }),
};

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------
export const adminApi = {
  listApplications: (params) => request("/admin/applications", { params }),
  getApplication: (id) => request(`/admin/applications/${id}`),
  approveApplication: (id) => request(`/admin/applications/${id}/approve`, { method: "POST" }),
  rejectApplication: (id, payload) => request(`/admin/applications/${id}/reject`, { method: "POST", body: payload }),
  listUsers: (params) => request("/admin/users", { params }),
  deactivateUser: (id) => request(`/admin/users/${id}/deactivate`, { method: "PATCH" }),
  dashboard: () => request("/admin/dashboard"),
};

// ---------------------------------------------------------------------------
// M-Pesa (Safaricom Daraja)
// ---------------------------------------------------------------------------
export const mpesaApi = {
  /**
   * Initiate an STK push. Returns { checkout_request_id, message }.
   * @param {{ phone: string, amount: number, charity_id: number, project_id?: number }} payload
   */
  stkPush: (payload) => request("/mpesa/stkpush", { method: "POST", body: payload }),

  /**
   * Poll for the result of a pending STK push.
   * Returns { result_code: string, result_desc: string }.
   * result_code "0" = paid, "1032" = cancelled, "1037" = timeout.
   * @param {string} checkoutRequestId
   */
  query: (checkoutRequestId) =>
    request("/mpesa/query", {
      method: "POST",
      body: { checkout_request_id: checkoutRequestId },
    }),
};

export { ApiError };
