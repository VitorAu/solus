import { IUser } from "@repo/interfaces";
import { UserType } from "@repo/types";
import { usersTable } from "@repo/database";
import bcrypt from "bcrypt";
import { isNull, and, eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

export class UserController implements IUser {
  private readonly database: NodePgDatabase<Record<string, never>>;
  constructor(database: NodePgDatabase<Record<string, never>>) {
    this.database = database;
  }

  async CreateUser(
    data: Pick<
      UserType,
      "email" | "name" | "username" | "avatar_key" | "birthdate" | "password"
    >,
  ): Promise<Omit<UserType, "password">> {
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const [response] = await this.database
      .insert(usersTable)
      .values({
        email: data.email,
        name: data.name,
        username: data.username,
        avatar_key: data.avatar_key,
        birth_date: data.birthdate,
        password: hashedPassword,
      })
      .returning({
        id: usersTable.id,
        email: usersTable.email,
        name: usersTable.name,
        username: usersTable.username,
        avatar_key: usersTable.avatar_key,
        birthdate: usersTable.birth_date,
        created_at: usersTable.created_at,
        updated_at: usersTable.updated_at,
        deleted_at: usersTable.deleted_at,
      });

    if (!response) throw new Error("Failed to create user");

    return response;
  }

  async GetUserById(id: UserType["id"]): Promise<Omit<UserType, "password">> {
    const [response] = await this.database
      .select({
        id: usersTable.id,
        email: usersTable.email,
        name: usersTable.name,
        username: usersTable.username,
        avatar_key: usersTable.avatar_key,
        birthdate: usersTable.birth_date,
        created_at: usersTable.created_at,
        updated_at: usersTable.updated_at,
        deleted_at: usersTable.deleted_at,
      })
      .from(usersTable)
      .where(and(eq(usersTable.id, id), isNull(usersTable.deleted_at)));

    if (!response) throw new Error("Failed to find user");

    return response;
  }

  async GetUserByEmail(
    email: UserType["email"],
  ): Promise<Omit<UserType, "password">> {
    const [response] = await this.database
      .select({
        id: usersTable.id,
        email: usersTable.email,
        name: usersTable.name,
        username: usersTable.username,
        avatar_key: usersTable.avatar_key,
        birthdate: usersTable.birth_date,
        created_at: usersTable.created_at,
        updated_at: usersTable.updated_at,
        deleted_at: usersTable.deleted_at,
      })
      .from(usersTable)
      .where(and(eq(usersTable.email, email), isNull(usersTable.deleted_at)));

    if (!response) throw new Error("Failed to find user");

    return response;
  }

  async GetUserByName(
    name: UserType["name"],
  ): Promise<Omit<UserType, "password">> {
    const [response] = await this.database
      .select({
        id: usersTable.id,
        email: usersTable.email,
        name: usersTable.name,
        username: usersTable.username,
        avatar_key: usersTable.avatar_key,
        birthdate: usersTable.birth_date,
        created_at: usersTable.created_at,
        updated_at: usersTable.updated_at,
        deleted_at: usersTable.deleted_at,
      })
      .from(usersTable)
      .where(and(eq(usersTable.name, name), isNull(usersTable.deleted_at)));

    if (!response) throw new Error("Failed to find user");

    return response;
  }

  async GetUserByUsername(
    username: UserType["username"],
  ): Promise<Omit<UserType, "password">> {
    const [response] = await this.database
      .select({
        id: usersTable.id,
        email: usersTable.email,
        name: usersTable.name,
        username: usersTable.username,
        avatar_key: usersTable.avatar_key,
        birthdate: usersTable.birth_date,
        created_at: usersTable.created_at,
        updated_at: usersTable.updated_at,
        deleted_at: usersTable.deleted_at,
      })
      .from(usersTable)
      .where(
        and(eq(usersTable.username, username), isNull(usersTable.deleted_at)),
      );

    if (!response) throw new Error("Failed to find user");

    return response;
  }

  async UpdateUser(
    id: UserType["id"],
    data: Partial<
      Pick<UserType, "email" | "name" | "username" | "avatar_key" | "birthdate">
    >,
  ): Promise<Omit<UserType, "password">> {
    const [response] = await this.database
      .update(usersTable)
      .set({
        ...data,
        updated_at: new Date(),
      })
      .where(and(eq(usersTable.id, id), isNull(usersTable.deleted_at)))
      .returning({
        id: usersTable.id,
        email: usersTable.email,
        name: usersTable.name,
        username: usersTable.username,
        avatar_key: usersTable.avatar_key,
        birthdate: usersTable.birth_date,
        created_at: usersTable.created_at,
        updated_at: usersTable.updated_at,
        deleted_at: usersTable.deleted_at,
      });

    if (!response) throw new Error("Failed to update user");

    return response;
  }

  async UpdateUserPassword(
    id: UserType["id"],
    password: UserType["password"],
    newPassword: string,
  ): Promise<Omit<UserType, "password">> {
    const [user] = await this.database
      .select({ password: usersTable.password })
      .from(usersTable)
      .where(and(eq(usersTable.id, id), isNull(usersTable.deleted_at)));

    if (!user) throw new Error("Failed to find user");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("Invalid current password");

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const [response] = await this.database
      .update(usersTable)
      .set({
        password: hashedPassword,
        updated_at: new Date(),
      })
      .where(and(eq(usersTable.id, id), isNull(usersTable.deleted_at)))
      .returning({
        id: usersTable.id,
        email: usersTable.email,
        name: usersTable.name,
        username: usersTable.username,
        avatar_key: usersTable.avatar_key,
        birthdate: usersTable.birth_date,
        created_at: usersTable.created_at,
        updated_at: usersTable.updated_at,
        deleted_at: usersTable.deleted_at,
      });

    if (!response) throw new Error("Failed to update user password");

    return response;
  }

  async DeleteUser(id: string): Promise<void> {
    const [response] = await this.database
      .update(usersTable)
      .set({
        updated_at: new Date(),
        deleted_at: new Date(),
      })
      .where(and(eq(usersTable.id, id), isNull(usersTable.deleted_at)))
      .returning({
        id: usersTable.id,
        email: usersTable.email,
        name: usersTable.name,
        username: usersTable.username,
        avatar_key: usersTable.avatar_key,
        birthdate: usersTable.birth_date,
        created_at: usersTable.created_at,
        updated_at: usersTable.updated_at,
        deleted_at: usersTable.deleted_at,
      });

    if (!response) throw new Error("Failed to delete user");
  }

  async VerifyPassword(
    id: UserType["id"],
    password: UserType["password"],
  ): Promise<boolean> {
    const [user] = await this.database
      .select({ password: usersTable.password })
      .from(usersTable)
      .where(and(eq(usersTable.id, id), isNull(usersTable.deleted_at)));

    if (!user) throw new Error("Failed to find user");

    const isValid = await bcrypt.compare(password, user?.password);
    if (!isValid) {
      throw new Error("Invalid credentials");

      return false;
    } else return true;
  }
}
