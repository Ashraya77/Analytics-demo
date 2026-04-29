import axios from "axios";

const publicApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});


publicApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 500) console.error("Server error:", error.response?.data?.message);
    return Promise.reject(error);
  }
);

export default publicApiClient;