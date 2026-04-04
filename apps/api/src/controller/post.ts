import { postTable } from "@repo/database";
import { IPost } from "@repo/interfaces";
import { PostType } from "@repo/types";
import { eq, isNull, and } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

export class Post implements IPost {
  private readonly database: NodePgDatabase<any>;
  constructor(database: NodePgDatabase<any>) {
    this.database = database;
  }

  async CreatePost(
    userId: PostType["user_id"],
    data: PostType["description"],
  ): Promise<PostType> {
    const [response] = await this.database
      .insert(postTable)
      .values({ user_id: userId, description: data })
      .returning({
        id: postTable.id,
        user_id: postTable.user_id,
        description: postTable.description,
        created_at: postTable.created_at,
        updated_at: postTable.updated_at,
        deleted_at: postTable.deleted_at,
      });

    if (!response) throw new Error("Failed to create post");

    return response;
  }

  async GetPostById(id: PostType["id"]): Promise<PostType> {
    const [response] = await this.database
      .select({
        id: postTable.id,
        user_id: postTable.user_id,
        description: postTable.description,
        created_at: postTable.created_at,
        updated_at: postTable.updated_at,
        deleted_at: postTable.deleted_at,
      })
      .from(postTable)
      .where(and(eq(postTable.id, id), isNull(postTable.deleted_at)));

    if (!response) throw new Error("Failed to find post");

    return response;
  }

  async GetPostByUserId(userId: PostType["user_id"]): Promise<PostType> {
    const [response] = await this.database
      .select({
        id: postTable.id,
        user_id: postTable.user_id,
        description: postTable.description,
        created_at: postTable.created_at,
        updated_at: postTable.updated_at,
        deleted_at: postTable.deleted_at,
      })
      .from(postTable)
      .where(and(eq(postTable.user_id, userId), isNull(postTable.deleted_at)));

    if (!response) throw new Error("Failed to find post");

    return response;
  }

  async UpdatePost(
    id: PostType["id"],
    userId: PostType["user_id"],
    data: PostType["description"],
  ): Promise<PostType> {
    const [response] = await this.database
      .update(postTable)
      .set({
        description: data,
        updated_at: new Date(),
      })
      .where(
        and(
          eq(postTable.id, id),
          eq(postTable.user_id, userId),
          isNull(postTable.deleted_at),
        ),
      )
      .returning({
        id: postTable.id,
        user_id: postTable.user_id,
        description: postTable.description,
        created_at: postTable.created_at,
        updated_at: postTable.updated_at,
        deleted_at: postTable.deleted_at,
      });

    if (!response) throw new Error("Failed to update post");

    return response;
  }

  async DeletePost(
    id: PostType["id"],
    userId: PostType["user_id"],
  ): Promise<void> {
    const [response] = await this.database
      .update(postTable)
      .set({
        updated_at: new Date(),
        deleted_at: new Date(),
      })
      .where(
        and(
          eq(postTable.id, id),
          eq(postTable.user_id, userId),
          isNull(postTable.deleted_at),
        ),
      )
      .returning({
        id: postTable.id,
        user_id: postTable.user_id,
        description: postTable.description,
        created_at: postTable.created_at,
        updated_at: postTable.updated_at,
        deleted_at: postTable.deleted_at,
      });

    if (!response) throw new Error("Failed to delete post");
  }
}
