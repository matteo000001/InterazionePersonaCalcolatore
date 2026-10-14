import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '@exam-planner/shared-types';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersEntity } from './user.entity';


@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly repository: Repository<UsersEntity>
  ) {}

  findAll(role?:UserRole):Promise<UsersEntity[]>{
    if(role){
       return this.repository.find({
        where:{role},
        order: {id:'ASC'}
       }) ;
    }

    return this.repository.find({
      order: { id: 'ASC' },
    });
  }

  findById(id: number): Promise<UsersEntity | null> {
    return this.repository.findOne({ where: { id } });
  }

  findByEmail(email: string): Promise<UsersEntity | null> {
    return this.repository.findOne({ where: { email } });
  }

  createOne(dto: CreateUserDto,passwordHash:string): Promise<UsersEntity> {
    const user = this.repository.create({
      name: dto.name.trim(),
      email: dto.email.trim().toLowerCase(),
      passwordHash: passwordHash,
      role: dto.role,
      managedDegreeProgramIds:
        dto.role === UserRole.TEACHER ? dto.managedDegreeProgramIds ?? [] : [],
    });

    return this.repository.save(user);
  }

  async updateOne(id: number, dto: UpdateUserDto): Promise<UsersEntity | null> {
    const user = await this.findById(id);

    if (!user) {
      return null;
    }

    if (dto.name !== undefined) {
      user.name = dto.name.trim();
    }

    if (dto.email !== undefined) {
      user.email = dto.email.trim().toLowerCase();
    }

    if (dto.role !== undefined) {
      user.role = dto.role;
    }

    if (dto.managedDegreeProgramIds !== undefined) {
      user.managedDegreeProgramIds = dto.managedDegreeProgramIds;
    }

    if (user.role === UserRole.SECRETARY) {
      user.managedDegreeProgramIds = [];
    }

    return this.repository.save(user);
  }

  async deleteOne(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
