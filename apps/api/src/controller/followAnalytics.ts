import { followAnalyticsTable } from "@repo/database";
import { IFollowAnalytics } from "@repo/interfaces";
import { FollowAnalyticsType } from "@repo/types";
import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

export class FollowAnalyticsController implements IFollowAnalytics {
  private readonly database: NodePgDatabase<any>;
  constructor(database: NodePgDatabase<any>) {
    this.database = database;
  }

  async CreateFollowAnalytics(
    userId: FollowAnalyticsType["user_id"],
  ): Promise<FollowAnalyticsType> {
    const [response] = await this.database
      .insert(followAnalyticsTable)
      .values({
        user_id: userId,
      })
      .returning({
        id: followAnalyticsTable.id,
        user_id: followAnalyticsTable.user_id,
        followers: followAnalyticsTable.followers,
        following: followAnalyticsTable.following,
        created_at: followAnalyticsTable.created_at,
        updated_at: followAnalyticsTable.updated_at,
      });

    if (!response) throw new Error("Failed to create follow analytics");

    return response;
  }

  async GetFollowAnalytics(
    userId: FollowAnalyticsType["user_id"],
  ): Promise<FollowAnalyticsType> {
    const [response] = await this.database
      .select({
        id: followAnalyticsTable.id,
        user_id: followAnalyticsTable.user_id,
        followers: followAnalyticsTable.followers,
        following: followAnalyticsTable.following,
        created_at: followAnalyticsTable.created_at,
        updated_at: followAnalyticsTable.updated_at,
      })
      .from(followAnalyticsTable)
      .where(eq(followAnalyticsTable.user_id, userId));

    if (!response) throw new Error("Failed to get follow analytics");

    return response;
  }
}
