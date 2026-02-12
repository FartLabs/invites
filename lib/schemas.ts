import { z } from "zod";

/**
 * ListParams is the parameters for the list method.
 */
export interface ListParams {
  /**
   * cursor is the cursor for pagination.
   */
  cursor?: string;
  /**
   * limit is the number of items to return.
   */
  limit: number;
  /**
   * reverse is whether to return the items in reverse order.
   */
  reverse: boolean;
}

/**
 * listParamsSchema is the schema for the list method.
 */
export const listParamsSchema: z.ZodType<ListParams> = z
  .object({
    cursor: z.string().optional(),
    limit: z.number().int().min(1).max(100).default(20),
    reverse: z.boolean().default(false),
  });

/**
 * CreateInviteParams is the parameters for the create method.
 */
export interface CreateInviteParams {
  /**
   * code is the code to create.
   */
  code?: string;
  /**
   * alphabet is the custom alphabet to use for code generation.
   */
  alphabet?: string;
  /**
   * size is the custom size to use for code generation.
   */
  size?: number;
}

/**
 * createInviteParamsSchema is the schema for the create method.
 */
export const createInviteParamsSchema: z.ZodType<CreateInviteParams> = z.object(
  {
    code: z.string().optional(),
    alphabet: z.string().optional(),
    size: z.number().int().min(1).optional(),
  },
);

/**
 * Invite is the schema for the invite method.
 */
export interface Invite {
  /**
   * code is the code of the invite.
   */
  code: string;
  /**
   * createdAt is the time the invite was created.
   */
  createdAt: number;
  /**
   * redeemedBy is the user who redeemed the invite.
   */
  redeemedBy: string | null;
  /**
   * redeemedAt is the time the invite was redeemed.
   */
  redeemedAt: number | null;
}

/**
 * inviteSchema is the schema for the invite method.
 */
export const inviteSchema: z.ZodType<Invite> = z.object({
  code: z.string(),
  createdAt: z.number(),
  redeemedBy: z.string().nullable(),
  redeemedAt: z.number().nullable(),
});
