import {Body, Controller, Post, Res} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {UserService} from "./user.service";
import {UserRegisterDto} from "./user.register.dto";

@Controller('user')
@ApiTags("user")
export class UserController {

  constructor(
      private readonly userService: UserService
  ) {
  }

  @Post("/register")
  async register(@Body() body: UserRegisterDto, @Res() res) {
    return this.userService.register(body.email, body.username, body.password, res);
  }
}
