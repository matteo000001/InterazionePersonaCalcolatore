import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersRepository } from './user.repository';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './user.entity';
import { CatalogModule} from '@exam-planner/server-catalog';

@Module({
  imports:[TypeOrmModule.forFeature([UsersEntity]),CatalogModule],
  controllers: [UsersController],
  providers: [UsersRepository, UsersService],
  exports: [UsersRepository, UsersService],
})
export class UsersModule {}
