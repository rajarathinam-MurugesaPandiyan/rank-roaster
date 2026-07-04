import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { buildFetchTeachersCases, buildUpdateTeacherCases } from "./teachersReducer";

export { fetchTeachers, updateTeacher } from "../../repository/teacher/teacherThunks";

export interface TeacherItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  subject?: string;
  department?: string;
  experience?: string;
  qualification?: string;
  status?: string;
  [key: string]: any;
}

export interface TeachersState {
  teachers: TeacherItem[];
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: TeachersState = {
  teachers: [],
  total: 0,
  loading: false,
  error: null,
};

const teachersSlice = createSlice({
  name: "teachers",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    updateTeacherLocal(state, action: PayloadAction<TeacherItem>) {
      const index = state.teachers.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.teachers[index] = { ...state.teachers[index], ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    buildFetchTeachersCases(builder);
    buildUpdateTeacherCases(builder);
  },
});

export const { clearError, updateTeacherLocal } = teachersSlice.actions;
export default teachersSlice.reducer;
