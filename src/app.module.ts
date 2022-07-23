import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {TypegooseModule} from "nestjs-typegoose-next";
import {UserModule} from './user/user.module';
import {JwtModule} from "@nestjs/jwt";
import {jwtCommon} from "./common/jwt.common";

@Module({
  imports: [
    TypegooseModule.forRoot("mongodb+srv://user:xt2qGuyJhjz5t2DF@bloxi-click.tm35r.mongodb.net/bloxi-click?retryWrites=true&w=majority"),
    UserModule,
    {
      ...JwtModule.register({
        secret: jwtCommon.secret,
        signOptions: {
          expiresIn: jwtCommon.expiresIn
        },
      }),
      global: true
    },
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
