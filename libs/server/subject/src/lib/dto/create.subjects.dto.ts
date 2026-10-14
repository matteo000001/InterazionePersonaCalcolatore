import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateSubjectDto {
  @ApiProperty({
    example: 'Analisi 1',
    description: 'Name of the subject taught by the teacher',
  })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({
    example: 1,
    description: 'Numeric id of the teacher assigned to the subject',
  })
  @IsInt()
  @Min(1)
  teacherId!: number;

  @ApiProperty({
    example: ['ingeInf', 'eco'],
    description: 'Degree programs in which the subject is taught',
    isArray: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @MinLength(2, { each: true })
  degreeProgramIds!: string[];

  @ApiProperty({
    example: 'year-2',
    description: 'Course year in which the subject is taught',
  })
  @IsString()
  @MinLength(2)
  courseYearId!: string;
}
