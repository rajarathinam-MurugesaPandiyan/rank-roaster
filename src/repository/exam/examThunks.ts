import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/api";

export interface ExamSubject {
  subject_id: string;
  name: string;
  max_marks: number;
  teacher_id: string;
  teacher_name?: string;
}

export interface ExamItem {
  id: string;
  school_id: string;
  academic_year_id: string;
  grade_id: string;
  name: string;
  subjects: ExamSubject[];
  created_at: string;
  updated_at: string;
}

export interface CreateExamPayload {
  school_id: string;
  academic_year_id: string;
  grade_id: string;
  name: string;
  subjects: ExamSubject[];
}

export interface FetchExamsParams {
  schoolId: string;
  page?: number;
  limit?: number;
  search?: string;
  gradeId?: string;
  academicYearId?: string;
}

export const fetchExamsBySchool = createAsyncThunk(
  "exams/fetchExamsBySchool",
  async (params: FetchExamsParams, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/exams/school/${params.schoolId}`, {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          search: params.search || undefined,
          grade_id: params.gradeId || undefined,
          academic_year_id: params.academicYearId || undefined,
        },
      });
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch exams";
      return rejectWithValue(message);
    }
  }
);

export const createExam = createAsyncThunk(
  "exams/createExam",
  async (payload: CreateExamPayload, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/v1/exams/create", payload);
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.error ||
        err.message ||
        "Failed to create exam";
      return rejectWithValue(message);
    }
  }
);

export const deleteExam = createAsyncThunk(
  "exams/deleteExam",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/api/v1/exams/${id}`);
      return id;
    } catch (err: any) {
      const message =
        err.response?.data?.error ||
        err.message ||
        "Failed to delete exam";
      return rejectWithValue(message);
    }
  }
);
