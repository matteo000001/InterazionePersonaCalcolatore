import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import type { AuthenticatedUser } from './interfaces/authenticated-user.interface';
import { LocalAuthGuard } from './guards/local-auth.guards';
import { UserRole } from '@exam-planner/shared-types';


type RequestWithUser = Request & {
  user: AuthenticatedUser;
};

@ApiTags('Auth APIs')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({
          schema: {
              type: 'object',
              properties: {
                  email: { type: 'string', example: 'lucaferri@icloud.com' },
                  password: {type: 'string', example: 'Password1!'}
              },
              required: ['email', 'password'],
          },
  })
  login(@Request() req: RequestWithUser) {
    return this.authService.login(req.user);
  }


  @Post('register')
  @ApiBody({
          schema: {
              type: 'object',
              properties: {
                  name: { type: 'string', example: 'marco rossi' },
                  email: { type: 'string', example: 'marcorossi@icloud.com' },
                  password: {type: 'string', example: 'Password1!'},
                  role: { type: 'string', enum: Object.values(UserRole), example: UserRole.TEACHER}
              },
              required: ['name', 'email', 'password', 'role'],
          },
  })
  register(@Body(ValidationPipe) dto: RegisterDto) {
    return this.authService.register(dto);
  }
}
