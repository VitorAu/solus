import { FollowAnalyticsType } from "@repo/types";

export interface IFollowCode {
  CreateFollowAnalytics(
    userId: FollowAnalyticsType["user_id"],
  ): Promise<FollowAnalyticsType>;

  GetFollowerAmount(
    user_id: FollowAnalyticsType["user_id"],
  ): Promise<FollowAnalyticsType>;
  GetFollowingAmount(
    user_id: FollowAnalyticsType["user_id"],
  ): Promise<FollowAnalyticsType>;

  DeleteFollowCode(id: FollowAnalyticsType["id"]): Promise<void>;
}
