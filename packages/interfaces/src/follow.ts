import { FollowType } from "@repo/types";

export interface IFollow {
  CreateFollow(
    userId: FollowType["user_id"],
    followingId: FollowType["following_id"],
  ): Promise<FollowType>;

  GetFollowsByUserId(userId: FollowType["user_id"]): Promise<FollowType[]>;
  GetIsUerFollowing(
    userId: FollowType["user_id"],
    followingId: FollowType["following_id"],
  ): Promise<FollowType>;

  DeleteFollow(
    userId: FollowType["user_id"],
    followingId: FollowType["following_id"],
  ): Promise<void>;
}
