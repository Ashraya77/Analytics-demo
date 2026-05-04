import countriesApiClient from "@/application/repository/countryAxiosInstance";
import { mapCountryToPayload } from "@/application/mapper/mapper";
import type { Country } from "@/types/Countries";

//   export const getCountries = async () => {
//     const { data } = await countriesApiClient.get("/countries");
//     return data;
//   };

export const getCountries = () => countriesApiClient.get("/api/countries");

export const getCountryByName = (name: string) =>
  countriesApiClient.get(`/api/name/${encodeURIComponent(name)}`);

export const updateCountry = (country: Country) => {
  const payload = mapCountryToPayload(country);

  console.log("Country update payload:", payload);

  return countriesApiClient.post("/api/countries", payload);
};
