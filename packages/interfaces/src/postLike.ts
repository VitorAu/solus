import { PostLikeType } from "@repo/types";

export interface IPostLike {
  Like(): Promise<PostLikeType>;

  GetLikeByUserId(userId: PostLikeType["user_id"]): Promise<PostLikeType[]>;
  GetIsUserLike(
    userId: PostLikeType["user_id"],
    postId: PostLikeType["post_id"],
  ): Promise<PostLikeType>;

  Unlike(): Promise<PostLikeType>;
}
