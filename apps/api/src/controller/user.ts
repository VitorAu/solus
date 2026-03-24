import { IUser } from "@repo/interfaces";
import { UserType } from "@repo/types";
import { userTable } from "@repo/database";
import bcrypt from "bcrypt";
import { isNull, and, eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { FollowAnalyticController } from "./followAnalytics";

export class UserController implements IUser {
  private readonly database: NodePgDatabase<any>;
  constructor(database: NodePgDatabase<any>) {
    this.database = database;
  }

  async CreateUser(
    data: Pick<
      UserType,
      "email" | "name" | "username" | "avatar_key" | "birth_date" | "password"
    >,
  ): Promise<Omit<UserType, "password" | "role">> {
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const response = await this.database.transaction(async (tx) => {
      const [user] = await tx
        .insert(userTable)
        .values({
          email: data.email,
          name: data.name,
          username: data.username,
          avatar_key: data.avatar_key,
          birth_date: data.birth_date,
          password: hashedPassword,
          role: "USER",
        })
        .returning({
          id: userTable.id,
          email: userTable.email,
          name: userTable.name,
          username: userTable.username,
          avatar_key: userTable.avatar_key,
          birth_date: userTable.birth_date,
          created_at: userTable.created_at,
          updated_at: userTable.updated_at,
          deleted_at: userTable.deleted_at,
        });

      if (!user) throw new Error("Failed to create user");

      const followAnalyticsController = new FollowAnalyticController(tx);
      await followAnalyticsController.CreateFollowAnalytic(user?.id);

      return user;
    });

    return response;
  }

  async GetUserById(
    id: UserType["id"],
  ): Promise<Omit<UserType, "password" | "role">> {
    const [response] = await this.database
      .select({
        id: userTable.id,
        email: userTable.email,
        name: userTable.name,
        username: userTable.username,
        avatar_key: userTable.avatar_key,
        birth_date: userTable.birth_date,
        created_at: userTable.created_at,
        updated_at: userTable.updated_at,
        deleted_at: userTable.deleted_at,
      })
      .from(userTable)
      .where(and(eq(userTable.id, id), isNull(userTable.deleted_at)));

    if (!response) throw new Error("Failed to find user");

    return response;
  }

  async GetUserByEmail(
    email: UserType["email"],
  ): Promise<Omit<UserType, "password" | "role">> {
    const [response] = await this.database
      .select({
        id: userTable.id,
        email: userTable.email,
        name: userTable.name,
        username: userTable.username,
        avatar_key: userTable.avatar_key,
        birth_date: userTable.birth_date,
        created_at: userTable.created_at,
        updated_at: userTable.updated_at,
        deleted_at: userTable.deleted_at,
      })
      .from(userTable)
      .where(and(eq(userTable.email, email), isNull(userTable.deleted_at)));

    if (!response) throw new Error("Failed to find user");

    return response;
  }

  async GetUserByName(
    name: UserType["name"],
  ): Promise<Omit<UserType, "password" | "role">> {
    const [response] = await this.database
      .select({
        id: userTable.id,
        email: userTable.email,
        name: userTable.name,
        username: userTable.username,
        avatar_key: userTable.avatar_key,
        birth_date: userTable.birth_date,
        created_at: userTable.created_at,
        updated_at: userTable.updated_at,
        deleted_at: userTable.deleted_at,
      })
      .from(userTable)
      .where(and(eq(userTable.name, name), isNull(userTable.deleted_at)));

    if (!response) throw new Error("Failed to find user");

    return response;
  }

  async GetUserByUsername(
    username: UserType["username"],
  ): Promise<Omit<UserType, "password" | "role">> {
    const [response] = await this.database
      .select({
        id: userTable.id,
        email: userTable.email,
        name: userTable.name,
        username: userTable.username,
        avatar_key: userTable.avatar_key,
        birth_date: userTable.birth_date,
        created_at: userTable.created_at,
        updated_at: userTable.updated_at,
        deleted_at: userTable.deleted_at,
      })
      .from(userTable)
      .where(
        and(eq(userTable.username, username), isNull(userTable.deleted_at)),
      );

    if (!response) throw new Error("Failed to find user");

    return response;
  }

  async UpdateUser(
    id: UserType["id"],
    data: Partial<
      Pick<
        UserType,
        "email" | "name" | "username" | "avatar_key" | "birth_date"
      >
    >,
  ): Promise<Omit<UserType, "password" | "role">> {
    const [response] = await this.database
      .update(userTable)
      .set({
        ...data,
        updated_at: new Date(),
      })
      .where(and(eq(userTable.id, id), isNull(userTable.deleted_at)))
      .returning({
        id: userTable.id,
        email: userTable.email,
        name: userTable.name,
        username: userTable.username,
        avatar_key: userTable.avatar_key,
        birth_date: userTable.birth_date,
        created_at: userTable.created_at,
        updated_at: userTable.updated_at,
        deleted_at: userTable.deleted_at,
      });

    if (!response) throw new Error("Failed to update user");

    return response;
  }

  async UpdateUserPassword(
    id: UserType["id"],
    password: UserType["password"],
    newPassword: string,
  ): Promise<Omit<UserType, "password" | "role">> {
    const [user] = await this.database
      .select({ password: userTable.password })
      .from(userTable)
      .where(and(eq(userTable.id, id), isNull(userTable.deleted_at)));

    if (!user) throw new Error("Failed to find user");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("Invalid current password");

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const [response] = await this.database
      .update(userTable)
      .set({
        password: hashedPassword,
        updated_at: new Date(),
      })
      .where(and(eq(userTable.id, id), isNull(userTable.deleted_at)))
      .returning({
        id: userTable.id,
        email: userTable.email,
        name: userTable.name,
        username: userTable.username,
        avatar_key: userTable.avatar_key,
        birth_date: userTable.birth_date,
        created_at: userTable.created_at,
        updated_at: userTable.updated_at,
        deleted_at: userTable.deleted_at,
      });

    if (!response) throw new Error("Failed to update user password");

    return response;
  }

  async DeleteUser(id: string): Promise<void> {
    const [response] = await this.database
      .update(userTable)
      .set({
        updated_at: new Date(),
        deleted_at: new Date(),
      })
      .where(and(eq(userTable.id, id), isNull(userTable.deleted_at)))
      .returning({
        id: userTable.id,
        email: userTable.email,
        name: userTable.name,
        username: userTable.username,
        avatar_key: userTable.avatar_key,
        birth_date: userTable.birth_date,
        created_at: userTable.created_at,
        updated_at: userTable.updated_at,
        deleted_at: userTable.deleted_at,
      });

    if (!response) throw new Error("Failed to delete user");
  }

  async VerifyPassword(
    id: UserType["id"],
    password: UserType["password"],
  ): Promise<boolean> {
    const [user] = await this.database
      .select({ password: userTable.password })
      .from(userTable)
      .where(and(eq(userTable.id, id), isNull(userTable.deleted_at)));

    if (!user) throw new Error("Failed to find user");

    const isValid = await bcrypt.compare(password, user?.password);
    if (!isValid) {
      throw new Error("Invalid credentials");

      return false;
    } else return true;
  }
}
