import { createSlice } from "@reduxjs/toolkit";
import {
  fetchExamsBySchool,
  createExam,
  deleteExam,
  type ExamItem,
} from "../../repository/exam/examThunks";

export {
  fetchExamsBySchool,
  createExam,
  deleteExam,
} from "../../repository/exam/examThunks";
export type { ExamItem, ExamSubject, CreateExamPayload, FetchExamsParams } from "../../repository/exam/examThunks";

export interface ExamState {
  exams: ExamItem[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasMore: boolean;
  loading: boolean;
  submitLoading: boolean;
  error: string | null;
}

const initialState: ExamState = {
  exams: [],
  total: 0,
  page: 1,
  limit: 10,
  pages: 1,
  hasMore: false,
  loading: false,
  submitLoading: false,
  error: null,
};

const examSlice = createSlice({
  name: "exam",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchExamsBySchool
      .addCase(fetchExamsBySchool.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExamsBySchool.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;
        if (data.page === 1) {
          state.exams = data.exams || [];
        } else {
          // Append and filter duplicates by id
          const existingIds = new Set(state.exams.map((e) => e.id));
          const newExams = (data.exams || []).filter((e: any) => !existingIds.has(e.id));
          state.exams = [...state.exams, ...newExams];
        }
        state.total = data.total || 0;
        state.page = data.page || 1;
        state.limit = data.limit || 10;
        state.pages = data.pages || 1;
        state.hasMore = state.page < state.pages;
      })
      .addCase(fetchExamsBySchool.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // createExam
      .addCase(createExam.pending, (state) => {
        state.submitLoading = true;
        state.error = null;
      })
      .addCase(createExam.fulfilled, (state, action) => {
        state.submitLoading = false;
        state.exams.unshift(action.payload);
      })
      .addCase(createExam.rejected, (state, action) => {
        state.submitLoading = false;
        state.error = action.payload as string;
      })
      // deleteExam
      .addCase(deleteExam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExam.fulfilled, (state, action) => {
        state.loading = false;
        state.exams = state.exams.filter((e) => e.id !== action.payload);
      })
      .addCase(deleteExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = examSlice.actions;
export default examSlice.reducer;
