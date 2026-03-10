import { api } from "../api/axios";

export const getSummaries = () => {
  return api.get("/summaries");
};

export const uploadSummary = (formData: FormData) => {
  return api.post("/summaries", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
