import countriesApiClient from "@/application/repository/countryAxiosInstance";

//   export const getCountries = async () => {
//     const { data } = await countriesApiClient.get("/countries");
//     return data;
//   };

export const getCountries = () => countriesApiClient.get("/api/countries");