import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

/**
 * Sets a cookie in the browser environment
 */
export const setCookie = (name: string, value: string, days = 7) => {
  if (typeof window === 'undefined') return;

  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

/**
 * Gets a cookie value in browser environment
 */
export const getCookie = (name: string): string | undefined => {
  if (typeof window === 'undefined') return undefined;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop()?.split(';').shift() || '');
  }
  return undefined;
};

/**
 * Removes a cookie in browser environment
 */
export const removeCookie = (name: string) => {
  if (typeof window === 'undefined') return;
  
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};

/**
 * Parse cookies for server components or middleware
 */
export const parseCookies = (cookies: ReadonlyRequestCookies) => {
  const parsedCookies: Record<string, string> = {};
  
  cookies.getAll().forEach((cookie) => {
    parsedCookies[cookie.name] = cookie.value;
  });
  
  return parsedCookies;
}; 