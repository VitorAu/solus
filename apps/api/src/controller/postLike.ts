import { postLikeTable } from "@repo/database";
import { IPostLike } from "@repo/interfaces";
import { PostLikeType } from "@repo/types";
import { eq, and } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

export class PostLike implements IPostLike {
  private readonly database: NodePgDatabase<any>;
  constructor(database: NodePgDatabase<any>) {
    this.database = database;
  }

  async Like(
    postId: PostLikeType["post_id"],
    userId: PostLikeType["user_id"],
  ): Promise<PostLikeType> {
    const [response] = await this.database
      .insert(postLikeTable)
      .values({ post_id: postId, user_id: userId })
      .onConflictDoUpdate({
        target: [postLikeTable.post_id, postLikeTable.user_id],
        set: {
          is_liked: true,
          updated_at: new Date(),
        },
      })
      .returning({
        id: postLikeTable.id,
        post_id: postLikeTable.post_id,
        user_id: postLikeTable.user_id,
        is_liked: postLikeTable.is_liked,
        created_at: postLikeTable.created_at,
        updated_at: postLikeTable.updated_at,
      });

    if (!response) throw new Error("Failed to like post");

    return response;
  }

  async GetLikeByPostId(
    postId: PostLikeType["post_id"],
  ): Promise<PostLikeType[]> {
    const response = await this.database
      .select({
        id: postLikeTable.id,
        post_id: postLikeTable.post_id,
        user_id: postLikeTable.user_id,
        is_liked: postLikeTable.is_liked,
        created_at: postLikeTable.created_at,
        updated_at: postLikeTable.updated_at,
      })
      .from(postLikeTable)
      .where(eq(postLikeTable.post_id, postId));

    if (!response) throw new Error("Failed to get post likes");

    return response;
  }

  async GetUserLikeRelationship(
    userId: PostLikeType["user_id"],
    postId: PostLikeType["post_id"],
  ): Promise<PostLikeType> {
    const [response] = await this.database
      .select({
        id: postLikeTable.id,
        post_id: postLikeTable.post_id,
        user_id: postLikeTable.user_id,
        is_liked: postLikeTable.is_liked,
        created_at: postLikeTable.created_at,
        updated_at: postLikeTable.updated_at,
      })
      .from(postLikeTable)
      .where(
        and(
          eq(postLikeTable.post_id, postId),
          eq(postLikeTable.user_id, userId),
        ),
      );

    if (!response) throw new Error("Failed to verify like");

    return response;
  }

  async Unlike(
    postId: PostLikeType["post_id"],
    userId: PostLikeType["user_id"],
  ): Promise<PostLikeType> {
    const [response] = await this.database
      .update(postLikeTable)
      .set({ is_liked: false, updated_at: new Date() })
      .where(
        and(
          eq(postLikeTable.post_id, postId),
          eq(postLikeTable.user_id, userId),
        ),
      )
      .returning({
        id: postLikeTable.id,
        post_id: postLikeTable.post_id,
        user_id: postLikeTable.user_id,
        is_liked: postLikeTable.is_liked,
        created_at: postLikeTable.created_at,
        updated_at: postLikeTable.updated_at,
      });

    if (!response) throw new Error("Failed to unlike");

    return response;
  }
}
