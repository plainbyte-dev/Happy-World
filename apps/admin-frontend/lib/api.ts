const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiFailure {
  success: false;
  error: {
    message: string;
    fields?: Record<string, string>;
  };
}

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

export class ApiRequestError extends Error {
  fields?: Record<string, string>;

  constructor(message: string, fields?: Record<string, string>) {
    super(message);
    this.fields = fields;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers:
      init?.body && !(init.body instanceof FormData)
        ? { 'Content-Type': 'application/json', ...init.headers }
        : init?.headers,
  });

  const json = (await res.json()) as ApiResult<T>;

  if (!json.success) {
    throw new ApiRequestError(json.error.message, json.error.fields);
  }

  return json.data;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

export function uploadImages(files: File[], onProgress?: (percent: number) => void): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE_URL}/api/admin/upload`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      let json: ApiResult<{ urls: string[] }>;
      try {
        json = JSON.parse(xhr.responseText) as ApiResult<{ urls: string[] }>;
      } catch {
        reject(new Error('Upload failed'));
        return;
      }
      if (!json.success) {
        reject(new ApiRequestError(json.error.message, json.error.fields));
        return;
      }
      resolve(json.data.urls);
    };

    xhr.onerror = () => reject(new Error('Upload failed'));
    xhr.send(formData);
  });
}

export function resolveImageUrl(url: string): string {
  return /^https?:\/\//.test(url) ? url : `${API_BASE_URL}${url}`;
}

// next/image throws at render time for any host not listed in next.config.ts's
// images.remotePatterns. Cloudinary is the only host configured there, so legacy
// image references (e.g. old local /uploads paths from before the Cloudinary
// migration) need to fall back to a plain <img> instead of crashing the page.
export function isOptimizableImageUrl(url: string): boolean {
  try {
    return new URL(resolveImageUrl(url)).hostname === 'res.cloudinary.com';
  } catch {
    return false;
  }
}

export { API_BASE_URL };
