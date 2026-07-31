import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/api";

export interface SubjectMark {
  subject_id: string;
  subject_name?: string;
  marks_obtained: number;
  total_marks: number;
}

export interface ExamResult {
  id: string;
  school_id: string;
  academic_year_id: string;
  student_id: string;
  student_enrollment_id: string;
  grade_id: string;
  exam_id: string;
  subject_marks: SubjectMark[];
  total_obtained: number;
  total_possible: number;
  percentage: number;
  remarks?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateExamResultPayload {
  school_id: string;
  academic_year_id: string;
  student_id: string;
  student_enrollment_id: string;
  grade_id: string;
  exam_id: string;
  subject_marks: SubjectMark[];
  remarks?: string;
}

export interface UpdateExamResultPayload {
  id: string;
  subject_marks: SubjectMark[];
  remarks?: string;
}

export interface FetchExamResultsParams {
  schoolId: string;
  examId: string;
  gradeId: string;
  academicYearId: string;
  studentId?: string;
  studentEnrollmentId?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedExamResultsResponse {
  results: ExamResult[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export const fetchExamResults = createAsyncThunk<
  PaginatedExamResultsResponse,
  FetchExamResultsParams,
  { rejectValue: string }
>(
  "examResults/fetchExamResults",
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/exam-results/school/${params.schoolId}`, {
        params: {
          examId: params.examId,
          gradeId: params.gradeId,
          academicYearId: params.academicYearId,
          studentId: params.studentId,
          studentEnrollmentId: params.studentEnrollmentId,
          page: params.page || 1,
          limit: params.limit || 100,
        },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch exam results"
      );
    }
  }
);

export const createExamResult = createAsyncThunk<
  ExamResult,
  CreateExamResultPayload,
  { rejectValue: string }
>(
  "examResults/createExamResult",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/v1/exam-results/create", payload);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to create exam result"
      );
    }
  }
);

export const updateExamResult = createAsyncThunk<
  ExamResult,
  UpdateExamResultPayload,
  { rejectValue: string }
>(
  "examResults/updateExamResult",
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/v1/exam-results/${id}`, payload);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to update exam result"
      );
    }
  }
);

export const deleteExamResult = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  "examResults/deleteExamResult",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/v1/exam-results/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to delete exam result"
      );
    }
  }
);
