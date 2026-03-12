import { followCodesTable } from "@repo/database";
import { IFollowCode } from "@repo/interfaces";
import { FollowCodeType } from "@repo/types";
import { eq, and, gt } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

export class FollowCodeController implements IFollowCode {
  private readonly database: NodePgDatabase<any>;
  constructor(database: NodePgDatabase<any>) {
    this.database = database;
  }

  async CreateFollowCode(
    userId: FollowCodeType["user_id"],
  ): Promise<FollowCodeType> {
    // code expires in 10 minutes
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10);

    const [response] = await this.database
      .insert(followCodesTable)
      .values({
        user_id: userId,
        expires_at: expiresAt,
      })
      .returning({
        id: followCodesTable.id,
        user_id: followCodesTable.user_id,
        created_at: followCodesTable.created_at,
        expires_at: followCodesTable.expires_at,
      });

    if (!response) throw new Error("Failed to create follow code");

    return response;
  }

  async ValidateFollowCode(
    id: FollowCodeType["id"],
    user_id: FollowCodeType["user_id"],
  ): Promise<boolean> {
    const [response] = await this.database
      .select({
        id: followCodesTable.id,
        expires_at: followCodesTable.expires_at,
      })
      .from(followCodesTable)
      .where(
        and(eq(followCodesTable.id, id), eq(followCodesTable.user_id, user_id)),
      );

    if (!response) throw new Error("Failed to create follow code");
    if (response.expires_at < new Date()) return false;
    return true;
  }
}
