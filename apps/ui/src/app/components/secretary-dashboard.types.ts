import {
  CourseYear,
  DegreeProgram,
  ExamSession,
  UserRole,
} from '@exam-planner/shared-types';

export type SessionFormState = Omit<ExamSession, 'id'>;
export type SecretaryMenuItem =
  | 'home'
  | 'users'
  | 'subjects'
  | 'degree-programs'
  | 'appointments';

export type UserFormState = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  managedDegreeProgramIds: string[];
};

export type SubjectFormState = {
  name: string;
  teacherId: number | '';
  degreeProgramIds: string[];
  courseYearId: string;
};

export type DegreeProgramType = 'triennale' | 'magistrale';
export type DegreeProgramYearCount = 2 | 3;

export type DegreeProgramFormState = {
  id: string;
  code: string;
  name: string;
  type: DegreeProgramType;
};

export type AppointmentSearchState = {
  degreeProgramId: string;
  courseYearId: string;
  teacherId: number | '';
  subjectId: number | '';
};

export const defaultSessionForm: SessionFormState = {
  sessionStart: '',
  sessionEnd: '',
  planningStart: '',
  planningEnd: '',
  excludedHolidayDates: [],
};

export const defaultUserForm: UserFormState = {
  name: '',
  email: '',
  password: '',
  role: UserRole.TEACHER,
  managedDegreeProgramIds: [],
};

export const defaultSubjectForm: SubjectFormState = {
  name: '',
  teacherId: '',
  degreeProgramIds: [],
  courseYearId: '',
};

export const defaultDegreeProgramForm: DegreeProgramFormState = {
  id: '',
  code: '',
  name: '',
  type: 'triennale',
};

export const defaultAppointmentSearch: AppointmentSearchState = {
  degreeProgramId: '',
  courseYearId: '',
  teacherId: '',
  subjectId: '',
};

export const DEGREE_PROGRAM_YEARS_KEY = 'exam-planner-degree-program-years';

export function getStoredDegreeProgramYears(): Record<
  string,
  DegreeProgramYearCount
> {
  const storedValue = localStorage.getItem(DEGREE_PROGRAM_YEARS_KEY);

  if (!storedValue) {
    return {};
  }

  try {
    return JSON.parse(storedValue) as Record<string, DegreeProgramYearCount>;
  } catch {
    return {};
  }
}

export function getDegreeProgramDuration(type: DegreeProgramType) {
  return type === 'triennale' ? 3 : 2;
}

export function getDegreeProgramTypeLabel(
  program: DegreeProgram,
  degreeProgramYears: Record<string, DegreeProgramYearCount>
) {
  const years = degreeProgramYears[program.id];

  if (years === 3) {
    return 'Laurea triennale';
  }

  if (years === 2) {
    return 'Laurea magistrale';
  }

  return 'Anni non assegnati';
}

export function getSubjectMaxCourseYear(
  degreeProgramIds: string[],
  courseYears: CourseYear[],
  degreeProgramYears: Record<string, DegreeProgramYearCount>
) {
  if (degreeProgramIds.length === 0) {
    return undefined;
  }

  const maxConfiguredYear = Math.max(...courseYears.map((year) => year.year));
  const selectedYearCounts = degreeProgramIds.map(
    (degreeProgramId) => degreeProgramYears[degreeProgramId] ?? maxConfiguredYear
  );

  return Math.min(...selectedYearCounts);
}
