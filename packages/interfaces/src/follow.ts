import { FollowType } from "@repo/types";

export interface IFollow {
  CreateFollow(
    userId: FollowType["user_id"],
    followingId: FollowType["following_id"],
  ): Promise<FollowType>;

  GetFollowsByUserId(userId: FollowType["user_id"]): Promise<FollowType[]>;
  GetFollowerCountByUserId(userId: FollowType["user_id"]): Promise<number>;
  GetIsUerFollowing(
    userId: FollowType["user_id"],
    followingId: FollowType["following_id"],
  ): Promise<boolean>;

  DeleteFollow(
    userId: FollowType["user_id"],
    followingId: FollowType["following_id"],
  ): Promise<void>;
}
