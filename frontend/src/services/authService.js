import api from "../api/axios";

export const loginUser = async (email, password) => {
  const response = await api.post("/api/auth/login", {
    email,
    password,
  });

  return response.data;
};

export const registerUser = async (fullName, email, password) => {
  const response = await api.post("/api/auth/register", {
    full_name: fullName,
    email,
    password,
  });

  return response.data;
};