import type { CreateInviteParams, Invite, ListParams } from "./schemas.ts";

/**
 * InvitesSdkOptions for creating an InvitesSdk.
 */
export interface InvitesSdkOptions {
  /**
   * baseUrl is the base URL of the invites API.
   */
  baseUrl: string;

  /**
   * apiKey is the API key for authentication.
   */
  apiKey?: string;

  /**
   * fetch is the fetch function to use for requests.
   */
  fetch?: typeof fetch;
}

/**
 * InvitesSdk is a client for the invites API.
 */
export class InvitesSdk {
  private readonly baseUrl: string;
  private readonly apiKey?: string;
  private readonly fetch: typeof fetch;

  public constructor(options: InvitesSdkOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, "");
    this.apiKey = options.apiKey;
    this.fetch = options.fetch ?? globalThis.fetch.bind(globalThis);
  }

  /**
   * List invite codes.
   */
  async list(params: ListParams = { limit: 20, reverse: false }): Promise<{
    items: Invite[];
    cursor: string;
  }> {
    const url = new URL(`${this.baseUrl}/v1/invites`);
    if (params.cursor) {
      url.searchParams.set("cursor", params.cursor);
    }
    url.searchParams.set("limit", params.limit.toString());
    url.searchParams.set("reverse", params.reverse.toString());

    const headers: Record<string, string> = {};
    if (this.apiKey) {
      headers["X-Api-Key"] = this.apiKey;
    }

    const response = await this.fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`Failed to list invites: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Create a new invite code.
   */
  async create(params: CreateInviteParams = {}): Promise<Invite> {
    const url = new URL(`${this.baseUrl}/v1/invites`);
    if (params.alphabet) {
      url.searchParams.set("alphabet", params.alphabet);
    }
    if (params.size) {
      url.searchParams.set("size", params.size.toString());
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (this.apiKey) {
      headers["X-Api-Key"] = this.apiKey;
    }

    const body: Record<string, unknown> = {};
    if (params.code) {
      body.code = params.code;
    }

    const response = await this.fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Failed to create invite: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get an invite code by code.
   */
  async get(code: string): Promise<Invite> {
    const url = new URL(`${this.baseUrl}/v1/invites/${code}`);
    const headers: Record<string, string> = {};
    if (this.apiKey) {
      headers["X-Api-Key"] = this.apiKey;
    }

    const response = await this.fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`Failed to get invite: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Delete an invite code.
   */
  async delete(code: string): Promise<void> {
    const url = new URL(`${this.baseUrl}/v1/invites/${code}`);
    const headers: Record<string, string> = {};
    if (this.apiKey) {
      headers["X-Api-Key"] = this.apiKey;
    }

    const response = await this.fetch(url, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to delete invite: ${response.statusText}`);
    }

    if (response.status !== 204) {
      // Consume body to avoid leaking resources
      await response.body?.cancel();
    }
  }
}
