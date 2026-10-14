import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports:[
    TypeOrmModule.forRoot({

      type:'postgres',
      host:'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'PrenAppelli',
      autoLoadEntities:true,
      synchronize:true,
     
    }),
  ],
  exports: [TypeOrmModule],
})
export class OrgDatabaseModule {}