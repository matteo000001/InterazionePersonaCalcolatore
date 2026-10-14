import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  ValidationPipe,
  UseGuards

} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create.subjects.dto';
import { UpdateSubjectDto } from './dto/update-subjects.dto';
import { JwtAuthGuard, RolesGuard, Roles } from '@exam-planner/server-security';
import { UserRole } from '@exam-planner/shared-types';

@ApiTags('subjects')
@Controller('subjects')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOkResponse({ description: 'Returns subjects for the selected filters.' })
  @ApiQuery({
    name: 'teacherId',
    required: false,
    description: 'Optional teacher filter.',
  })
  @ApiQuery({
    name: 'degreeProgramId',
    required: false,
    description: 'Optional degree program filter.',
  })
  @ApiQuery({
    name: 'courseYearId',
    required: false,
    description: 'Optional course year filter.',
  })
  list(
    @Query('teacherId') teacherId?: string,
    @Query('degreeProgramId') degreeProgramId?: string,
    @Query('courseYearId') courseYearId?: string
  ) {
    return this.subjectService.list({
      ...(teacherId ? { teacherId: Number(teacherId) } : {}),
      ...(degreeProgramId ? { degreeProgramId } : {}),
      ...(courseYearId ? { courseYearId } : {}),
    });
  }

  @ApiBearerAuth()
  @Roles(UserRole.SECRETARY)
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Analisi 1',
        },
        teacherId: {
          type: 'number',
          example: 1,
        },
        degreeProgramIds: {
          type: 'array',
          items: { type: 'string' },
          example: ['ingeInf', 'eco'],
        },
        courseYearId: {
          type: 'string',
          example: 'year-2',
        },
      },
      required: ['name', 'teacherId', 'degreeProgramIds', 'courseYearId'],
    },
  })
  @ApiCreatedResponse({ description: 'Creates a new subject.' })
  create(@Body(ValidationPipe) dto: CreateSubjectDto) {
    return this.subjectService.create(dto);
  }

  
  @ApiBearerAuth()
  @Roles(UserRole.SECRETARY)
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Patch(':id')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Analisi 1',
        },
        teacherId: {
          type: 'number',
          example: 1,
        },
        degreeProgramIds: {
          type: 'array',
          items: { type: 'string' },
          example: ['ingeInf', 'eco'],
        },
        courseYearId: {
          type: 'string',
          example: 'year-2',
        },
      },
    },
  })
  @ApiOkResponse({ description: 'Updates a subject.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) dto: UpdateSubjectDto
  ) {
    return this.subjectService.update(id, dto);
  }


  @ApiBearerAuth()
  @Roles(UserRole.SECRETARY)
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Delete(':id')
  @ApiOkResponse({ description: 'Deletes a subject.' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.subjectService.delete(id);
  }
}
