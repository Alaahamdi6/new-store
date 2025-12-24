import { HttpHeaders } from '@angular/common/http';

export function getToken(): string | null {
  try {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    return user?.token ?? null;
  } catch {
    return null;
  }
}

export function buildAuthHeaders(): HttpHeaders {
  const token = getToken();
  if (!token) {
    return new HttpHeaders();
  }
  return new HttpHeaders({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  });
}
