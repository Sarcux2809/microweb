import { Body, Controller, Post, Res, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { datoService } from './app.service';

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
    const confirmationMessage = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Registro exitoso</title>
    </head>
    <body>
      <h1>¡Registro exitoso!</h1>
      <p>Tu registro ha sido exitoso.</p>
    </body>
    </html>
  `;
    res.status(200).send(confirmationMessage);
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
      const errorMessage = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error de Registro</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
          }
          .error-container {
            max-width: 400px;
            margin: 50px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
          }
          .error-icon {
            width: 100px;
            height: auto;
            margin-bottom: 20px;
          }
          .error-message {
            font-size: 24px;
            color: #ff5555;
          }
        </style>
      </head>
      <body>
        <div class="error-container">
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-bug" viewBox="0 0 16 16">
        <path d="M4.355.522a.5.5 0 0 1 .623.333l.291.956A5 5 0 0 1 8 1c1.007 0 1.946.298 2.731.811l.29-.956a.5.5 0 1 1 .957.29l-.41 1.352A5 5 0 0 1 13 6h.5a.5.5 0 0 0 .5-.5V5a.5.5 0 0 1 1 0v.5A1.5 1.5 0 0 1 13.5 7H13v1h1.5a.5.5 0 0 1 0 1H13v1h.5a1.5 1.5 0 0 1 1.5 1.5v.5a.5.5 0 1 1-1 0v-.5a.5.5 0 0 0-.5-.5H13a5 5 0 0 1-10 0h-.5a.5.5 0 0 0-.5.5v.5a.5.5 0 1 1-1 0v-.5A1.5 1.5 0 0 1 2.5 10H3V9H1.5a.5.5 0 0 1 0-1H3V7h-.5A1.5 1.5 0 0 1 1 5.5V5a.5.5 0 0 1 1 0v.5a.5.5 0 0 0 .5.5H3c0-1.364.547-2.601 1.432-3.503l-.41-1.352a.5.5 0 0 1 .333-.623M4 7v4a4 4 0 0 0 3.5 3.97V7zm4.5 0v7.97A4 4 0 0 0 12 11V7zM12 6a4 4 0 0 0-1.334-2.982A3.98 3.98 0 0 0 8 2a3.98 3.98 0 0 0-2.667 1.018A4 4 0 0 0 4 6z"/>
      </svg>
          <h1 class="error-message">¡Oops!</h1>
          <p>Ya estás registrado con este correo electrónico.</p>
        </div>
      </body>
      </html>      
      `;
      res.status(400).send(errorMessage);
      return;
    }

    // Procesar los datos y guardarlos en la base de datos
    await this.micappControllerBd.createRegistro(Usuario, Contraseña, Correo);

    // Redirigir al usuario a una página de confirmación
    res.redirect('/confirmation');
  }
}
