import { postMediaTable } from "@repo/database";
import { IPostMedia } from "@repo/interfaces";
import { PostMediaType } from "@repo/types";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { eq, and } from "drizzle-orm";

export class PostMedia implements IPostMedia {
  private readonly database: NodePgDatabase<any>;
  constructor(database: NodePgDatabase<any>) {
    this.database = database;
  }

  async CreatePostMedia(
    postId: PostMediaType["post_id"],
    data: Array<Pick<PostMediaType, "id" | "media">>,
  ): Promise<PostMediaType[]> {
    const response = await this.database
      .insert(postMediaTable)
      .values(
        data.map((item, index) => ({
          id: item.id,
          post_id: postId,
          order: index,
          media: item.media,
        })),
      )
      .returning({
        id: postMediaTable.id,
        post_id: postMediaTable.post_id,
        order: postMediaTable.order,
        media: postMediaTable.media,
        created_at: postMediaTable.created_at,
        updated_at: postMediaTable.updated_at,
        deleted_at: postMediaTable.deleted_at,
      });

    if (!response) throw new Error("Failed to create post media");

    return response;
  }

  async GetPostMedia(
    postId: PostMediaType["post_id"],
  ): Promise<PostMediaType[]> {
    const response = await this.database
      .select({
        id: postMediaTable.id,
        post_id: postMediaTable.post_id,
        order: postMediaTable.order,
        media: postMediaTable.media,
        created_at: postMediaTable.created_at,
        updated_at: postMediaTable.updated_at,
        deleted_at: postMediaTable.deleted_at,
      })
      .from(postMediaTable)
      .where(eq(postMediaTable.post_id, postId));

    if (!response) throw new Error("Failed to get post media");

    return response;
  }

  // finish adding a add media, and complete the delete, and a delete all post media
  // in the db we will do a soft delete, but in aws we will do a hard delete

  async DeletePostMedia(
    postId: PostMediaType["post_id"],
    id: PostMediaType["id"],
  ): Promise<void> {
    const [response] = await this.database
      .update(postMediaTable)
      .set({})
      .where(and(postId))
      .returning();
  }
}
