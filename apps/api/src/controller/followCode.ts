import { followCodeTable } from "@repo/database";
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
      .insert(followCodeTable)
      .values({
        user_id: userId,
        expires_at: expiresAt,
      })
      .returning({
        id: followCodeTable.id,
        user_id: followCodeTable.user_id,
        created_at: followCodeTable.created_at,
        expires_at: followCodeTable.expires_at,
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
        id: followCodeTable.id,
        expires_at: followCodeTable.expires_at,
      })
      .from(followCodeTable)
      .where(
        and(eq(followCodeTable.id, id), eq(followCodeTable.user_id, user_id)),
      );

    if (!response) throw new Error("Failed to create follow code");
    if (response.expires_at < new Date()) return false;
    return true;
  }
}
