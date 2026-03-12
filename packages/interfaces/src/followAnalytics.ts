import { FollowAnalyticsType } from "@repo/types";

export interface IFollowAnalytics {
  CreateFollowAnalytics(
    userId: FollowAnalyticsType["user_id"],
  ): Promise<FollowAnalyticsType>;

  GetFollowAnalytics(
    userId: FollowAnalyticsType["user_id"],
  ): Promise<FollowAnalyticsType>;
}
