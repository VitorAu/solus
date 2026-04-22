import { PostAnalyticType } from "@repo/types";

export interface IPostAnalytic {
  CreatePostAnalytic(
    userId: PostAnalyticType["post_id"],
  ): Promise<PostAnalyticType>;

  GetPostAnalytic(
    userId: PostAnalyticType["post_id"],
  ): Promise<PostAnalyticType>;
}
