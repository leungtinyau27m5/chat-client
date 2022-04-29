import { ExpressCodeMap } from "./express.proto";

export declare namespace ChatAxios {
  namespace Login {
    interface Param {
      email: string;
      password: string;
    }
    interface Response {
      code: ExpressCodeMap;
      message: string;
      data?: {
        id: number;
        email: string;
        username: string;
        status: "available" | "busy" | "leave" | "hide" | "offline";
        profile_pic: null | string;
        bio: null | string;
        created: string;
        updated: string;
      };
      token?: string;
    }
  }
  namespace Register {
    interface Param {
      email: string;
      username: string;
      password: string;
      profilePic: null | string;
    }
    interface Response {
      code: ExpressCodeMap;
      message: string;
    }
  }
}
