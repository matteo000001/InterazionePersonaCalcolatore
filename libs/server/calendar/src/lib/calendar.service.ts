import { Injectable } from '@nestjs/common';
import { CalendarAvailabilityDay } from '@exam-planner/shared-types';
import {
  enumerateDates,
  isHoliday,
  isWeekend,
  today,
} from '@exam-planner/shared-utils';
import { AppointmentsService } from '@exam-planner/server-appointments';
import { CatalogService } from '@exam-planner/server-catalog';
import { SessionsService } from '@exam-planner/server-sessions';

@Injectable()
export class CalendarService {
  constructor(
    private readonly appointmentsService: AppointmentsService,
    private readonly catalogService: CatalogService,
    private readonly sessionsService: SessionsService
  ) {}

  async getAvailability(degreeProgramId: string, courseYearId: string) {
    this.catalogService.ensureDegreeProgramExists(degreeProgramId);
    this.catalogService.ensureCourseYearExists(courseYearId);

    const session = await this.sessionsService.getCurrent();
    const appointments = await this.appointmentsService.list({
      degreeProgramId,
      courseYearId,
    });
    const planningOpen = await this.sessionsService.isPlanningOpen(today);

    return enumerateDates(session.sessionStart, session.sessionEnd).map(
      (date): CalendarAvailabilityDay => {
        const appointmentsForDate = appointments.filter(
          (appointment) => appointment.examDate === date
        );

        if (isWeekend(date)) {
          return {
            date,
            status: 'weekend',
            isSelectable: false,
            isPlanningOpen: planningOpen,
            reason: 'Weekend',
            appointments: appointmentsForDate,
          };
        }

        if (isHoliday(date, session.excludedHolidayDates)) {
          return {
            date,
            status: 'holiday',
            isSelectable: false,
            isPlanningOpen: planningOpen,
            reason: 'Holiday',
            appointments: appointmentsForDate,
          };
        }

        if (!planningOpen) {
          return {
            date,
            status: 'outside-planning-window',
            isSelectable: false,
            isPlanningOpen: false,
            reason: 'Planning window closed',
            appointments: appointmentsForDate,
          };
        }

        if (appointmentsForDate.length > 0) {
          return {
            date,
            status: 'occupied',
            isSelectable: false,
            isPlanningOpen: planningOpen,
            reason: 'Date already occupied',
            appointments: appointmentsForDate,
          };
        }

        return {
          date,
          status: 'available',
          isSelectable: true,
          isPlanningOpen: planningOpen,
          appointments: appointmentsForDate,
        };
      }
    );
  }
}
