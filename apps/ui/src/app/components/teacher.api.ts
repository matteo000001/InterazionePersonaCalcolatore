import {
  CalendarAvailabilityDay,
  ExamAppointment,
  Subject,
} from '@exam-planner/shared-types';
import { handleApiError } from '../shared/utils.api';

const API_URL = 'http://localhost:3333/api';

type AppointmentMutationBody = {
  subjectId: number;
  degreeProgramId: string;
  examDate: string;
  notes?: string;
};

type TeacherFilters = {
  degreeProgramId: string;
  courseYearId: string;
};

function getAuthHeaders() {
  const token = localStorage.getItem('access_token');

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchTeacherAppointments(
  filters: TeacherFilters
): Promise<ExamAppointment[]> {
  const searchParams = new URLSearchParams({
    degreeProgramId: filters.degreeProgramId,
    courseYearId: filters.courseYearId,
  });
  const response = await fetch(
    `${API_URL}/appointments?${searchParams.toString()}`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    await handleApiError(response);
  }

  return response.json();
}

export async function fetchTeacherAvailability(
  degreeProgramId: string,
  courseYearId: string
): Promise<CalendarAvailabilityDay[]> {
  const response = await fetch(
    `${API_URL}/calendar/availability?degreeProgramId=${degreeProgramId}&courseYearId=${courseYearId}`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    await handleApiError(response);
  }

  return response.json();
}

export async function fetchTeacherSubjects(filters: {
  teacherId: number;
  degreeProgramId: string;
}): Promise<Subject[]> {
  const searchParams = new URLSearchParams({
    teacherId: String(filters.teacherId),
    degreeProgramId: filters.degreeProgramId,
  });
  const response = await fetch(
    `${API_URL}/subjects?${searchParams.toString()}`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    await handleApiError(response);
  }

  return response.json();
}

export async function createTeacherAppointment(
  payload: AppointmentMutationBody
): Promise<ExamAppointment> {
  const response = await fetch(`${API_URL}/appointments`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    await handleApiError(response);
  }

  return response.json();
}

export async function updateTeacherAppointment(
  appointmentId: string,
  payload: Partial<AppointmentMutationBody>
): Promise<ExamAppointment> {
  const response = await fetch(`${API_URL}/appointments/${appointmentId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    await handleApiError(response);
  }

  return response.json();
}

export async function deleteTeacherAppointment(
  appointmentId: string
): Promise<void> {
  const response = await fetch(`${API_URL}/appointments/${appointmentId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    await handleApiError(response);
  }
}
