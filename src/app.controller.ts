import { Body, Controller, Post, Res, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { datoService } from './app.service';
import * as path from 'path'; // Importa el módulo 'path' para trabajar con rutas de archivos

@Controller()
export class AppController {
  getHello(): any {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly appService: AppService) { }

  @Post()
  newUser(@Body() body: any): string {
    return this.appService.newUser(body);
  }

  @Get('confirmation')
  getConfirmation(@Res() res): void {
    // Obtén la ruta absoluta del archivo HTML
    const filePath = path.join(__dirname, '..', 'public', 'confirmation.html');
    // Envía el archivo HTML como respuesta
    res.sendFile(filePath);
  }
}


@Controller('register')
export class RegistrosController {
  constructor(private readonly micappControllerBd: datoService) { }

  @Post()
  async createRegistro(@Body('Usuario') Usuario: string, @Body('Contraseña') Contraseña: string, @Body('Correo') Correo: string, @Res() res) {
    // Verificar si el correo electrónico ya está registrado en la base de datos
    const existeUsuario = await this.micappControllerBd.findUserByEmail(Correo);
    if (existeUsuario) {
      // Redirigir al usuario a la página de confirmación de registro existente
      res.redirect('existencia.html');
      return;
    }

    // Procesar los datos y guardarlos en la base de datos
    await this.micappControllerBd.createRegistro(Usuario, Contraseña, Correo);

    // Redirigir al usuario a la página de confirmación de registro exitoso
    res.redirect('/confirmation');
  }
}