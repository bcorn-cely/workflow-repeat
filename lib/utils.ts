import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function fetchJson(path: string, init?: RequestInit) {
  // Build absolute URL from relative path
  let url: string;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    // Already absolute, use as-is
    url = path;
  } else {
    // Construct absolute URL from env var or default
    let baseUrl: string;
    if (process.env.BASE_URL) {
      baseUrl = process.env.BASE_URL;
    } else if (process.env.VERCEL_URL) {
      baseUrl = `https://${process.env.VERCEL_URL}`;
    } else {
      baseUrl = 'http://localhost:3000';
    }
    url = `${baseUrl}${path}`;
  }
  
  const res = await fetch(url, { ...init, headers: { 'content-type': 'application/json', ...(init?.headers || {}) }});
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
