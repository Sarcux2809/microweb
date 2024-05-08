import { Body, Controller, Post, Res, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { datoService } from './app.service';
import * as path from 'path';
import * as Redis from 'redis';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  newUser(@Body() body: any): string {
    // Aquí puedes procesar los datos recibidos como desees
    // Por ejemplo, puedes guardarlos en Redis
    const redisClient = Redis.createClient();
    redisClient.set('nombre_de_la_clave', JSON.stringify(body));
    redisClient.quit(); // Cierra la conexión con Redis
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
