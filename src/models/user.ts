import * as dynamoose from "dynamoose";
import { Item } from "dynamoose/dist/Item";

class User extends Item {
  public email: string;
  public username: string;
  public password: string;
  public robloxId: string;
  public createdAt: Date;
  public updatedAt: Date;

  public robloxVerified: boolean;
  public emailVerified: boolean;

  public emailVerificationCode: string;
  public robloxVerificationCode: string;

  public robloxData: RobloxData;
  public discordData: DiscordData;
}

class RobloxData extends Item {
  public groups: RobloxGroup[];
}

class RobloxGroup extends Item {
  public id: string;
  public name: string;
  public url: string;
  public role: string; 
}

class DiscordData extends Item {
  public id: string;
  public username: string;
  public discriminator: string;
}

class DiscordTokenData extends Item {
  public access_token: string;
  public refresh_token: string;
  public expires_in: Date;
  public token_type: string;
  public scope: string;
}

const UserModel = dynamoose.model<User>("User", {

  email: {
    type: String,
    required: true,
    unique: true,
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  roblox_id: {
    type: String,
    required: true,
    unique: true,
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  roblox_verified: {
    type: Boolean,
    default: false
  },
  email_verified: {
    type: Boolean,
    default: false
  },
  email_verification_token: {
    type: String,
    default: null
  },
  roblox_verification_token: {
    type: String,
    default: null
  },
  robloxData: {
    groups: [{
      group_id: {
        type: String,
        required: true,
        unique: true
      },
      group_name: {
        type: String,
        required: true,
        unique: true
      },
      group_url: {
        type: String,
        required: true,
        unique: true
      },
      group_role: {
        type: String,
        required: true,
        unique: true
      }
    }],
  },
  discord_data: {
    id: String,
    username: String,
    discriminator: String,
    token_data: {
      access_token: String,
      refresh_token: String,
      expires_in: Date,
      token_type: String,
      scope: String
    }
  },
  other_data: {

  }
});