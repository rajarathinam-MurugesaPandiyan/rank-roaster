import { createSlice } from "@reduxjs/toolkit";
import { loadLocalStorage } from "../../helpers/storage";
import {
  getTabsForRole,
  buildRequestOTPCases,
  buildLoginUserCases,
  buildCreateTeacherCases,
  buildFetchGradesCases,
  buildCreateGradeStructureCases,
  buildUpdateGradeStructureCases,
} from "./roasterReducer";

export {
  requestOTP,
  loginUser,
  createTeacher,
  fetchGradesBySchool,
  createGradeStructure,
  updateGradeStructure,
} from "../../repository/roaster/roasterThunks";

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
if (savedTheme === "light") {
  document.documentElement.classList.add("light-theme");
} else {
  document.documentElement.classList.remove("light-theme");
}

const initialState: RoasterState = {
  currentUser: savedUser,
  currentSchool: savedSchool,
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
      state.tabs = getTabsForRole(undefined);
      localStorage.removeItem("currentUser");
      localStorage.removeItem("currentSchool");
    },
    clearError(state) {
      state.error = null;
    },
    toggleTheme(state) {
      state.theme = state.theme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", state.theme);
      if (state.theme === "light") {
        document.documentElement.classList.add("light-theme");
      } else {
        document.documentElement.classList.remove("light-theme");
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
  },
});

export const { clearCurrentUser, clearError, toggleTheme } =
  roasterSlice.actions;
export default roasterSlice.reducer;
