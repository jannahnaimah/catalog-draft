export const API_BASE_URL = 'https://dummyjson.com';

export class ApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function buildUrl(
  path: string,
  params?: Record<string, string | number>,
): string {
  const url = new URL(path, `${API_BASE_URL}/`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

export async function apiGet<T>(
  path: string,
  params?: Record<string, string | number>,
): Promise<T> {
  const url = buildUrl(path, params);

  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    throw new ApiError(
      'Unable to reach the catalog. Check your connection and try again.',
    );
  }

  if (!response.ok) {
    throw new ApiError(
      `Could not load catalog data (${response.status}).`,
      response.status,
    );
  }

  return (await response.json()) as T;
}
