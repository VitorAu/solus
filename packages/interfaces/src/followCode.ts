import { FollowCodeType } from "@repo/types";

export interface IFollowCode {
  CreateFollowCode(userId: FollowCodeType["user_id"]): Promise<FollowCodeType>;

  ValidateFollowCode(
    id: FollowCodeType["id"],
    user_id: FollowCodeType["user_id"],
  ): Promise<boolean>;

  DeleteFollowCode(id: FollowCodeType["id"]): Promise<void>;
}
