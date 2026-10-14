import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({
    example: 1,
    description: 'Subject/materia associated with the exam appointment',
  })
  @IsInt()
  @Min(1)
  subjectId!: number;

  @ApiProperty({
    example: 'ingeInf',
    description: 'Degree program selected for this appointment',
  })
  @IsString()
  degreeProgramId!: string;

  @ApiPropertyOptional({
    description: 'Deprecated: inferred from subjectId by the backend',
  })
  @IsOptional()
  @IsString()
  courseYearId?: string;

  @ApiProperty()
  @IsDateString()
  examDate!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(250)
  notes?: string;
}
