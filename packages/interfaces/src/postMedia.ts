import { PostMediaType } from "@repo/types";

export interface IPostMedia {
  CreatePostMedia(
    postId: PostMediaType["post_id"],
    data: Array<Pick<PostMediaType, "id" | "media">>,
  ): Promise<PostMediaType[]>;

  GetPostMedia(postId: PostMediaType["post_id"]): Promise<PostMediaType[]>;

  DeleteAllPostMedia(postId: PostMediaType["post_id"]): Promise<void>;
}
