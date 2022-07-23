import {modelOptions, prop, Severity} from "@typegoose/typegoose";
import {RobloxGroupModel} from "./roblox.group.model";

@modelOptions({
  options: {
    customName: "users",
    allowMixed: Severity.ALLOW
  }
})
export class UserModel {

  _id: any;

  @prop()
  email: string;

  @prop()
  username: string;

  @prop()
  password: string;

  @prop()
  robloxId: string;

  @prop({
    default: Date.now()
  })
  createdAt: Date;

  @prop({
    default: false
  })
  robloxVerified: boolean;

  @prop({
    default: false
  })
  emailVerified: boolean;

  @prop()
  emailVerifyToken: string;

  @prop()
  robloxVerifyToken: string;

  @prop()
  robloxData: {
    groups: RobloxGroupModel[]
  }

  @prop()
  discordData: {

  }
}