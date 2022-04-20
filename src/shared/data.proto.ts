export declare namespace Data {
  interface Chat {
    id: number;
    name: string;
    type: 'group' | 'private';
    profile_pic: string | null;
    bio: string | null;
    created: string;
    updated: string;
    // last msg data
    msg_id: number | null;
    user_id: number | null;
    username: string | null
    email: string | null;
    message: string | null;
    media: string | null;
    meta: null | object;
    last_msg_time: string | null;
  }
}
