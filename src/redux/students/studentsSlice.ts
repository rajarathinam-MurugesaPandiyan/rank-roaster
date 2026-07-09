import { createSlice } from "@reduxjs/toolkit";
import {
  createStudent,
  fetchStudents,
  type StudentItem,
} from "../../repository/student/studentThunks";

export { createStudent, fetchStudents } from "../../repository/student/studentThunks";
export type { StudentItem };

export interface StudentsState {
  students: StudentItem[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  loading: boolean;
  error: string | null;
}

const initialState: StudentsState = {
  students: [],
  total: 0,
  page: 1,
  limit: 10,
  pages: 0,
  loading: false,
  error: null,
};

const studentsSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // createStudent
      .addCase(createStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.students.unshift(action.payload);
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchStudents
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload.students || [];
        state.total = action.payload.total || 0;
        state.page = action.payload.page || 1;
        state.limit = action.payload.limit || 10;
        state.pages = action.payload.pages || 0;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = studentsSlice.actions;
export default studentsSlice.reducer;
