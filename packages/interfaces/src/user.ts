import { UserType } from "@repo/types";

export interface IUser {
  CreateUser(
    data: Pick<
      UserType,
      "email" | "name" | "username" | "avatar_key" | "birth_date" | "password"
    >,
  ): Promise<Omit<UserType, "password" | "role">>;

  GetUserById(id: UserType["id"]): Promise<Omit<UserType, "password" | "role">>;
  GetUserByName(
    name: UserType["name"],
  ): Promise<Omit<UserType, "password" | "role">>;
  GetUserByUsername(
    username: UserType["username"],
  ): Promise<Omit<UserType, "password" | "role">>;
  GetUserByEmail(
    email: UserType["email"],
  ): Promise<Omit<UserType, "password" | "role">>;

  UpdateUser(
    id: UserType["id"],
    data: Partial<
      Pick<
        UserType,
        "email" | "name" | "username" | "avatar_key" | "birth_date"
      >
    >,
  ): Promise<Omit<UserType, "password" | "role">>;
  UpdateUserPassword(
    id: UserType["id"],
    password: UserType["password"],
    newPassword: string,
  ): Promise<Omit<UserType, "password" | "role">>;

  DeleteUser(id: string): Promise<void>;

  VerifyPassword(
    id: UserType["id"],
    password: UserType["password"],
  ): Promise<boolean>;
}
