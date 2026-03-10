import { api } from "../api/axios";

export const loginRequest = async (email: string, password: string) => {
  const response = await api.post("/users/login", {
    email,
    password,
  });

  return response.data;
};

export const registerRequest = async (
  name: string,
  email: string,
  password: string,
  role: string,
) => {
  const response = await api.post("/users", {
    name,
    email,
    password,
    role,
  });

  return response.data;
};
