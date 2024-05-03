import { UsersService } from './users.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
// scrypt : hasing function, randomBytes : generate random string

import { promisify } from 'util';

const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
  public constructor(private usersService: UsersService) {}

  // dang ki tai khoan moi
  async signup(email: string, password: string) {
    // see if email is in use
    const user = await this.usersService.findUserByEmail(email);
    if (user.length) {
      throw new BadRequestException('email in use!');
    }
    // hash the user's password

    // Generate a salt
    const salt = randomBytes(8).toString('hex');
    // Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');
    // create new user and save it

    const newUser = this.usersService.create(email, result);
    // return the user

    return newUser;
  }

  // dang nhap vao he thong

  signin() {}
}
