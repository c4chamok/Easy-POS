import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { AuthenticatedRequest } from '../auth/auth.interface';

@Controller('api/users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  async getCurrentUser(@Request() req: AuthenticatedRequest) {
    // console.log(req.user);
    return {
      success: true,
      user: await this.userService.findUserById(req.user.uid),
    };
  }
}
