import { assertEquals } from "@std/assert";
import { InvitesKv } from "#/lib/db.ts";

// Utility to create a test KV (using in-memory if possible, or a temp file)
// For simplicity in tests, we can just point to a new temp KV
const testKvPath = await Deno.makeTempFile();
const kv = await Deno.openKv(testKvPath);
const invitesKv = new InvitesKv(kv);

Deno.test("InvitesKv - CRUD", async () => {
  const code = "test-code-" + Date.now();
  const invite = {
    code,
    createdAt: Date.now(),
    redeemedBy: null,
    redeemedAt: null,
  };

  // Create
  await invitesKv.add(invite);

  // Get
  const fetched = await invitesKv.get(code);
  assertEquals(fetched, invite);

  // List
  const { items, cursor } = await invitesKv.list({ limit: 10, reverse: false });
  assertEquals(items.some((i) => i.code === code), true);
  assertEquals(typeof cursor, "string");

  // Test pagination with limit 1
  // We need at least 2 items to test next cursor
  const code2 = "test-code-2-" + Date.now();
  await invitesKv.add({ ...invite, code: code2 });

  const { items: items1, cursor: cursor1 } = await invitesKv.list({
    limit: 1,
    reverse: false,
  });
  assertEquals(items1.length, 1);

  // Get next page
  const { items: items2 } = await invitesKv.list({
    limit: 1,
    cursor: cursor1,
    reverse: false,
  });
  assertEquals(items2.length, 1);

  // Delete
  await invitesKv.delete(code);
  const deleted = await invitesKv.get(code);
  assertEquals(deleted, null);
});
