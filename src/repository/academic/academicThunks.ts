import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/api";

export interface AcademicYearItem {
  id: string;
  schoolId: string;
  name: string;
  academicYear: string;
  startDate: string; // ISO DateTime
  endDate: string; // ISO DateTime
  isActive: boolean;
  createdAt?: string;
}

export interface CreateAcademicYearPayload {
  schoolId: string;
  name: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface UpdateAcademicYearPayload {
  id: string;
  name: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export const createAcademicYear = createAsyncThunk(
  "academic/createAcademicYear",
  async (payload: CreateAcademicYearPayload, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/v1/academics/create", payload);
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.error ||
        err.message ||
        "Failed to create academic year";
      return rejectWithValue(message);
    }
  }
);

export const fetchAcademicYearsBySchool = createAsyncThunk(
  "academic/fetchAcademicYearsBySchool",
  async (schoolId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/academics/school/${schoolId}`);
      return response.data || [];
    } catch (err: any) {
      const message =
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch academic years";
      return rejectWithValue(message);
    }
  }
);

export const updateAcademicYear = createAsyncThunk(
  "academic/updateAcademicYear",
  async (payload: UpdateAcademicYearPayload, { rejectWithValue }) => {
    try {
      const { id, ...data } = payload;
      const response = await api.put(`/api/v1/academics/${id}`, data);
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.error ||
        err.message ||
        "Failed to update academic year";
      return rejectWithValue(message);
    }
  }
);
