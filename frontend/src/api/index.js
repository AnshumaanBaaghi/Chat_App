import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const registerUser = (data) => {
  return api.post("/user/register", data);
};

export const sendOtp = (email) => {
  return api.post("/user/send-otp", { email });
};
export const verifyOtp = (otp, email) => {
  return api.post("/user/verify-otp", { email, otp });
};
