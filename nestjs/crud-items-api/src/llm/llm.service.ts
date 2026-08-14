import { Injectable } from '@nestjs/common';
import { CreateLlmDto } from './dto/create-llm.dto';
import { UpdateLlmDto } from './dto/update-llm.dto';

@Injectable()
export class LlmService {
  create(createLlmDto: CreateLlmDto) {
    return 'This action adds a new llm';
  }

  findAll() {
    return `This action returns all llm`;
  }

  findOne(id: number) {
    return `This action returns a #${id} llm`;
  }

  update(id: number, updateLlmDto: UpdateLlmDto) {
    return `This action updates a #${id} llm`;
  }

  remove(id: number) {
    return `This action removes a #${id} llm`;
  }
}
