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
  Session,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import {
  Serialize,
  SerializeInterceptor,
} from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { privateDecrypt } from 'crypto';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
    @Inject(AuthService) private readonly authService: AuthService,
  ) {}

  // @Get('/colors/:color')
  // setColor(@Param('color') color: string, @Session() session: any) {
  //   session.color = color;
  // }

  // @Get('/colors')
  // getColor(@Session() session: any) {
  //   return session.color;
  // }

  // @Get('/whoami')
  // whoAmI(@Session() session: any) {
  //   return this.usersService.findUserById(session.userId);
  // }

  @Get('/whoami')
  whoAmI(@CurrentUser() user: string) {
    //  return this.usersService.findUserById(session.userId);
    return user;
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signIn(@Body() body: CreateUserDto, @Session() session: any) {
    const user = this.authService.signin(body.email, body.password);
    session.userId = (await user).id;
    return user;
  }

  @Post('signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @UseInterceptors(new SerializeInterceptor(UserDto))
  // @Serialize(UserDto)
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
