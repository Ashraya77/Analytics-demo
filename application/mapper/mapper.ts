 import type { LoginFormValues, RegisterFormValues } from "@/lib/validations/auth.schema";
 import type { Country } from "@/types/Countries";

  export type RegisterPayload = {
    name: string;
    email: string;
    phone_number: string;
    dob: string;
    age: number;
    password: string;
    confirm_password: string;
  };

  export type LoginPayload = {
    username: string;
    password: string;
  };

  export type CountryPayload = {
    name: string;
    capital: string;
    alpha_2_code: string;
    alpha_3_code: string;
    region: string;
    subregion: string;
    population: number;
    area: number;
    flag: string;
    flags: {
      png: string;
      svg: string;
    };
    native_name: string;
    demonym: string;
    currencies: {
      code: string;
      name: string;
      symbol: string;
    }[];
    languages: {
      iso639_1: string;
      iso639_2: string;
      name: string;
      native_name: string;
    }[];
    calling_codes: string[];
    independent: boolean;
    timezones: string[];
    borders: string[];
  };

  export function mapRegisterToPayload(
    values: RegisterFormValues
  ): RegisterPayload {
    return {
      name: values.name,
      email: values.email,
      phone_number: values.phoneNumber,
      dob: values.dob,
      age: values.age,
      password: values.password,
      confirm_password: values.confirmPassword,
    };
  }

  export function mapLoginToPayload(values: LoginFormValues): LoginPayload {
    return {
      username: values.username,
      password: values.password,
    };
  }

  export function mapCountryToPayload(country: Country): CountryPayload {
    return {
      name: country.name,
      capital: country.capital,
      alpha_2_code: country.alpha2Code,
      alpha_3_code: country.alpha3Code,
      region: country.region,
      subregion: country.subregion,
      population: country.population,
      area: country.area,
      flag: country.flag,
      flags: {
        png: country.flags?.png ?? "",
        svg: country.flags?.svg ?? "",
      },
      native_name: country.nativeName,
      demonym: country.demonym,
      currencies: country.currencies?.map((currency) => ({
        code: currency.code,
        name: currency.name,
        symbol: currency.symbol,
      })) ?? [],
      languages: country.languages?.map((language) => ({
        iso639_1: language.iso639_1,
        iso639_2: language.iso639_2,
        name: language.name,
        native_name: language.nativeName,
      })) ?? [],
      calling_codes: country.callingCodes ?? [],
      independent: country.independent,
      timezones: country.timezones ?? [],
      borders: country.borders ?? [],
    };
  }
