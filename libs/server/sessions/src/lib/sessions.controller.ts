import { Body, Controller, Get, Patch, Post, ValidationPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@exam-planner/shared-types';
import { Roles,JwtAuthGuard,RolesGuard } from '@exam-planner/server-security';
import { UpsertCurrentSessionDto } from './dto/upsert-current-session.dto';
import { UpdateCurrentSessionDto } from './dto/updateCurrentSession.dto';
import { SessionsService } from './sessions.service';



@ApiTags('sessions')
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}


  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('current')
  @ApiOkResponse({ description: 'Returns the current exam session.' })
  getCurrent() {
    return this.sessionsService.getCurrent();
  }


  @ApiBearerAuth()
  @Roles(UserRole.SECRETARY)
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Post('current')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        sessionStart: {
          type: 'string',
          example: '2026-06-01',
        },
        sessionEnd: {
          type: 'string',
          example: '2026-06-30',
        },
        planningStart: {
          type: 'string',
          example: '2026-05-15',
        },
        planningEnd: {
          type: 'string',
          example: '2026-05-31',
        },
        excludedHolidayDates: {
          type: 'array',
          items: { type: 'string' },
          example: ['2026-06-02', '2026-06-24'],
        },
      },
      required: ['sessionStart', 'sessionEnd', 'planningStart', 'planningEnd'],
    },
  })
  @ApiCreatedResponse({
    description: 'Creates the current exam session configuration.',
  })
  createCurrent(@Body(ValidationPipe) dto: UpsertCurrentSessionDto) {
    return this.sessionsService.createCurrent(dto);
  }


  @ApiBearerAuth()
  @Roles(UserRole.SECRETARY)
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Patch('current')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        sessionStart: { type: 'string', example: '2026-06-01' },
        sessionEnd: { type: 'string', example: '2026-06-30' },
        planningStart: { type: 'string', example: '2026-05-15' },
        planningEnd: { type: 'string', example: '2026-05-31' },
        excludedHolidayDates: {
          type: 'array',
          items: { type: 'string' },
          example: ['2026-06-02', '2026-06-24'],
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Updates the current exam session configuration.',
  })
  updateCurrent(@Body(ValidationPipe) dto: UpdateCurrentSessionDto) {
    return this.sessionsService.updateCurrent(dto);
  }
}
