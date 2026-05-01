import { Controller, Get, Param, Put, Post, Delete, Body } from "@nestjs/common";
import { UsuarioService } from "./usuario.service";
import { CreateUsuarioDto } from "./dto/create-usuario.dto";

//acá declaramos los verbos http y los métodos que van a llamar a los servicios correspondientes, también se declaran las rutas para cada uno de ellos
@Controller('/usuarios')
export class UsuarioController {

 constructor(private readonly usuarioService: UsuarioService) {

    this.usuarioService = usuarioService;
  }

  @Get()
  getController() {
    return this.usuarioService.getService();
  }
  @Post()
  postController(@Body() user: CreateUsuarioDto) {
    return this.usuarioService.postService(user);
  }
@Get(':id/saldo')
getSaldo(@Param('id') id: number) {
  return this.usuarioService.getSaldo(id);
}
}