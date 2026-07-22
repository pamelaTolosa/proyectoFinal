// =========================
// IMPORTACIONES DE DECORADORES Y MÓDULOS DE NESTJS
// =========================

// Importa decoradores para definir controladores, rutas, parámetros y métodos HTTP
import {
  Controller,   // Decorador que marca la clase como controlador
  Get,          // Decorador para métodos HTTP GET
  Param,        // Decorador para extraer parámetros de la ruta
  Post,         // Decorador para métodos HTTP POST
  Body,         // Decorador para extraer el cuerpo de la petición
  ParseIntPipe, // Pipe que convierte parámetros a número entero
} from '@nestjs/common';

// Importa el servicio que contiene la lógica de negocio
import { UsuarioService } from './usuario.service';

// Importa el DTO (Data Transfer Object) para validar los datos de creación
import { CreateUsuarioDto } from './dto/create-usuario.dto';

// Importa el decorador Public para marcar rutas públicas (sin autenticación)
import { Public } from '../../../auth/metadata';

// =========================
// DEFINICIÓN DEL CONTROLADOR
// =========================

// Decorador que define la ruta base para todas las rutas de este controlador
// Todas las rutas empezarán con '/usuarios'
@Controller('usuarios')
export class UsuarioController {
  
  // Inyección de dependencia: el servicio se inyecta automáticamente
  constructor(private readonly usuarioService: UsuarioService) {}

  // =========================
  // RUTA: GET /usuarios
  // =========================
  
  // Decorador que indica que este método responde a peticiones GET
  @Get()
  // Método que retorna todos los usuarios
  // Llama al método getService() del servicio
  findAll() {
    return this.usuarioService.getService();
  }

  // =========================
  // RUTA: POST /usuarios
  // =========================
  
  // Decorador Public: esta ruta no requiere autenticación (es pública)
  @Public()
  // Decorador que indica que este método responde a peticiones POST
  @Post()
  // Método que crea un nuevo usuario
  // @Body() extrae y valida el cuerpo de la petición usando el DTO
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    // Llama al servicio para crear el usuario
    return this.usuarioService.postService(createUsuarioDto);
  }

  // =========================
  // RUTA: GET /usuarios/:id
  // =========================
  
  // Decorador que indica que este método responde a peticiones GET
  // El ':id' es un parámetro dinámico en la ruta
  @Get(':id')
  // Método que busca un usuario por su ID
  // @Param('id') extrae el parámetro 'id' de la URL
  // ParseIntPipe convierte el string 'id' a número entero
  findOne(@Param('id', ParseIntPipe) id: number) {
    // Llama al servicio para buscar el usuario por ID
    return this.usuarioService.findOne(id);
  }

  // =========================
  // RUTA: GET /usuarios/:id/saldo
  // =========================
  
  // Decorador que indica que este método responde a peticiones GET
  // Ruta con dos segmentos: ':id' y 'saldo'
  @Get(':id/saldo')
  // Método que obtiene el saldo de un usuario específico
  // @Param('id') extrae el parámetro 'id' y lo convierte a número
  getSaldo(@Param('id', ParseIntPipe) id: number) {
    // Llama al servicio para obtener el saldo del usuario
    return this.usuarioService.getSaldo(id);
  }

  // =========================
  // RUTA: GET /usuarios/dni/:dni
  // =========================
  
  // Decorador que indica que este método responde a peticiones GET
  // Ruta con el segmento 'dni' y un parámetro ':dni'
  @Get('dni/:dni')
  // Método que busca un usuario por su DNI
  // @Param('dni') extrae el parámetro 'dni' como string (sin conversión)
  findByDni(@Param('dni') dni: string) {
    // Llama al servicio para buscar el usuario por DNI
    return this.usuarioService.findByDni(dni);
  }

  // =========================
  // RUTA: POST /usuarios/login
  // =========================
  
  // Decorador que indica que este método responde a peticiones POST
  @Post('login')
  // Método que maneja el inicio de sesión
  // @Body() extrae el cuerpo de la petición y lo tipa
  login(@Body() body: { correo: string; contrasenia: string }) {
    // Llama al servicio de login con el correo y contraseña proporcionados
    return this.usuarioService.login(body.correo, body.contrasenia);
  }
}