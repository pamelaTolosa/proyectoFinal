import { Controller, Get, Param, Put,Post,Delete,Body } from "@nestjs/common";
import { UsuarioService } from "./usuario.service";
import { Usuario } from "./entities/usuario.entity";
//acá declaramos los verbos http y los métodos que van a llamar a los servicios correspondientes, también se declaran las rutas para cada uno de ellos
@Controller('/usuario')
export class UsuarioController {

  private readonly usuarioService: UsuarioService;

  constructor(usuarioService: UsuarioService) {
    this.usuarioService = usuarioService;
  }

  @Get()//obtener
  getController(): Promise<Usuario[]> {
    return this.usuarioService.getService();
  }

  @Post()//agregar
  postController(@Body() user: Usuario){
    return this.usuarioService.postService(user);
  }

  @Delete(':id')//eliminar
  deleteController(@Param('id')idUser: number){
    return this.usuarioService.deleteService(idUser);
  }

  @Put()//modificar
  putController(@Body()updateUser: Usuario){
    return this.usuarioService.putService(updateUser);
  }
}