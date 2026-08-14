import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OcrService } from './ocr.service';
import { CreateOcrDto } from './dto/create-ocr.dto';
import { UpdateOcrDto } from './dto/update-ocr.dto';

@Controller('ocr')
export class OcrController {
  constructor(private readonly ocrService: OcrService) {}

  @Post()
  create(@Body() createOcrDto: CreateOcrDto) {
    return this.ocrService.create(createOcrDto);
  }

  @Get()
  findAll() {
    return this.ocrService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ocrService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOcrDto: UpdateOcrDto) {
    return this.ocrService.update(+id, updateOcrDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ocrService.remove(+id);
  }
}
