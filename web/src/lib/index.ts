import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { isEnvBrowser } from '@/lib/constants';

const fetch = window.fetch;
// @ts-expect-error
window.fetch = () => {};
// @ts-expect-error
window.XMLHttpRequest = window.fetch;

export async function  fetchNui<T = any>(eventName: string, data?: any, mock?: { data: T; delay?: number }): Promise<T> {
  if (isEnvBrowser()) {
    if (!mock) return await new Promise((resolve) => resolve);
    await new Promise((resolve) => setTimeout(resolve, mock.delay));
    return mock.data;
  }
  const options = { method: 'post', headers: {'Content-Type': 'application/json; charset=UTF-8', }, body: JSON.stringify(data), };
  const resourceName = (window as any).GetParentResourceName ? (window as any).GetParentResourceName() : 'nui-frame-app';
  const resp = await fetch(`https://${resourceName}/${eventName}`, options);
  const respFormatted = await resp.json()
  return respFormatted
}

export function debugData<P>(events: DebugEvent<P>[], timer = 1000) {
  if (import.meta.env.MODE !== 'development' || !isEnvBrowser()) return;

  for (const { action, data } of events)
    setTimeout(() => window.postMessage({ action, data }), timer);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function vmin(i: number): `${string}vmin` {
  return `${0.09259259259259259 * i}vmin`;
}
