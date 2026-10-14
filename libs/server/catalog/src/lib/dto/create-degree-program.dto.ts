import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateDegreeProgramDto {
  @ApiProperty({
    example: 'ingInf',
    description: 'Technical identifier of the degree program',
  })
  @IsString()
  @MinLength(2)
  id!: string;

  @ApiProperty({
    example: 'L-31',
    description: 'Official degree code',
  })
  @IsString()
  @MinLength(2)
  code!: string;

  @ApiProperty({
    example: 'Ingegneria Informatica',
    description: 'Display name of the degree program',
  })
  @IsString()
  @MinLength(3)
  name!: string;
}
