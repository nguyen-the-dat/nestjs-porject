import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  NotFoundException,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
//import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { privateDecrypt } from 'crypto';
@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
    @Inject(AuthService) private readonly authService: AuthService,
  ) {}

  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    return this.authService.signup(body.email, body.password);
  }

  // @UseInterceptors(new SerializeInterceptor(UserDto))
  //@Serialize(UserDto)
  @Get('/:id')
  async getUserById(@Param('id') id: string) {
    console.log('handler is running');
    const user = await this.usersService.findUserById(parseInt(id));
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return user;
  }

  @Get()
  getAllUsersByEmail(@Query('email') email: string) {
    return this.usersService.findUserByEmail(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }
}
