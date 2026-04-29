import axios from "axios";

  const countriesApiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_COUNTRIES_API_URL,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 10000,
  });

  export default countriesApiClient;
