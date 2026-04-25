export const API_BASE_URL = 'http://10.181.206.30:5000/api';
export const SOCKET_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

export function apiUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}
