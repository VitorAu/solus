import { PostLikeType } from "@repo/types";

export interface IPostLike {
  Like(
    postId: PostLikeType["post_id"],
    userId: PostLikeType["user_id"],
  ): Promise<PostLikeType>;

  GetLikeByPostId(postId: PostLikeType["post_id"]): Promise<PostLikeType[]>;
  GetUserLikeRelationship(
    userId: PostLikeType["user_id"],
    postId: PostLikeType["post_id"],
  ): Promise<PostLikeType>;

  Unlike(
    postId: PostLikeType["post_id"],
    userId: PostLikeType["user_id"],
  ): Promise<PostLikeType>;
}
