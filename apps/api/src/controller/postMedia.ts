import { postMediaTable } from "@repo/database";
import { IPostMedia } from "@repo/interfaces";
import { PostMediaType } from "@repo/types";
import { and, eq, isNull } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

export class PostMediaController implements IPostMedia {
  private readonly database: NodePgDatabase<any>;
  constructor(database: NodePgDatabase<any>) {
    this.database = database;
  }

  // transform this into a transaction so it will also update the updated_at at the postTable
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
      .where(
        and(
          eq(postMediaTable.post_id, postId),
          isNull(postMediaTable.deleted_at),
        ),
      );

    if (!response) throw new Error("Failed to get post media");

    return response;
  }

  async DeleteAllPostMedia(postId: PostMediaType["post_id"]): Promise<void> {
    const response = await this.database
      .update(postMediaTable)
      .set({
        updated_at: new Date(),
        deleted_at: new Date(),
      })
      .where(
        and(
          eq(postMediaTable.post_id, postId),
          isNull(postMediaTable.deleted_at),
        ),
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

    if (!response) throw new Error("Failed to delete pose media");
  }
}
