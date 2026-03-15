import { api } from "../api/axios";

export const getUsers = async (page = 1, limit = 10) => {
  const { data } = await api.get(`/users?page=${page}&limit=${limit}`);
  return data;
};

export const deleteUser = async (id: number) => {
  await api.delete(`/users/${id}`);
};
