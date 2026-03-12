import { followsTable } from "@repo/database";
import { IFollow } from "@repo/interfaces";
import { FollowType } from "@repo/types";
import { eq, and } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

export class FollowController implements IFollow {
  private readonly database: NodePgDatabase<any>;
  constructor(database: NodePgDatabase<any>) {
    this.database = database;
  }

  async Follow(
    userId: FollowType["user_id"],
    followingId: FollowType["following_id"],
  ): Promise<FollowType> {
    if (userId === followingId) throw new Error("Failed to follow user");

    const [response] = await this.database
      .insert(followsTable)
      .values({ user_id: userId, following_id: followingId })
      .onConflictDoUpdate({
        target: [followsTable.user_id, followsTable.following_id],
        set: {
          is_following: true,
          updated_at: new Date(),
        },
      })
      .returning({
        id: followsTable.id,
        user_id: followsTable.user_id,
        following_id: followsTable.following_id,
        is_following: followsTable.is_following,
        created_at: followsTable.created_at,
        updated_at: followsTable.updated_at,
      });

    if (!response) throw new Error("Failed to follow user");

    return response;
  }

  async GetFollowsByUserId(
    userId: FollowType["user_id"],
  ): Promise<FollowType[]> {
    const response = await this.database
      .select({
        id: followsTable.id,
        user_id: followsTable.user_id,
        following_id: followsTable.following_id,
        is_following: followsTable.is_following,
        created_at: followsTable.created_at,
        updated_at: followsTable.updated_at,
      })
      .from(followsTable)
      .where(
        and(
          eq(followsTable.user_id, userId),
          eq(followsTable.is_following, true),
        ),
      );

    if (!response) throw new Error("Failed to get follows");

    return response;
  }

  async GetFollowersByUserId(
    userId: FollowType["user_id"],
  ): Promise<FollowType[]> {
    const response = await this.database
      .select({
        id: followsTable.id,
        user_id: followsTable.user_id,
        following_id: followsTable.following_id,
        is_following: followsTable.is_following,
        created_at: followsTable.created_at,
        updated_at: followsTable.updated_at,
      })
      .from(followsTable)
      .where(
        and(
          eq(followsTable.following_id, userId),
          eq(followsTable.is_following, true),
        ),
      );

    if (!response) throw new Error("Failed to get followers");

    return response;
  }

  async GetIsUserFollowing(
    userId: FollowType["user_id"],
    followingId: FollowType["following_id"],
  ): Promise<FollowType> {
    const [response] = await this.database
      .select({
        id: followsTable.id,
        user_id: followsTable.user_id,
        following_id: followsTable.following_id,
        is_following: followsTable.is_following,
        created_at: followsTable.created_at,
        updated_at: followsTable.updated_at,
      })
      .from(followsTable)
      .where(
        and(
          eq(followsTable.user_id, userId),
          eq(followsTable.following_id, followingId),
          eq(followsTable.is_following, true),
        ),
      );

    if (!response) throw new Error("Failed to verify follow");

    return response;
  }

  async Unfollow(
    userId: FollowType["user_id"],
    followingId: FollowType["following_id"],
  ): Promise<FollowType> {
    const [response] = await this.database
      .update(followsTable)
      .set({
        is_following: false,
        updated_at: new Date(),
      })
      .where(
        and(
          eq(followsTable.user_id, userId),
          eq(followsTable.following_id, followingId),
        ),
      )
      .returning({
        id: followsTable.id,
        user_id: followsTable.user_id,
        following_id: followsTable.following_id,
        is_following: followsTable.is_following,
        created_at: followsTable.created_at,
        updated_at: followsTable.updated_at,
      });

    if (!response) throw new Error("Failed to unfollow");

    return response;
  }
}
