import type { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import {
  requestOTP,
  loginUser,
  createTeacher,
} from "../../repository/roaster/roasterThunks";
import { setCookie } from "../../helpers/cookies";
import { saveLocalStorage } from "../../helpers/storage";

export const getTabsForRole = (role?: string, isAdmin?: boolean) => {
  const normalizedRole = role?.toLowerCase();
  if (normalizedRole === "school") {
    return [
      { key: "dashboard", label: "Dashboard", icon: "dashboard" },
      { key: "onboarding", label: "Onboarding", icon: "onboarding" },
      { key: "teachers", label: "Teachers", icon: "teachers" },
      { key: "students", label: "Students", icon: "students" },
      { key: "academic", label: "Academic", icon: "academic" },
      { key: "events", label: "Events", icon: "events" },
    ];
  }
  if (normalizedRole === "student") {
    return [
      { key: "dashboard", label: "Dashboard", icon: "dashboard" },
      { key: "classes", label: "Classes", icon: "classes" },
    ];
  }
  if (normalizedRole === "teacher") {
    const tabs = [
      { key: "dashboard", label: "Dashboard", icon: "dashboard" },
      { key: "classes", label: "Classes", icon: "classes" },
    ];
    if (isAdmin) {
      tabs.splice(1, 0, {
        key: "onboarding",
        label: "Onboarding",
        icon: "onboarding",
      });
    }
    return tabs;
  }
  return [
    { key: "dashboard", label: "Dashboard", icon: "dashboard" },
    { key: "onboarding", label: "Onboarding", icon: "onboarding" },
    { key: "classes", label: "Classes", icon: "classes" },
  ];
};

export const buildRequestOTPCases = (builder: ActionReducerMapBuilder<any>) => {
  builder
    .addCase(requestOTP.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(requestOTP.fulfilled, (state) => {
      state.loading = false;
    })
    .addCase(requestOTP.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
};

export const buildLoginUserCases = (builder: ActionReducerMapBuilder<any>) => {
  builder
    .addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      const user = action.payload.user;
      if (user.role === "school") {
        state.currentUser = null;
        state.currentSchool = user;
      } else {
        state.currentUser = user;
        state.currentSchool = null;
      }
      state.tabs = getTabsForRole(user.role, user.is_admin);
      setCookie("token", action.payload.token, 1);
      saveLocalStorage("currentUser", state.currentUser);
      saveLocalStorage("currentSchool", state.currentSchool);
    })
    .addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
};

export const buildCreateTeacherCases = (
  builder: ActionReducerMapBuilder<any>,
) => {
  builder
    .addCase(createTeacher.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(createTeacher.fulfilled, (state) => {
      state.loading = false;
    })
    .addCase(createTeacher.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
};
