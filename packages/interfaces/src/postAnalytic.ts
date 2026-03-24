import { PostAnalyticType } from "@repo/types";

export interface IPostAnalytics {
  CreatePostAnalytic(
    userId: PostAnalyticType["post_id"],
  ): Promise<PostAnalyticType>;

  GetPostAnalytic(
    userId: PostAnalyticType["post_id"],
  ): Promise<PostAnalyticType>;
}
