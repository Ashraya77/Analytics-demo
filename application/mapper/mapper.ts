 import type { LoginFormValues, RegisterFormValues } from "@/lib/validations/auth.schema";

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
