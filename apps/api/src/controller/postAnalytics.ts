import { postAnalyticTable } from "@repo/database";
import { IPostAnalytic } from "@repo/interfaces";
import { PostAnalyticType } from "@repo/types";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";

export class PostAnalytics implements IPostAnalytic {
  private readonly database: NodePgDatabase<any>;
  constructor(database: NodePgDatabase<any>) {
    this.database = database;
  }

  async CreatePostAnalytic(
    postId: PostAnalyticType["post_id"],
  ): Promise<PostAnalyticType> {
    const [response] = await this.database
      .insert(postAnalyticTable)
      .values({ post_id: postId })
      .returning({
        id: postAnalyticTable.id,
        post_id: postAnalyticTable.post_id,
        like_count: postAnalyticTable.like_count,
        created_at: postAnalyticTable.created_at,
        updated_at: postAnalyticTable.updated_at,
      });

    if (!response) throw new Error("Failed to create post analytic");

    return response;
  }

  async GetPostAnalytic(
    postId: PostAnalyticType["post_id"],
  ): Promise<PostAnalyticType> {
    const [response] = await this.database
      .select({
        id: postAnalyticTable.id,
        post_id: postAnalyticTable.post_id,
        like_count: postAnalyticTable.like_count,
        created_at: postAnalyticTable.created_at,
        updated_at: postAnalyticTable.updated_at,
      })
      .from(postAnalyticTable)
      .where(eq(postAnalyticTable.post_id, postId));

    if (!response) throw new Error("Failed to get post analytic");

    return response;
  }
}
