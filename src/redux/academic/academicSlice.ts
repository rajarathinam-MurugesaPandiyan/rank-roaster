import { createSlice } from "@reduxjs/toolkit";
import {
  createAcademicYear,
  fetchAcademicYearsBySchool,
  updateAcademicYear,
  type AcademicYearItem,
} from "../../repository/academic/academicThunks";

export {
  createAcademicYear,
  fetchAcademicYearsBySchool,
  updateAcademicYear,
} from "../../repository/academic/academicThunks";
export type { AcademicYearItem };

export interface AcademicState {
  academicYears: AcademicYearItem[];
  loading: boolean;
  submitLoading: boolean;
  error: string | null;
}

const initialState: AcademicState = {
  academicYears: [],
  loading: false,
  submitLoading: false,
  error: null,
};

const academicSlice = createSlice({
  name: "academic",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAcademicYearsBySchool
      .addCase(fetchAcademicYearsBySchool.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAcademicYearsBySchool.fulfilled, (state, action) => {
        state.loading = false;
        state.academicYears = action.payload || [];
      })
      .addCase(fetchAcademicYearsBySchool.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // createAcademicYear
      .addCase(createAcademicYear.pending, (state) => {
        state.submitLoading = true;
        state.error = null;
      })
      .addCase(createAcademicYear.fulfilled, (state, action) => {
        state.submitLoading = false;
        state.academicYears.push(action.payload);
      })
      .addCase(createAcademicYear.rejected, (state, action) => {
        state.submitLoading = false;
        state.error = action.payload as string;
      })
      // updateAcademicYear
      .addCase(updateAcademicYear.pending, (state) => {
        state.submitLoading = true;
        state.error = null;
      })
      .addCase(updateAcademicYear.fulfilled, (state, action) => {
        state.submitLoading = false;
        const updated = action.payload;
        const index = state.academicYears.findIndex((ay) => ay.id === updated.id);
        if (index !== -1) {
          state.academicYears[index] = updated;
        }
      })
      .addCase(updateAcademicYear.rejected, (state, action) => {
        state.submitLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = academicSlice.actions;
export default academicSlice.reducer;
