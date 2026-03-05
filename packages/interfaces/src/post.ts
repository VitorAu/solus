import { PostType } from "@repo/types";

export interface IPost {
  CreatePost(
    userId: PostType["user_id"],
    data: Pick<PostType, "media" | "description">,
  ): Promise<PostType>;

  GetPostById(id: PostType["id"]): Promise<PostType>;
  GetPostByUserId(userId: PostType["user_id"]): Promise<PostType>;

  UpdatePost(
    id: PostType["id"],
    data: Pick<PostType, "media" | "description">,
  ): Promise<PostType>;

  DeletePost(id: PostType["id"]): Promise<void>;
}
