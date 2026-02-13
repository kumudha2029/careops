const BASE_URL = "https://careops-ixxy.onrender.com";

console.log("BASE_URL:", BASE_URL);


/* ========================================= */
/* ================= AUTH ================== */
/* ========================================= */

export const signup = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Signup failed");
  }

  return await res.json();
};

export const login = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Login failed");
  }

  return await res.json();
};

/* ========================================= */
/* ============ WORKSPACE ================== */
/* ========================================= */

export const createWorkspace = async (data) => {
  const res = await fetch(`${BASE_URL}/workspace`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Workspace creation failed");
  }

  return await res.json();
};

export const activateWorkspace = async (workspaceId) => {
  const res = await fetch(`${BASE_URL}/workspace/${workspaceId}/activate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Activation failed");
  }

  return await res.json();
};

/* ========================================= */
/* ============== EMAIL ==================== */
/* ========================================= */

export const setupEmail = async (data) => {
  const res = await fetch(`${BASE_URL}/email/setup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Email setup failed");
  }

  return await res.json();
};

/* ========================================= */
/* ============== DASHBOARD ================ */
/* ========================================= */

export const getDashboardStats = async (workspaceId) => {
  const res = await fetch(`${BASE_URL}/dashboard/${workspaceId}`);

  if (!res.ok) {
    throw new Error("Failed to load dashboard stats");
  }

  return await res.json();
};

/* ========================================= */
/* ================ LEADS ================== */
/* ========================================= */

export const getLeads = async (workspaceId) => {
  const res = await fetch(`${BASE_URL}/leads/workspace/${workspaceId}`);

  if (!res.ok) {
    throw new Error("Failed to fetch leads");
  }

  return await res.json();
};

export const createLead = async (data) => {
  const res = await fetch(`${BASE_URL}/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to create lead");
  }

  return await res.json();
};

export const deleteLead = async (id) => {
  const res = await fetch(`${BASE_URL}/leads/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete lead");
  }

  return await res.json();
};

export const convertLead = async (id) => {
  const res = await fetch(`${BASE_URL}/leads/${id}/convert`, {
    method: "PUT",
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to convert lead");
  }

  return await res.json();
};

/* ========================================= */
/* =============== BOOKINGS ================= */
/* ========================================= */

export const getBookings = async (workspaceId) => {
  const res = await fetch(`${BASE_URL}/bookings/${workspaceId}`);

  if (!res.ok) {
    throw new Error("Failed to fetch bookings");
  }

  return await res.json();
};

export const updateBookingStatus = async (id, data) => {
  const res = await fetch(`${BASE_URL}/bookings/status/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update booking status");
  }

  return await res.json();
};

export const rescheduleBooking = async (id, data) => {
  const res = await fetch(`${BASE_URL}/bookings/reschedule/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to reschedule booking");
  }

  return await res.json();
};

export const deleteBooking = async (bookingId) => {
  const res = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete booking");
  }

  return await res.json();
};

/* ========================================= */
/* ============ PUBLIC BOOKING ============= */
/* ========================================= */

export const publicBooking = async (workspaceId, data) => {
  const res = await fetch(`${BASE_URL}/public/book/${workspaceId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Public booking failed");
  }

  return await res.json();
};
