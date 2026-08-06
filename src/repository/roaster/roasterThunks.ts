import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/api";

export const requestOTP = createAsyncThunk(
  "roaster/requestOTP",
  async (
    payload: {
      role: "teacher" | "student" | "school";
      email: string;
      dob?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      let path = "";
      let body: any = { email: payload.email };

      if (payload.role === "school") {
        path = "/public/school/request-otp";
      } else {
        path =
          payload.role === "teacher"
            ? "/public/teachers/request-otp"
            : "/public/students/request-otp";
        body.dob = payload.dob;
      }

      const response = await api.post(path, body);
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.error || err.message || "Failed to send OTP";
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
        path =
          payload.role === "teacher"
            ? "/public/login/teachers"
            : "/public/login/students";
        body.dob = payload.dob;
      }

      const response = await api.post(path, body);
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.error || err.message || "Invalid verification code";
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
      const message =
        err.response?.data?.error || err.message || "Failed to create teacher";
      return rejectWithValue(message);
    }
  },
);

export const fetchGradesBySchool = createAsyncThunk(
  "roaster/fetchGradesBySchool",
  async (schoolId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/grades/school/${schoolId}`);
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.error || err.message || "Failed to load grades";
      return rejectWithValue(message);
    }
  },
);

export const createGradeStructure = createAsyncThunk(
  "roaster/createGradeStructure",
  async (
    payload: {
      school_id: string;
      name: string;
      color: string;
      tuition_fee: number;
      sections?: {
        id?: string;
        name: string;
        class_teacher_id?: string;
        class_teacher_name?: string;
      }[];
      subjects: any[];
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post("/api/v1/grades/create", payload);
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.error ||
        err.message ||
        "Failed to create grade structure";
      return rejectWithValue(message);
    }
  },
);

export const updateGradeStructure = createAsyncThunk(
  "roaster/updateGradeStructure",
  async (
    payload: {
      id: string;
      name: string;
      color: string;
      tuition_fee: number;
      sections?: {
        id?: string;
        name: string;
        class_teacher_id?: string;
        class_teacher_name?: string;
      }[];
      subjects: any[];
    },
    { rejectWithValue },
  ) => {
    try {
      const { id, ...data } = payload;
      const response = await api.put(`/api/v1/grades/${id}`, data);
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.error ||
        err.message ||
        "Failed to update grade structure";
      return rejectWithValue(message);
    }
  },
);

export const fetchSchoolById = createAsyncThunk(
  "roaster/fetchSchoolById",
  async (schoolId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/public/schools/${schoolId}`);
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch school details";
      return rejectWithValue(message);
    }
  },
);

