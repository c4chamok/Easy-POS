import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, RegisterDto } from './DTO/auth.dto';
import { Response } from 'express';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Body() dto: RegisterDto) {
    return this.authService.signUp(dto);
  }
  @Post('signin')
  async signIn(@Body() dto: AuthDto, @Res() res: Response) {
    const { access_token, ...rest } = await this.authService.signIn(dto);
    console.log(process.env.NODE_ENV === 'production' ? 'none' : 'lax');
    return res
      .cookie('access_token', access_token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 1000 * 60 * 60 * 24,
      })
      .json(rest);
  }
  @Get('signout')
  userLogout(@Res() res: Response) {
    return res.clearCookie('access_token').json({ success: true });
  }
}
