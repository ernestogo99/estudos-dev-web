import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const encryptedPassword = await hash(createUserDto.password, 10);
    const userCreated = this.prismaService.users.create({
      data: { ...createUserDto, password: encryptedPassword },
    });
    return userCreated;
  }

  async findByEmail(email: string) {
    return this.prismaService.users.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        documents: true,
      },
    });
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    const user = await this.prismaService.users.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        documents: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }
}
