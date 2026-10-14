import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ListAppointmentsQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  degreeProgramId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  courseYearId?: string;
}
