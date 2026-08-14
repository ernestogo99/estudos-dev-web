import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'joão@gmail.com',
  })
  @IsNotEmpty({ message: 'O campo email não pode estar vazio' })
  @IsString({ message: 'O campo email deve ser uma String' })
  email: string;
  @ApiProperty({
    description: 'Senha segura com 6 caracteres',
    example: 'SenhaSegura123',
    minLength: 6,
  })
  @IsNotEmpty({ message: 'O campo senha não pode estar vazio' })
  @IsString({ message: 'O campo senha deve ser uma String' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password: string;
}
