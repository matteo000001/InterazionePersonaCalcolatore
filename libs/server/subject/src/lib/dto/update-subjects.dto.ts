import { PartialType } from '@nestjs/swagger';
import { CreateSubjectDto } from './create.subjects.dto';

export class UpdateSubjectDto extends PartialType(CreateSubjectDto) {}
