import { createSlice } from "@reduxjs/toolkit";
import { loadLocalStorage, saveLocalStorage } from "../../helpers/storage";
import {
  getTabsForRole,
  buildRequestOTPCases,
  buildLoginUserCases,
  buildCreateTeacherCases,
  buildFetchGradesCases,
  buildCreateGradeStructureCases,
  buildUpdateGradeStructureCases,
} from "./roasterReducer";

import {
  requestOTP,
  loginUser,
  createTeacher,
  fetchGradesBySchool,
  createGradeStructure,
  updateGradeStructure,
  fetchSchoolById,
} from "../../repository/roaster/roasterThunks";
import {
  uploadStudentDocument,
  deleteStudentDocument,
  fetchStudentById,
  fetchStudentByEmail,
  fetchStudentPortalData,
} from "../../repository/student/studentThunks";

export {
  requestOTP,
  loginUser,
  createTeacher,
  fetchGradesBySchool,
  createGradeStructure,
  updateGradeStructure,
  fetchSchoolById,
  uploadStudentDocument,
  deleteStudentDocument,
  fetchStudentById,
  fetchStudentByEmail,
  fetchStudentPortalData,
};

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  school_id?: string;
  company_id?: string;
  is_admin?: boolean;
  [key: string]: any;
}

interface RoasterState {
  currentUser: User | null;
  currentSchool: User | null;
  studentData: any | null;
  tabs: { key: string; label: string; icon?: string }[];
  loading: boolean;
  submitLoading: boolean;
  error: string | null;
  theme: "dark" | "light";
  grades: any[];
}

const savedUser = loadLocalStorage<User | null>("currentUser", null);
const savedSchool = loadLocalStorage<User | null>("currentSchool", null);
const savedTheme =
  (localStorage.getItem("theme") as "dark" | "light") || "dark";

// Apply class to html tag immediately to prevent layout shifts
if (savedTheme === "dark") {
  document.documentElement.classList.add("dark-theme");
} else {
  document.documentElement.classList.remove("dark-theme");
}

const initialState: RoasterState = {
  currentUser: savedUser,
  currentSchool: savedSchool,
  studentData: null,
  tabs: getTabsForRole(
    savedUser?.role || savedSchool?.role,
    savedUser?.is_admin,
  ),
  loading: false,
  submitLoading: false,
  error: null,
  theme: savedTheme,
  grades: [],
};

const roasterSlice = createSlice({
  name: "roaster",
  initialState,
  reducers: {
    clearCurrentUser(state) {
      state.currentUser = null;
      state.currentSchool = null;
      state.studentData = null;
      state.tabs = getTabsForRole(undefined);
      localStorage.removeItem("currentUser");
      localStorage.removeItem("currentSchool");
    },
    setStudentUser(state, action) {
      const user = action.payload;
      state.currentUser = user;
      state.tabs = getTabsForRole("student");
      saveLocalStorage("currentUser", user);
    },
    setCurrentSchool(state, action) {
      const school = action.payload;
      state.currentSchool = school;
      saveLocalStorage("currentSchool", school);
    },
    setStudentDataState(state, action) {
      state.studentData = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    toggleTheme(state) {
      state.theme = state.theme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", state.theme);
      if (state.theme === "dark") {
        document.documentElement.classList.add("dark-theme");
      } else {
        document.documentElement.classList.remove("dark-theme");
      }
    },
  },
  extraReducers: (builder) => {
    buildRequestOTPCases(builder);
    buildLoginUserCases(builder);
    buildCreateTeacherCases(builder);
    buildFetchGradesCases(builder);
    buildCreateGradeStructureCases(builder);
    buildUpdateGradeStructureCases(builder);
    builder
      .addCase(uploadStudentDocument.pending, (state) => {
        state.submitLoading = true;
        state.error = null;
      })
      .addCase(uploadStudentDocument.fulfilled, (state, action) => {
        state.submitLoading = false;
        state.studentData = action.payload.updatedStudent;
        if (state.currentUser) {
          state.currentUser = {
            ...state.currentUser,
            ...action.payload.updatedStudent,
          };
          saveLocalStorage("currentUser", state.currentUser);
        }
      })
      .addCase(uploadStudentDocument.rejected, (state, action) => {
        state.submitLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteStudentDocument.pending, (state) => {
        state.submitLoading = true;
        state.error = null;
      })
      .addCase(deleteStudentDocument.fulfilled, (state, action) => {
        state.submitLoading = false;
        state.studentData = action.payload.updatedStudent;
        if (state.currentUser) {
          state.currentUser = {
            ...state.currentUser,
            ...action.payload.updatedStudent,
          };
          saveLocalStorage("currentUser", state.currentUser);
        }
      })
      .addCase(deleteStudentDocument.rejected, (state, action) => {
        state.submitLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSchoolById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchoolById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSchool = action.payload;
        saveLocalStorage("currentSchool", action.payload);
      })
      .addCase(fetchSchoolById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchStudentPortalData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentPortalData.fulfilled, (state, action) => {
        state.loading = false;
        state.studentData = action.payload.student;
        if (action.payload.school) {
          state.currentSchool = action.payload.school;
          saveLocalStorage("currentSchool", action.payload.school);
        }
      })
      .addCase(fetchStudentPortalData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchStudentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentById.fulfilled, (state, action) => {
        state.loading = false;
        state.studentData = action.payload;
      })
      .addCase(fetchStudentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchStudentByEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentByEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.studentData = action.payload;
      })
      .addCase(fetchStudentByEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearCurrentUser,
  setStudentUser,
  setCurrentSchool,
  setStudentDataState,
  clearError,
  toggleTheme,
} = roasterSlice.actions;
export default roasterSlice.reducer;
