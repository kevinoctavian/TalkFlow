import Axios from "axios";
import store from "../store.ts";
import { clearTokens, setTokens } from "../features/auth/auth.ts";

type subcriberCallback = (token: string) => void;

let isRefreshing = false;
let refreshSubscribers = <subcriberCallback[]> [];

const addSubscriber = (callback: subcriberCallback) => {
  refreshSubscribers.push(callback);
};

const notifySubscribers = (newToken: string) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

const talkflowBackend = Axios.create({
  baseURL: "http://localhost:3001/api",
  headers: {
    "Content-Type": "applicaion/json",
  },
});

talkflowBackend.interceptors.request.use((config) => {
  const state = store.getState();
  const accessToken = state.auth.accessToken;
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

talkflowBackend.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const state = store.getState();
          const refreshToken = state.auth.refreshToken;

          // Request a new access token
          const response = await talkflowBackend.post(
            "http://localhost:3001/api/auth/refresh",
            {
              refreshToken,
            },
          );

          console.log(response.data);

          const newAccessToken = response.data.access_token;

          // Update Redux state with the new token
          store.dispatch(setTokens({ accessToken: newAccessToken }));

          notifySubscribers(newAccessToken);

          isRefreshing = false;
        } catch (refreshError) {
          isRefreshing = false;

          // Clear tokens from Redux and handle logout
          store.dispatch(clearTokens());
          return Promise.reject(refreshError);
        }
      }

      // Queue pending requests until the token is refreshed
      return new Promise((resolve) => {
        addSubscriber((newToken) => {
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          resolve(talkflowBackend(originalRequest)); // Retry the original request
        });
      });
    }

    return Promise.reject(error);
  },
);

export default talkflowBackend;
