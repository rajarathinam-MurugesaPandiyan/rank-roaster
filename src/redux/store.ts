import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import schoolReducer from "./schoolSlice";
import roasterReducer from "./roaster/roasterSlice";
import teachersReducer from "./teachers/teachersSlice";
import studentsReducer from "./students/studentsSlice";

export const store = configureStore({
  reducer: {
    school: schoolReducer,
    roaster: roasterReducer,
    teachers: teachersReducer,
    students: studentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Type-safe Redux hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
