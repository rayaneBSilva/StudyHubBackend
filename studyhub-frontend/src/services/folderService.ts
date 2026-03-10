import { api } from "../api/axios";

export const getFolders = () => {
  return api.get("/folders");
};

export const createFolder = (data: { nome: string }) => {
  return api.post("/folders", data);
};

export const deleteFolder = (id: number) => {
  return api.delete(`/folders/${id}`);
};
