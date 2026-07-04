import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/api";

export const requestOTP = createAsyncThunk(
  "roaster/requestOTP",
  async (
    payload: { role: "teacher" | "student" | "school"; email: string; dob?: string },
    { rejectWithValue },
  ) => {
    try {
      let path = "";
      let body: any = { email: payload.email };
      
      if (payload.role === "school") {
        path = "/public/school/request-otp";
      } else {
        path = payload.role === "teacher" ? "/public/teachers/request-otp" : "/public/students/request-otp";
        body.dob = payload.dob;
      }

      const response = await api.post(path, body);
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.error || err.message || "Failed to send OTP";
      return rejectWithValue(message);
    }
  },
);

export const loginUser = createAsyncThunk(
  "roaster/loginUser",
  async (
    payload: {
      role: "teacher" | "student" | "school";
      email: string;
      dob?: string;
      otp: string;
    },
    { rejectWithValue },
  ) => {
    try {
      let path = "";
      let body: any = { email: payload.email, otp: payload.otp };

      if (payload.role === "school") {
        path = "/public/login/school";
      } else {
        path = payload.role === "teacher" ? "/public/login/teachers" : "/public/login/students";
        body.dob = payload.dob;
      }

      const response = await api.post(path, body);
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.error || err.message || "Invalid verification code";
      return rejectWithValue(message);
    }
  },
);

export const createTeacher = createAsyncThunk(
  "roaster/createTeacher",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/v1/teachers/create", payload);
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.error || err.message || "Failed to create teacher";
      return rejectWithValue(message);
    }
  }
);
