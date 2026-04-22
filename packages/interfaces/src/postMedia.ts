import { PostMediaType } from "@repo/types";

export interface IPostMedia {
  CreatePostMedia(
    postId: PostMediaType["post_id"],
    data: Array<Pick<PostMediaType, "media" | "storage_key">>,
  ): Promise<PostMediaType[]>;

  GetPostMedia(postId: PostMediaType["post_id"]): Promise<PostMediaType[]>;

  DeletePostMedia(postId: PostMediaType["post_id"]): Promise<void>;
}
