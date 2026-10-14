import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsDateString,
  IsOptional,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'sessionWindowOrder', async: false })
class SessionWindowOrderValidator implements ValidatorConstraintInterface {
  validate(_value: string, args?: ValidationArguments) {
    const dto = args?.object as UpsertCurrentSessionDto;
    return (
      dto.sessionStart <= dto.sessionEnd &&
      dto.planningStart <= dto.planningEnd &&
      dto.planningEnd < dto.sessionStart
    );
  }

  defaultMessage() {
    return 'The planning period must end before the exam session starts';
  }
}

export class UpsertCurrentSessionDto {
  @ApiProperty()
  @IsDateString()
  @Validate(SessionWindowOrderValidator)
  sessionStart!: string;

  @ApiProperty()
  @IsDateString()
  sessionEnd!: string;

  @ApiProperty()
  @IsDateString()
  planningStart!: string;

  @ApiProperty()
  @IsDateString()
  planningEnd!: string;

  @ApiProperty({
    required: false,
    type: [String],
    example: ['2026-04-25', '2026-05-01'],
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsDateString({}, { each: true })
  excludedHolidayDates?: string[];
}
