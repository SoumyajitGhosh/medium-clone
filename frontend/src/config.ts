// export const BACKEND_URL = "https://backend.soumyajitghosh-official.workers.dev"
export const BACKEND_URL = "http://localhost:8787";
import axios, { Method } from 'axios';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

interface ApiErrorResponse {
  message: string;
  status?: number;
}

export function callApi<T>(
  url: string,
  method: Method,
  payload?: any,
  headers?: Record<string, string>// Optional headers
): Promise<ApiResponse<T>> {
  return new Promise((resolve, reject) => {
    axios({
      url,
      method,
      data: payload,
      headers: headers ?? { 'Content-Type': 'application/json' }, // Use provided headers or default
    })
      .then((response) => {
        resolve({ success: true, data: response.data });
      })
      .catch((error: unknown) => {
        if (axios.isAxiosError(error)) {
          const apiError: ApiErrorResponse = error.response?.data;
          console.log("Error:", apiError, error)
          const message = apiError?.message || "An error occurred";
          reject({ success: false, message });
        } else if (error instanceof Error) {
          reject({ success: false, message: error.message });
        } else {
          reject({ success: false, message: "An unknown error occurred" });
        }
      });
  });
}

export function errorResponse(error: unknown) {
  if (typeof error === "object" && error !== null && "message" in error) {
    return `${error.message}`;
  } else {
    return "An unknown error occurred";
  }
}

