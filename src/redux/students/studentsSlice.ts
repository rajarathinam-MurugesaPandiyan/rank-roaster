import { createSlice } from "@reduxjs/toolkit";
import {
  createStudent,
  fetchStudents,
  updateStudent,
  type StudentItem,
} from "../../repository/student/studentThunks";

export {
  createStudent,
  fetchStudents,
  updateStudent,
} from "../../repository/student/studentThunks";
export type { StudentItem };

export interface StudentsState {
  students: StudentItem[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: StudentsState = {
  students: [],
  total: 0,
  page: 1,
  limit: 10,
  pages: 0,
  hasMore: false,
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
        const data = action.payload;
        state.students = data.students || [];
        state.total = data.total || 0;
        state.page = data.page || 1;
        state.limit = data.limit || 10;
        state.pages = data.pages || 0;
        state.hasMore = state.page < state.pages;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // updateStudent
      .addCase(updateStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const index = state.students.findIndex(
          (s) => s.id === updated.id || (s.id && s.id === updated.id)
        );
        if (index !== -1) {
          state.students[index] = updated;
        }
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = studentsSlice.actions;
export default studentsSlice.reducer;
