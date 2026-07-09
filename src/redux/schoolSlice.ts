import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { loadLocalStorage, saveLocalStorage } from "../helpers/storage";

export interface DocumentItem {
  name: string;
  url: string;
  type?: string;
}

export interface Student {
  id: string;
  name: string;
  role: "Student" | "Teacher" | "Staff";
  grade: string;
  email: string;
  status: "Pending" | "Verified" | "Enrolled";
  date: string;
  documents?: DocumentItem[];
  experience?: string;
  qualification?: string;
  subject?: string;
  department?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  dob?: string;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  altPhone?: string;
}

export interface ClassItem {
  id: string;
  className: string;
  grade: string;
  teacher: string;
  studentsCount: number;
  schedule: string;
}

export interface SubjectItem {
  name: string;
  teacherId: string;
  teacherName: string;
}

export interface GradeStructureItem {
  id: string;
  gradeName: string;
  fees: number;
  subjects: SubjectItem[];
}

interface SchoolState {
  activeSchool: string;
  students: Student[];
  classes: ClassItem[];
  gradesList: GradeStructureItem[];
}

const INITIAL_STUDENTS: Student[] = [
  {
    id: "1",
    name: "Sophia Martinez",
    role: "Student",
    grade: "Grade 10",
    email: "sophia.m@school.edu",
    status: "Enrolled",
    date: "2026-06-05",
  },
  {
    id: "2",
    name: "Marcus Vance",
    role: "Student",
    grade: "Grade 11",
    email: "marcus.v@school.edu",
    status: "Verified",
    date: "2026-06-06",
  },
  {
    id: "3",
    name: "Dr. Sarah Jenkins",
    role: "Teacher",
    grade: "Grade 12",
    email: "s.jenkins@school.edu",
    status: "Enrolled",
    date: "2026-06-04",
  },
  {
    id: "4",
    name: "Ethan Hunt",
    role: "Student",
    grade: "Grade 9",
    email: "ethan.h@school.edu",
    status: "Pending",
    date: "2026-06-07",
  },
];

const INITIAL_CLASSES: ClassItem[] = [
  {
    id: "1",
    className: "Algebra II & Trigonometry",
    grade: "Grade 10",
    teacher: "Dr. Sarah Jenkins",
    studentsCount: 28,
    schedule: "Mon/Wed 09:00 AM",
  },
  {
    id: "2",
    className: "AP Chemistry (Lab)",
    grade: "Grade 12",
    teacher: "Prof. Robert Boyle",
    studentsCount: 15,
    schedule: "Tue/Thu 11:00 AM",
  },
  {
    id: "3",
    className: "World History: Medieval Era",
    grade: "Grade 9",
    teacher: "Ms. Elizabeth Tudor",
    studentsCount: 22,
    schedule: "Mon/Wed/Fri 01:30 PM",
  },
  {
    id: "4",
    className: "Advanced Literature & Writing",
    grade: "Grade 11",
    teacher: "Mr. John Keats",
    studentsCount: 19,
    schedule: "Fri 10:00 AM",
  },
];

const INITIAL_GRADES_LIST: GradeStructureItem[] = [
  {
    id: "g1",
    gradeName: "Grade 10",
    fees: 15000,
    subjects: [
      { name: "Mathematics", teacherId: "t1", teacherName: "Dr. Sarah Jenkins" },
      { name: "Physics", teacherId: "t2", teacherName: "Prof. Robert Boyle" },
    ],
  },
  {
    id: "g2",
    gradeName: "Grade 11",
    fees: 18000,
    subjects: [
      { name: "Chemistry", teacherId: "t2", teacherName: "Prof. Robert Boyle" },
      { name: "English Literature", teacherId: "t3", teacherName: "Mr. John Keats" },
    ],
  },
];

const initialState: SchoolState = {
  activeSchool: "",
  students: [],
  classes: [],
  gradesList: [],
};

const schoolSlice = createSlice({
  name: "school",
  initialState,
  reducers: {
    initializeSchool(state, action: PayloadAction<string>) {
      const schoolId = action.payload;
      state.activeSchool = schoolId;

      // Load specific school students/classes/grades from localStorage
      const studentsKey = `school_${schoolId}_students`;
      const classesKey = `school_${schoolId}_classes`;
      const gradesKey = `school_${schoolId}_grades`;

      const savedStudents = loadLocalStorage<Student[] | null>(
        studentsKey,
        null,
      );
      if (savedStudents) {
        state.students = savedStudents;
      } else {
        state.students = INITIAL_STUDENTS;
        saveLocalStorage(studentsKey, INITIAL_STUDENTS);
      }

      const savedClasses = loadLocalStorage<ClassItem[] | null>(
        classesKey,
        null,
      );
      if (savedClasses) {
        state.classes = savedClasses;
      } else {
        state.classes = INITIAL_CLASSES;
        saveLocalStorage(classesKey, INITIAL_CLASSES);
      }

      const savedGrades = loadLocalStorage<GradeStructureItem[] | null>(
        gradesKey,
        null,
      );
      if (savedGrades) {
        state.gradesList = savedGrades;
      } else {
        state.gradesList = INITIAL_GRADES_LIST;
        saveLocalStorage(gradesKey, INITIAL_GRADES_LIST);
      }
    },
    addStudent(state, action: PayloadAction<Omit<Student, "id" | "date">>) {
      const newStudent: Student = {
        ...action.payload,
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString().split("T")[0],
      };
      state.students.unshift(newStudent);
      saveLocalStorage(`school_${state.activeSchool}_students`, state.students);
    },
    addClass(
      state,
      action: PayloadAction<Omit<ClassItem, "id" | "studentsCount">>,
    ) {
      const newClass: ClassItem = {
        ...action.payload,
        id: Math.random().toString(36).substr(2, 9),
        studentsCount: 0,
      };
      state.classes.push(newClass);
      saveLocalStorage(`school_${state.activeSchool}_classes`, state.classes);
    },
    addGradeStructure(
      state,
      action: PayloadAction<Omit<GradeStructureItem, "id">>,
    ) {
      const newGrade: GradeStructureItem = {
        ...action.payload,
        id: Math.random().toString(36).substr(2, 9),
      };
      state.gradesList.push(newGrade);
      saveLocalStorage(`school_${state.activeSchool}_grades`, state.gradesList);
    },
  },
});

export const { initializeSchool, addStudent, addClass, addGradeStructure } = schoolSlice.actions;
export default schoolSlice.reducer;

export const GRADES = [
  "LKG",
  "UKG",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
];
