import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseDTO } from './dto/auth-response-dto';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  private jwtExpirationTimeInSeconds: number;

  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtExpirationTimeInSeconds = this.configService.get<number>(
      'JWT_EXPIRATION_TIME',
    )!;
  }

  async signIn(createAuthDto: CreateAuthDto): Promise<AuthResponseDTO> {
    const foundUser = await this.userService.findByEmail(createAuthDto.email);

    if (!foundUser) {
      throw new UnauthorizedException();
    }

    const payload = { sub: foundUser.id, email: foundUser.email };

    const token = this.jwtService.sign(payload);

    return { token, expiresIn: this.jwtExpirationTimeInSeconds };
  }
}
