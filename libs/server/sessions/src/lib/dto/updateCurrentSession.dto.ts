import { PartialType } from '@nestjs/swagger';
import { UpsertCurrentSessionDto } from './upsert-current-session.dto';

export class UpdateCurrentSessionDto extends PartialType(UpsertCurrentSessionDto) {}