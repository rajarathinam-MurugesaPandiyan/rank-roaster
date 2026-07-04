import type { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { fetchTeachers, updateTeacher } from "../../repository/teacher/teacherThunks";
import type { TeachersState } from "./teachersSlice";

export const buildFetchTeachersCases = (
  builder: ActionReducerMapBuilder<TeachersState>,
) => {
  builder
    .addCase(fetchTeachers.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchTeachers.fulfilled, (state, action) => {
      state.loading = false;
      state.teachers = action.payload.teachers || [];
      state.total = action.payload.total || 0;
    })
    .addCase(fetchTeachers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
};

export const buildUpdateTeacherCases = (
  builder: ActionReducerMapBuilder<TeachersState>,
) => {
  builder
    .addCase(updateTeacher.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateTeacher.fulfilled, (state, action) => {
      state.loading = false;
      const updated = action.payload;
      const index = state.teachers.findIndex((t) => t.id === updated.id);
      if (index !== -1) {
        state.teachers[index] = { ...state.teachers[index], ...updated };
      }
    })
    .addCase(updateTeacher.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
};
