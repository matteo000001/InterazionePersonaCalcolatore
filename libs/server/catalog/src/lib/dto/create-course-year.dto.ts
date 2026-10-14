import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min, MinLength } from 'class-validator';

export class CreateCourseYearDto {
  @ApiProperty({
    example: 'year-3',
    description: 'Technical identifier of the course year',
  })
  @IsString()
  @MinLength(2)
  id!: string;

  @ApiProperty({
    example: 3,
    description: 'Numeric course year',
  })
  @IsInt()
  @Min(1)
  year!: number;
}
