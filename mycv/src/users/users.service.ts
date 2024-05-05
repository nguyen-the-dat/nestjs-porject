import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class UsersService {
  public constructor(
    @InjectRepository(User) private repository: Repository<User>,
  ) {}

  create(email: string, password: string) {
    const user = this.repository.create({ email, password });
    return this.repository.save({ email, password });
  }

  findUserById(id: number) {
    if (!id) {
      return null;
    }
    return this.repository.findOneBy({ id: id });
  }

  findUserByEmail(email: string) {
    return this.repository.findBy({ email: email });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException('user not found!');
    }
    Object.assign(user, attrs); // copy properties from source to targe object
    return this.repository.save(user);
  }

  async remove(id: number) {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    return this.repository.remove(user);
  }
}
