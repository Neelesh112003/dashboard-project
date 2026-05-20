const API_ROOT = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
const BASE = `${API_ROOT}/v1`;

function getToken() {
  const directToken =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("authToken");

  if (directToken) return directToken;

  try {
    const authUser =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user") ||
      localStorage.getItem("auth") ||
      sessionStorage.getItem("auth");

    if (authUser) {
      const parsed = JSON.parse(authUser);
      return parsed?.token || parsed?.access_token || "";
    }
  } catch {
    // ignore parse errors
  }

  return "";
}

function headers(extraHeaders = {}) {
  const token = getToken();

  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extraHeaders,
  };
}

/**
 * Central fetch wrapper
 * Always resolves:
 * {
 *   ok: boolean,
 *   data: any,
 *   message: string,
 *   errorCode: string,
 *   status: number
 * }
 */
async function apiFetch(path, options = {}) {
  const url = `${BASE}${path}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers: headers(options.headers || {}),
    });

    const responseText = await res.text();

    let json = null;
    try {
      json = responseText ? JSON.parse(responseText) : null;
    } catch {
      json = null;
    }

    if (json) {
      const errorCode = String(json.error ?? (res.ok ? "100" : res.status));
      const ok = errorCode === "100";

      return {
        ok,
        data: json.data ?? null,
        message: json.message ?? "",
        errorCode,
        status: res.status,
      };
    }

    if (res.status === 401) {
      return {
        ok: false,
        data: null,
        message: "You are not logged in. Please log in and try again.",
        errorCode: "104",
        status: res.status,
      };
    }

    if (res.status === 403) {
      return {
        ok: false,
        data: null,
        message: "You do not have permission to perform this action.",
        errorCode: "105",
        status: res.status,
      };
    }

    if (res.status === 404) {
      return {
        ok: false,
        data: null,
        message: "Record not found.",
        errorCode: "103",
        status: res.status,
      };
    }

    return {
      ok: false,
      data: null,
      message: `Server error (${res.status}). Please contact support.`,
      errorCode: String(res.status),
      status: res.status,
    };
  } catch (err) {
    return {
      ok: false,
      data: null,
      message: err?.message || "Fetch failed",
      errorCode: "network",
      status: 0,
    };
  }
}

function toQuery(params = {}) {
  const filtered = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== "" && value !== null && value !== undefined
    )
  );

  const q = new URLSearchParams(filtered).toString();
  return q ? `?${q}` : "";
}

/* ─────────────────────────────────────────────
   AUTH
───────────────────────────────────────────── */
export const authApi = {
  login: (body) =>
    fetch(`${API_ROOT.replace(/\/v1$/, "")}/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then(async (res) => {
        const text = await res.text();
        let json = null;
        try {
          json = JSON.parse(text);
        } catch {
          json = null;
        }

        if (!json) {
          return {
            ok: false,
            data: null,
            message: `Server error (${res.status}).`,
            errorCode: String(res.status),
            status: res.status,
          };
        }

        return {
          ok: String(json.error ?? (res.ok ? "100" : res.status)) === "100",
          data: json.data ?? null,
          message: json.message ?? "",
          errorCode: String(json.error ?? res.status),
          status: res.status,
        };
      })
      .catch((err) => ({
        ok: false,
        data: null,
        message: err?.message || "Login failed",
        errorCode: "network",
        status: 0,
      })),
};

