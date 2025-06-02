import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { isEnvBrowser } from '@/lib/constants';

declare global {
  interface Window {
    GetParentResourceName?: () => string;
    colors: Record<string, string>;
  }
}

export async function fetchNui<T = any>(
  event: string,
  data?: any,
  mockData?: T
): Promise<void | T> {
  if (isEnvBrowser) {
    if (mockData) return mockData;
    return;
  }

  const resourceName: string = (window as any).GetParentResourceName
    ? (window as any).GetParentResourceName()
    : 'nui-resource';

  const resp = await fetch(`https://${resourceName}/${event}`, {
    method: 'POST',
    body: JSON.stringify(data)
  });

  return await resp.json();
}

export function debugData<P>(events: DebugEvent<P>[], timer = 1000) {
  if (import.meta.env.MODE !== 'development' || !isEnvBrowser) return;

  for (const { action, data } of events)
    setTimeout(() => window.postMessage({ action, data }), timer);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function vmin(i: number): `${string}vmin` {
  return `${0.09259259259259259 * i}vmin`;
}
