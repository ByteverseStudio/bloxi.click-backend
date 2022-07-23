import {IsEmail, IsString} from "class-validator";
import {ApiModelProperty} from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

export class UserRegisterDto {

  @IsEmail()
  @ApiModelProperty({type: String})
  email: string;

  @IsString()
  @ApiModelProperty({type: String})
  username: string;

  @IsString()
  @ApiModelProperty({type: String})
  password: string;
}