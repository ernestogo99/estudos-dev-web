import { PartialType } from '@nestjs/swagger';
import { CreateLlmDto } from './create-llm.dto';

export class UpdateLlmDto extends PartialType(CreateLlmDto) {}