/* ─────────────────────────────────────────────
   GODOWNS
───────────────────────────────────────────── */
export const godownApi = {
  list: (params = {}) => apiFetch(`/godowns${toQuery(params)}`),
  get: (id) => apiFetch(`/godowns/${id}`),
  create: (body) =>
    apiFetch(`/godowns`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  update: (id, body) =>
    apiFetch(`/godowns/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  delete: (id) =>
    apiFetch(`/godowns/${id}`, {
      method: "DELETE",
    }),
  toggleStatus: (id) =>
    apiFetch(`/godowns/${id}/toggle`, {
      method: "PATCH",
    }),
  search: (name) =>
    apiFetch(`/godowns/search?name=${encodeURIComponent(name)}`),
};

/* ─────────────────────────────────────────────
   GODOWN SECTIONS
───────────────────────────────────────────── */
export const sectionApi = {
  list: (params = {}) => apiFetch(`/godown-sections${toQuery(params)}`),
  get: (id) => apiFetch(`/godown-sections/${id}`),
  create: (body) =>
    apiFetch(`/godown-sections`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  update: (id, body) =>
    apiFetch(`/godown-sections/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  delete: (id) =>
    apiFetch(`/godown-sections/${id}`, {
      method: "DELETE",
    }),
  toggleStatus: (id) =>
    apiFetch(`/godown-sections/${id}/toggle`, {
      method: "PATCH",
    }),
  search: (name, godown_id) =>
    apiFetch(
      `/godown-sections/search?name=${encodeURIComponent(name)}${
        godown_id ? `&godown_id=${godown_id}` : ""
      }`
    ),
};

/* ─────────────────────────────────────────────
   GODOWN FLOORS
───────────────────────────────────────────── */
export const floorApi = {
  list: (params = {}) => apiFetch(`/godown-floors${toQuery(params)}`),
  get: (id) => apiFetch(`/godown-floors/${id}`),
  create: (body) =>
    apiFetch(`/godown-floors`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  update: (id, body) =>
    apiFetch(`/godown-floors/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  delete: (id) =>
    apiFetch(`/godown-floors/${id}`, {
      method: "DELETE",
    }),
  toggleStatus: (id) =>
    apiFetch(`/godown-floors/${id}/toggle`, {
      method: "PATCH",
    }),
  search: (name, godown_id, section_id) =>
    apiFetch(
      `/godown-floors/search?name=${encodeURIComponent(name)}${
        godown_id ? `&godown_id=${godown_id}` : ""
      }${section_id ? `&section_id=${section_id}` : ""}`
    ),
};

/* ─────────────────────────────────────────────
   GODOWN RACKS
───────────────────────────────────────────── */
export const rackApi = {
  list: (params = {}) => apiFetch(`/godown-racks${toQuery(params)}`),
  get: (id) => apiFetch(`/godown-racks/${id}`),
  create: (body) =>
    apiFetch(`/godown-racks`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  update: (id, body) =>
    apiFetch(`/godown-racks/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  delete: (id) =>
    apiFetch(`/godown-racks/${id}`, {
      method: "DELETE",
    }),
  toggleStatus: (id) =>
    apiFetch(`/godown-racks/${id}/toggle`, {
      method: "PATCH",
    }),
  search: (name, godown_id, section_id, floor_id) =>
    apiFetch(
      `/godown-racks/search?name=${encodeURIComponent(name)}${
        godown_id ? `&godown_id=${godown_id}` : ""
      }${section_id ? `&section_id=${section_id}` : ""}${
        floor_id ? `&floor_id=${floor_id}` : ""
      }`
    ),
};

/* ─────────────────────────────────────────────
   GODOWN RACK SPACES
───────────────────────────────────────────── */
export const rackSpaceApi = {
  list: (params = {}) => apiFetch(`/godown-rack-spaces${toQuery(params)}`),
  get: (id) => apiFetch(`/godown-rack-spaces/${id}`),
  create: (body) =>
    apiFetch(`/godown-rack-spaces`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  update: (id, body) =>
    apiFetch(`/godown-rack-spaces/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  delete: (id) =>
    apiFetch(`/godown-rack-spaces/${id}`, {
      method: "DELETE",
    }),
  toggleStatus: (id) =>
    apiFetch(`/godown-rack-spaces/${id}/toggle`, {
      method: "PATCH",
    }),
  search: (name, godown_id, section_id, floor_id, rack_id) =>
    apiFetch(
      `/godown-rack-spaces/search?name=${encodeURIComponent(name)}${
        godown_id ? `&godown_id=${godown_id}` : ""
      }${section_id ? `&section_id=${section_id}` : ""}${
        floor_id ? `&floor_id=${floor_id}` : ""
      }${rack_id ? `&rack_id=${rack_id}` : ""}`
    ),
};

/* ─────────────────────────────────────────────
   ERROR CODE → Human-readable message
───────────────────────────────────────────── */
export function apiErrorMessage(errorCode, fallback = "") {
  const code = String(errorCode);

  const map = {
    "100": "Success",
    "101": fallback || "Validation error. Please check the fields.",
    "102": fallback || "A record with this code or name already exists.",
    "103": fallback || "Record not found.",
    "104": fallback || "You are not logged in. Please log in and try again.",
    "105": fallback || "You do not have permission to perform this action.",
    "106": fallback || "Cannot delete — child records still exist. Remove them first.",
    network: "Network error. Please check your connection and try again.",
  };

  return map[code] || fallback || "Something went wrong. Please try again.";
}