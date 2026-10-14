import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from '@exam-planner/shared-types';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from '@exam-planner/server-security';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard, RolesGuard } from '@exam-planner/server-security';
import { CurrentUser} from '@exam-planner/server-security';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard,RolesGuard)
  @ApiBearerAuth()
  @Roles(UserRole.SECRETARY)
  @ApiOkResponse({ description: 'Returns all users or filters them by role.' })
  @ApiQuery({
    name: 'role',
    required: false,
    enum: UserRole,
  })
  getUsers(@Query('role') role?: UserRole) {
    return this.usersService.getUsers(role);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Returns the authenticated JWT user.' })
  getMe(@CurrentUser() user: unknown) {
    return user;
  }

  @Post()
  @Roles(UserRole.SECRETARY)
  @UseGuards(JwtAuthGuard,RolesGuard)
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Marco Rossi',
        },
        email: {
          type: 'string',
          example: 'marcorossi@icloud.com',
        },
        password: {
          type: 'string', 
          example: 'Password1!'},
        role: {
          type: 'string',
          enum: [UserRole.TEACHER, UserRole.SECRETARY],
          example: 'teacher | secretary',
        },
        managedDegreeProgramIds: {
          type: 'array',
          items: { type: 'string' },
          example: ['ingeInf'],
        },
      },
      required: ['name', 'email','password', 'role'],
    },
  })
  @ApiCreatedResponse({
    description: 'Creates a new user with role teacher or secretary.',
  })
  create(@Body(ValidationPipe) user: CreateUserDto) {
    return this.usersService.create(user);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Marco Rossi' },
        email: { type: 'string', example: 'marcorossi@icloud.com' },
        role: {
          type: 'string',
          enum: [UserRole.TEACHER, UserRole.SECRETARY],
          example: UserRole.TEACHER,
        },
        managedDegreeProgramIds: {
          type: 'array',
          items: { type: 'string' },
          example: ['ingeInf'],
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Updates the selected teacher or secretary by numeric id.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) user: UpdateUserDto
  ) {
    return this.usersService.update(id, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Deletes the selected teacher or secretary by numeric id.',
  })
  removeUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.removeUser(id);
  }
}
