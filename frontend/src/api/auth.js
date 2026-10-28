
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function loginUser(username, password) {
  const response = await API.post("/auth/login", {
    username,
    password,
  });

  const data = response.data;

  // Keep the token for this browser session.
  sessionStorage.setItem("learnsphere_token", data.token);

  return data;
}

export async function getCurrentUser() {
  const token = sessionStorage.getItem("learnsphere_token");

  const response = await API.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export function logoutUser() {
  sessionStorage.removeItem("learnsphere_token");
}
