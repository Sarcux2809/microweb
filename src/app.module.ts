import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController, RegistrosController } from './app.controller';
import { AppService, datoService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { datos } from './user.entity';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MAIL_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
        }
      }
    ]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '2809',
      database: 'database',
      entities: [datos],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([datos])
  ],
  controllers: [AppController, RegistrosController],
  providers: [AppService, datoService],
})
export class AppModule { }