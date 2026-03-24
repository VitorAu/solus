import { followAnalyticTable } from "@repo/database";
import { IFollowAnalytic } from "@repo/interfaces";
import { FollowAnalyticType } from "@repo/types";
import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

export class FollowAnalyticController implements IFollowAnalytic {
  private readonly database: NodePgDatabase<any>;
  constructor(database: NodePgDatabase<any>) {
    this.database = database;
  }

  async CreateFollowAnalytic(
    userId: FollowAnalyticType["user_id"],
  ): Promise<FollowAnalyticType> {
    const [response] = await this.database
      .insert(followAnalyticTable)
      .values({
        user_id: userId,
      })
      .returning({
        id: followAnalyticTable.id,
        user_id: followAnalyticTable.user_id,
        follows_count: followAnalyticTable.follows_count,
        followers_count: followAnalyticTable.followers_count,
        created_at: followAnalyticTable.created_at,
        updated_at: followAnalyticTable.updated_at,
      });

    if (!response) throw new Error("Failed to create follow analytic");

    return response;
  }

  async GetFollowAnalytic(
    userId: FollowAnalyticType["user_id"],
  ): Promise<FollowAnalyticType> {
    const [response] = await this.database
      .select({
        id: followAnalyticTable.id,
        user_id: followAnalyticTable.user_id,
        follows_count: followAnalyticTable.follows_count,
        followers_count: followAnalyticTable.followers_count,
        created_at: followAnalyticTable.created_at,
        updated_at: followAnalyticTable.updated_at,
      })
      .from(followAnalyticTable)
      .where(eq(followAnalyticTable.user_id, userId));

    if (!response) throw new Error("Failed to get follow analytic");

    return response;
  }
}
