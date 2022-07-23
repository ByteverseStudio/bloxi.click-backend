import {prop} from "@typegoose/typegoose";

export class RobloxGroupModel {
  @prop({
    required: true,
    unique: true
  })
  group_id: string;

  @prop({
    required: true,
    unique: true
  })
  group_name: string;

  @prop({
    required: true,
    unique: true
  })
  group_url: string;

  @prop({
    required: true,
    unique: true
  })
  group_role: string;
}