import { UserType } from "@repo/types";

export interface IUser {
  CreateUser(
    data: Pick<
      UserType,
      "email" | "name" | "username" | "avatar_key" | "birthdate" | "password"
    >,
  ): Promise<Omit<UserType, "password">>;

  GetUserById(id: UserType["id"]): Promise<Omit<UserType, "password">>;
  GetUserByName(name: UserType["name"]): Promise<Omit<UserType, "password">>;
  GetUserByUsername(
    username: UserType["username"],
  ): Promise<Omit<UserType, "password">>;
  GetUserByEmail(email: UserType["email"]): Promise<Omit<UserType, "password">>;

  UpdateUser(
    id: UserType["id"],
    data: Pick<
      UserType,
      "email" | "name" | "username" | "avatar_key" | "birthdate"
    >,
  ): Promise<Omit<UserType, "password">>;
  UpdateUserPassword(
    id: UserType["id"],
    password: UserType["password"],
    newPassword: string,
  ): Promise<Omit<UserType, "password">>;

  DeleteUser(id: string): Promise<void>;

  VerifyPassword(
    id: UserType["id"],
    password: UserType["password"],
  ): Promise<boolean>;
}
