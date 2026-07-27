import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/api";

export interface StudentItem {
  id: string;
  schoolId: string;
  gradeId: string;
  admissionNo?: string;
  rollNo?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: string;
  dateOfBirth: string;
  email?: string;
  phone?: string;
  fatherName: string;
  fatherPhone: string;
  fatherEmail?: string;
  motherName: string;
  motherPhone: string;
  motherEmail?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  guardianRelation?: string;
  address?: string;
  bloodGroup?: string;
  photoUrl?: string;
  status: string;
  joinedAt?: string;
  academicYearId?: string;
  section?: string;
  enrollment?: {
    id: string;
    student_id: string;
    school_id: string;
    academic_year_id: string;
    grade_id: string;
    roll_no?: number;
    section?: string;
    status?: string;
    joined_at?: string;
  };
}

export interface CreateStudentPayload {
  schoolId: string;
  gradeId: string;
  admissionNo?: string;
  rollNo?: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string; // string representation of time
  email?: string;
  phone?: string;
  fatherName: string;
  fatherPhone: string;
  fatherEmail?: string;
  motherName: string;
  motherPhone: string;
  motherEmail?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  guardianRelation?: string;
  address?: string;
  bloodGroup?: string;
  photoUrl?: string;
  status: string; // Active, Inactive, Graduated, Transferred
  joinedAt?: string;
  password?: string;
  academicYearId?: string;
  section?: string;
}

export interface FetchStudentsParams {
  schoolId: string;
  gradeId?: string;
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface PaginatedStudentsResponse {
  students: StudentItem[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export const createStudent = createAsyncThunk(
  "students/createStudent",
  async (payload: CreateStudentPayload, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/v1/students/create", payload);
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.error || err.message || "Failed to create student";
      return rejectWithValue(message);
    }
  }
);

export const fetchStudents = createAsyncThunk(
  "students/fetchStudents",
  async (params: FetchStudentsParams, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/students/school/${params.schoolId}`, {
        params: {
          gradeId: params.gradeId || undefined,
          page: params.page || 1,
          limit: params.limit || 10,
          search: params.search || undefined,
          status: params.status || undefined,
        },
      });
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.error || err.message || "Failed to fetch students";
      return rejectWithValue(message);
    }
  }
);
