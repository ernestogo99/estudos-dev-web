import { PartialType } from '@nestjs/swagger';
import { CreateOcrDto } from './create-ocr.dto';

export class UpdateOcrDto extends PartialType(CreateOcrDto) {}
