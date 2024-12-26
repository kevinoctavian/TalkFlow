export interface UserModel {
  constructor: {
    name: "RowDataPacket";
  };
  id: bigint;
  username: string;
  avatar: string;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}
