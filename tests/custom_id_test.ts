import { assertEquals, assertMatch } from "@std/assert";
import { router } from "../main.ts";
import { InvitesSdk } from "../lib/sdk.ts";

const sdk = new InvitesSdk({
  baseUrl: "http://localhost",
  fetch: (input, init) => {
    const req = new Request(input, init);
    return router.fetch(req);
  },
});

Deno.test("SDK - create with custom alphabet and size", async () => {
  const invite = await sdk.create({
    alphabet: "12345",
    size: 8,
  });
  assertEquals(invite.code.length, 8);
  assertMatch(invite.code, /^[1-5]{8}$/);
});

Deno.test("SDK - create with only size", async () => {
  const invite = await sdk.create({
    size: 10,
  });
  assertEquals(invite.code.length, 10);
});

Deno.test("SDK - create with only alphabet", async () => {
  const invite = await sdk.create({
    alphabet: "abc",
  });
  assertEquals(invite.code.length, 21); // Default size
  assertMatch(invite.code, /^[a-c]{21}$/);
});
