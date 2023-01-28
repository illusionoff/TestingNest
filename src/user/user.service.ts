import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findById(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async create(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async update(id: number, user: User): Promise<User> {
    await this.userRepository.update(id, user);
    return await this.userRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<any> {
    // Если нет такого id, то возвращается  {"raw": [],"affected": 0}
    // Если есть, возвращается {"raw": [],"affected": 1}
    // return await this.userRepository.delete(id);
    const result = await this.userRepository.delete(id);
    // const result = await this.findById(id);
    // await this.userRepository.delete(id);
    console.log('user.service.ts delete = ', result);
    return result;
  }

  async deleteAll(): Promise<any> {
    await this.userRepository.query('DELETE FROM users');
  }
}
