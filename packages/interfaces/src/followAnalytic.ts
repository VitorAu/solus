import { FollowAnalyticType } from "@repo/types";

export interface IFollowAnalytic {
  CreateFollowAnalytic(
    userId: FollowAnalyticType["user_id"],
  ): Promise<FollowAnalyticType>;

  GetFollowAnalytic(
    userId: FollowAnalyticType["user_id"],
  ): Promise<FollowAnalyticType>;
}
