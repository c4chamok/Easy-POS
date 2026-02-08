import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../auth/DTO/auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class UsersService {
  constructor(
    private dbClient: PrismaService,
    private redis: RedisService,
  ) {}

  async findUserById(userId: string) {
    // add cache feature
    const userFromRedis = await this.redis.getRedis(`user:${userId}`);
    if (userFromRedis) return userFromRedis;
    const userFromDb = await this.dbClient.user.findUnique({
      where: { id: userId },
      select: {
        password: false,
        email: true,
        id: true,
        fullName: true,
        role: true,
      },
    });
    await this.redis.setRedis(`user:${userId}`, userFromDb);
    return userFromDb;
  }

  async findUserByEmail(userEmail: string) {
    return this.dbClient.user.findUnique({
      where: { email: userEmail },
      select: {
        password: true,
        email: true,
        id: true,
        fullName: true,
        role: true,
      },
    });
  }

  async ListUsers() {
    return this.dbClient.user.findMany({
      select: { password: false, email: true, id: true },
    });
  }

  async createUser(dto: RegisterDto) {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(dto.password, salt);

    return this.dbClient.user.create({
      data: {
        email: dto.email,
        password: hashedPass,
        fullName: dto.fullName,
      },
      select: { password: false, email: true, id: true },
    });
  }
}
