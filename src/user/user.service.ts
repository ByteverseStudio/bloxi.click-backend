import {HttpStatus, Injectable} from '@nestjs/common';
import {UserModel} from "./user.model";
import {InjectModel} from "nestjs-typegoose-next";
import {DocumentType, ReturnModelType} from "@typegoose/typegoose";
import {JwtService} from "@nestjs/jwt";
import {FilterQuery} from "mongoose";
import {Response} from "express";
import * as bcrypt from 'bcrypt';

const roblox = require('noblox');

@Injectable()
export class UserService {

  constructor(
      @InjectModel(UserModel) private readonly userModel: ReturnModelType<typeof UserModel>,
      private jwtService: JwtService
  ) {
  }

  async register(email: string, username: string, password: string, res: Response) {
    const user = await this.getUserNoCredentials({
      email
    });

    if (user) {
      return res.status(HttpStatus.CONFLICT).json({
        status: "failed",
        reason: "alreadyExists"
      });
    }

    password = await this.getHash(password);

    const robloxId = await roblox.getIdFromUsername(username);

    if (!robloxId) {
      return res.status(HttpStatus.NOT_FOUND).json({
        status: "failed",
        reason: "robloxAccNotExists"
      });
    }

    await this.userModel.create({
      email,
      username,
      password,
      robloxId
    });

    return res.status(HttpStatus.CREATED).json({
      status: "ok"
    });
  }

  async getHash(password) {
    return bcrypt.hash(password, 10);
  }

  async getUserNoCredentials(filter: FilterQuery<DocumentType<UserModel>>, projection?: string): Promise<UserModel & { _id: any }> {
    const newProjection = "-password " + (projection ?? "");
    return this.getUser(filter, newProjection);
  }

  async getUser(filter?, projection?) {
    return this.userModel.findOne(filter, projection);
  }
}
