import type { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import {
  requestOTP,
  loginUser,
  createTeacher,
  fetchGradesBySchool,
  createGradeStructure,
  updateGradeStructure,
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
      { key: "fees", label: "Fees", icon: "fees" },
      { key: "academic", label: "Academic", icon: "academic" },
      { key: "events", label: "Events", icon: "events" },
      { key: "grades", label: "Grades", icon: "grades" },
    ];
  }
  if (normalizedRole === "student") {
    return [
      { key: "profile", label: "Profile", icon: "profile" },
      { key: "documents", label: "Documents", icon: "academic" },
      { key: "results", label: "Results", icon: "results" },
      { key: "awards", label: "Awards", icon: "awards" },
      { key: "permissions", label: "Permissions", icon: "permissions" },
      { key: "attendance", label: "Attendance", icon: "attendance" },
      { key: "payments", label: "Payments", icon: "payments" },
      { key: "feedback", label: "Feedback", icon: "feedback" },
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
    { key: "teachers", label: "Teachers", icon: "teachers" },
    { key: "students", label: "Students", icon: "students" },
    { key: "fees", label: "Fees", icon: "fees" },
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

export const buildFetchGradesCases = (
  builder: ActionReducerMapBuilder<any>,
) => {
  builder
    .addCase(fetchGradesBySchool.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchGradesBySchool.fulfilled, (state, action) => {
      state.loading = false;
      state.grades = action.payload || [];
    })
    .addCase(fetchGradesBySchool.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
};

export const buildCreateGradeStructureCases = (
  builder: ActionReducerMapBuilder<any>,
) => {
  builder
    .addCase(createGradeStructure.pending, (state) => {
      state.submitLoading = true;
      state.error = null;
    })
    .addCase(createGradeStructure.fulfilled, (state) => {
      state.submitLoading = false;
    })
    .addCase(createGradeStructure.rejected, (state, action) => {
      state.submitLoading = false;
      state.error = action.payload as string;
    });
};

export const buildUpdateGradeStructureCases = (
  builder: ActionReducerMapBuilder<any>,
) => {
  builder
    .addCase(updateGradeStructure.pending, (state) => {
      state.submitLoading = true;
      state.error = null;
    })
    .addCase(updateGradeStructure.fulfilled, (state) => {
      state.submitLoading = false;
    })
    .addCase(updateGradeStructure.rejected, (state, action) => {
      state.submitLoading = false;
      state.error = action.payload as string;
    });
};
