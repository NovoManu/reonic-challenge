const API_BASE_URL = (import.meta.env?.VITE_API_URL || 'http://localhost:4000');
const AUTH_TOKEN = import.meta.env?.VITE_AUTH_TOKEN || '';

interface RequestOptions {
  method: string
  headers: Record<string, string>
  body?: string | FormData
}

async function request(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data: unknown = null,
  headers: Record<string, string> = {},
  queryParams?: Record<string, string | number | boolean | undefined | null>,
): Promise<unknown> {
  
  let url = `${API_BASE_URL}${endpoint}`

  if (queryParams && Object.keys(queryParams).length > 0) {
    const searchParams = new URLSearchParams()
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value))
      }
    })
    url += `?${searchParams.toString()}`
  }

  const requestHeaders: Record<string, string> = {
    Authorization: `Bearer ${AUTH_TOKEN}`,
    ...headers,
  }

  const options: RequestOptions = {
    method,
    headers: requestHeaders,
  }

  if (data) {
    options.body = JSON.stringify(data)
  }

  try {
    const response = await fetch(url, options)
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`)
    }
    // For 204 No Content responses, return null instead of parsing JSON
    if (response.status === 204) {
      return null
    }
    return await response.json()
  } catch (error) {
    console.error('API request error:', error)
    throw error
  }
}

export const apiService = {
  get: (endpoint: string, queryParams?: Record<string, string | number | boolean>, headers: Record<string, string> = {}): Promise<unknown> =>
    request(endpoint, 'GET', null, headers, queryParams),
  post: (endpoint: string, data: unknown, headers: Record<string, string> = {}): Promise<unknown> =>
    request(endpoint, 'POST', data, headers),
  put: (endpoint: string, data: unknown, headers: Record<string, string> = {}): Promise<unknown> =>
    request(endpoint, 'PUT', data, headers),
  delete: (endpoint: string, headers: Record<string, string> = {}): Promise<unknown> =>
    request(endpoint, 'DELETE', {}, headers),
}