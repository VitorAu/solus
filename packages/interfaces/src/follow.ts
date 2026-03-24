import { FollowType } from "@repo/types";

export interface IFollow {
  Follow(
    userId: FollowType["user_id"],
    followsUserId: FollowType["follows_user_id"],
  ): Promise<FollowType>;

  GetFollowsByUserId(userId: FollowType["user_id"]): Promise<FollowType[]>;
  GetFollowersByUserId(userId: FollowType["user_id"]): Promise<FollowType[]>;
  GetIsUserFollowing(
    userId: FollowType["user_id"],
    followsUserId: FollowType["follows_user_id"],
  ): Promise<FollowType>;

  Unfollow(
    userId: FollowType["user_id"],
    followsUserId: FollowType["follows_user_id"],
  ): Promise<FollowType>;
}
