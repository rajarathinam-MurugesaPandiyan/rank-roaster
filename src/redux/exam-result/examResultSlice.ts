import { createSlice } from "@reduxjs/toolkit";
import {
  fetchExamResults,
  createExamResult,
  updateExamResult,
  deleteExamResult,
  type ExamResult,
} from "../../repository/exam-result/examResultThunks";

export {
  fetchExamResults,
  createExamResult,
  updateExamResult,
  deleteExamResult,
};
export type { ExamResult };

export interface ExamResultState {
  results: ExamResult[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  loading: boolean;
  error: string | null;
}

const initialState: ExamResultState = {
  results: [],
  total: 0,
  page: 1,
  limit: 100,
  pages: 1,
  loading: false,
  error: null,
};

const examResultSlice = createSlice({
  name: "examResults",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchExamResults
      .addCase(fetchExamResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExamResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.results || [];
        state.total = action.payload.total || 0;
        state.page = action.payload.page || 1;
        state.limit = action.payload.limit || 100;
        state.pages = action.payload.pages || 1;
      })
      .addCase(fetchExamResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // createExamResult
      .addCase(createExamResult.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExamResult.fulfilled, (state, action) => {
        state.loading = false;
        state.results.push(action.payload);
      })
      .addCase(createExamResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // updateExamResult
      .addCase(updateExamResult.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExamResult.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.results.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.results[index] = action.payload;
        }
      })
      .addCase(updateExamResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // deleteExamResult
      .addCase(deleteExamResult.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExamResult.fulfilled, (state, action) => {
        state.loading = false;
        state.results = state.results.filter((r) => r.id !== action.payload);
      })
      .addCase(deleteExamResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = examResultSlice.actions;
export default examResultSlice.reducer;
