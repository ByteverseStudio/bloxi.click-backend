import {Injectable} from '@nestjs/common';

const noblox = require('noblox');

@Injectable()
export class UserService {

  constructor() {
  }

  async register(username: string) {
    const user = await noblox.getIdFromUsername(username);
  }
}
