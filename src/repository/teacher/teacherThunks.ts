import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/api";

export interface FetchTeachersPayload {
  schoolId: string;
  page: number;
  limit: number;
  search?: string;
  subject?: string;
  department?: string;
  status?: string;
}

export const fetchTeachers = createAsyncThunk(
  "teachers/fetchTeachers",
  async (payload: FetchTeachersPayload, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/teachers/school/${payload.schoolId}`, {
        params: {
          page: payload.page,
          limit: payload.limit,
          search: payload.search,
          subject: payload.subject,
          department: payload.department,
          status: payload.status,
        },
      });
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.error || err.message || "Failed to load teachers list";
      return rejectWithValue(message);
    }
  }
);

export interface UpdateTeacherPayload {
  id: string;
  schoolId: string;
  data: {
    name: string;
    email: string;
    phone?: string;
    is_admin: boolean;
    subject?: string;
    department?: string;
    documents?: any[];
    experience?: string;
    qualification?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    status?: string;
    alt_phone?: string;
    gender?: string;
    dob?: string;
  };
}

export const updateTeacher = createAsyncThunk(
  "teachers/updateTeacher",
  async (payload: UpdateTeacherPayload, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/v1/teachers/${payload.id}/school/${payload.schoolId}`,
        payload.data
      );
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.error || err.message || "Failed to update teacher";
      return rejectWithValue(message);
    }
  }
);

