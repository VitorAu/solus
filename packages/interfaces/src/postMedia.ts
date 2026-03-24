import { PostMediaType } from "@repo/types";

export interface IPostMedia {
  CreatePostMedia(
    postId: PostMediaType["post_id"],
    data: Array<Pick<PostMediaType, "id" | "media">>,
  ): Promise<PostMediaType[]>;

  GetPostMedia(postId: PostMediaType["post_id"]): Promise<PostMediaType[]>;

  UpdatePostMedia(
    postId: PostMediaType["post_id"],
    id: PostMediaType["id"],
  ): Promise<PostMediaType>;

  DeletePostMedia(
    postId: PostMediaType["post_id"],
    id: PostMediaType["id"],
  ): Promise<void>;
}
