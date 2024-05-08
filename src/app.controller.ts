import { Body, Controller, Post, Res, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { datoService } from './app.service';
import * as path from 'path';
import * as Redis from 'redis';

// Crea una instancia de cliente Redis una vez para toda la aplicación
const redisClient = Redis.createClient();

@Controller()
export class AppController {
  getHello: any;
  constructor(private readonly appService: AppService) {}

  @Post()
  async newUser(@Body() body: any): Promise<string> {
    return this.appService.newUser(body);
  }

  @Get('confirmation')
  getConfirmation(@Res() res): void {
    const filePath = path.join(__dirname, '..', 'public', 'confirmation.html');
    res.sendFile(filePath);
  }
}

@Controller('register')
export class RegistrosController {
  constructor(private readonly micappControllerBd: datoService) {}

  @Post()
  async createRegistro(
    @Body('Usuario') Usuario: string,
    @Body('Contraseña') Contraseña: string,
    @Body('Correo') Correo: string,
    @Res() res,
  ) {
    const existeUsuario = await this.micappControllerBd.findUserByEmail(Correo);
    if (existeUsuario) {
      res.redirect('existencia.html');
      return;
    }

    await this.micappControllerBd.createRegistro(Usuario, Contraseña, Correo);

    res.redirect('/confirmation');
  }
}
