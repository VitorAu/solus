import { postMediaTable, postTable } from "@repo/database";
import { IPostMedia } from "@repo/interfaces";
import { PostMediaType } from "@repo/types";
import { and, eq, isNotNull, isNull } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

export class PostMediaController implements IPostMedia {
  private readonly database: NodePgDatabase<any>;
  constructor(database: NodePgDatabase<any>) {
    this.database = database;
  }

  async CreatePostMedia(
    postId: PostMediaType["post_id"],
    data: Array<Pick<PostMediaType, "order" | "media" | "storage_key">>,
  ): Promise<PostMediaType[]> {
    const response = await this.database.transaction(async (tx) => {
      const post = await tx
        .insert(postMediaTable)
        .values(
          data.map((item) => ({
            post_id: postId,
            order: item.order,
            media: item.media,
            storage_key: item.storage_key,
          })),
        )
        .returning({
          id: postMediaTable.id,
          post_id: postMediaTable.post_id,
          order: postMediaTable.order,
          media: postMediaTable.media,
          storage_key: postMediaTable.storage_key,
          created_at: postMediaTable.created_at,
          updated_at: postMediaTable.updated_at,
          deleted_at: postMediaTable.deleted_at,
        });

      await tx
        .update(postTable)
        .set({
          updated_at: new Date(),
        })
        .where(and(eq(postTable.id, postId), isNotNull(postTable.deleted_at)));

      return post;
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
        storage_key: postMediaTable.storage_key,
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

  async DeletePostMedia(postId: PostMediaType["post_id"]): Promise<void> {
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
        storage_key: postMediaTable.storage_key,
        created_at: postMediaTable.created_at,
        updated_at: postMediaTable.updated_at,
        deleted_at: postMediaTable.deleted_at,
      });

    if (!response) throw new Error("Failed to delete pose media");
  }
}
