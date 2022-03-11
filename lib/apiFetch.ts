import queryString from 'query-string'


export function apiFetch(url: string, data: { [key: string]: any }) {
  return fetch(
    `/api/${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
  )
}

