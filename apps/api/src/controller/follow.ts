import { followTable } from "@repo/database";
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
    followsUserId: FollowType["follows_user_id"],
  ): Promise<FollowType> {
    if (userId === followsUserId) throw new Error("Failed to follow user");

    const [response] = await this.database
      .insert(followTable)
      .values({ user_id: userId, follows_user_id: followsUserId })
      .onConflictDoUpdate({
        target: [followTable.user_id, followTable.follows_user_id],
        set: {
          is_following: true,
          updated_at: new Date(),
        },
      })
      .returning({
        id: followTable.id,
        user_id: followTable.user_id,
        follows_user_id: followTable.follows_user_id,
        is_following: followTable.is_following,
        created_at: followTable.created_at,
        updated_at: followTable.updated_at,
      });

    if (!response) throw new Error("Failed to follow user");

    return response;
  }

  async GetFollowsByUserId(
    userId: FollowType["user_id"],
  ): Promise<FollowType[]> {
    const response = await this.database
      .select({
        id: followTable.id,
        user_id: followTable.user_id,
        follows_user_id: followTable.follows_user_id,
        is_following: followTable.is_following,
        created_at: followTable.created_at,
        updated_at: followTable.updated_at,
      })
      .from(followTable)
      .where(
        and(
          eq(followTable.user_id, userId),
          eq(followTable.is_following, true),
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
        id: followTable.id,
        user_id: followTable.user_id,
        follows_user_id: followTable.follows_user_id,
        is_following: followTable.is_following,
        created_at: followTable.created_at,
        updated_at: followTable.updated_at,
      })
      .from(followTable)
      .where(
        and(
          eq(followTable.follows_user_id, userId),
          eq(followTable.is_following, true),
        ),
      );

    if (!response) throw new Error("Failed to get followers");

    return response;
  }

  async GetUserFollowRelationship(
    userId: FollowType["user_id"],
    followingId: FollowType["follows_user_id"],
  ): Promise<FollowType> {
    const [response] = await this.database
      .select({
        id: followTable.id,
        user_id: followTable.user_id,
        follows_user_id: followTable.follows_user_id,
        is_following: followTable.is_following,
        created_at: followTable.created_at,
        updated_at: followTable.updated_at,
      })
      .from(followTable)
      .where(
        and(
          eq(followTable.user_id, userId),
          eq(followTable.follows_user_id, followingId),
        ),
      );

    if (!response) throw new Error("Failed to verify follow");

    return response;
  }

  async Unfollow(
    userId: FollowType["user_id"],
    followingId: FollowType["follows_user_id"],
  ): Promise<FollowType> {
    const [response] = await this.database
      .update(followTable)
      .set({
        is_following: false,
        updated_at: new Date(),
      })
      .where(
        and(
          eq(followTable.user_id, userId),
          eq(followTable.follows_user_id, followingId),
        ),
      )
      .returning({
        id: followTable.id,
        user_id: followTable.user_id,
        follows_user_id: followTable.follows_user_id,
        is_following: followTable.is_following,
        created_at: followTable.created_at,
        updated_at: followTable.updated_at,
      });

    if (!response) throw new Error("Failed to unfollow");

    return response;
  }
}
