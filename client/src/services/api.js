// SprintDesk Centralized Frontend HTTP API Client
// Adheres strictly to contracts in docs/05-API-DOCUMENTATION.md

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const config = {
      ...options,
      headers,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    let response;
    try {
      response = await fetch(url, config);
    } catch (networkError) {
      throw new Error(`Network failure connecting to API at ${url}: ${networkError.message}`, {
        cause: networkError,
      });
    }

    // Attempt to parse JSON response
    let json;
    try {
      json = await response.json();
    } catch {
      json = null;
    }

    if (!response.ok) {
      const errorMessage =
        json?.error?.message || `Request failed with HTTP status ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.code = json?.error?.code || 'HTTP_ERROR';
      error.details = json?.error?.details || null;
      throw error;
    }

    return json;
  }

  get(endpoint, queryParams = {}) {
    const query = new URLSearchParams();
    for (const [key, val] of Object.entries(queryParams)) {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    }
    const queryString = query.toString();
    const fullPath = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(fullPath, { method: 'GET' });
  }

  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body,
    });
  }

  patch(endpoint, body) {
    return this.request(endpoint, {
      method: 'PATCH',
      body,
    });
  }

  delete(endpoint, queryParams = {}) {
    const query = new URLSearchParams();
    for (const [key, val] of Object.entries(queryParams)) {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    }
    const queryString = query.toString();
    const fullPath = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(fullPath, { method: 'DELETE' });
  }
}

export const api = new ApiClient(API_BASE_URL);
