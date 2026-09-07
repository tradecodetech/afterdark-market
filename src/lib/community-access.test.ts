import { test } from "node:test";
import assert from "node:assert/strict";
import { hasCommunityAccess, validAmount } from "./community-access";

const now = new Date("2026-09-07T12:00:00Z");
const membership = { expiresAt: new Date("2026-10-07T12:00:00Z"), cancelled: false, isDemo: true };
test("membership requires an active, unexpired entitlement and enabled demo mode", () => {
  assert.equal(hasCommunityAccess(false, null, true, now), false);
  assert.equal(hasCommunityAccess(false, membership, true, now), true);
  assert.equal(hasCommunityAccess(false, membership, false, now), false);
  assert.equal(hasCommunityAccess(false, { ...membership, cancelled: true }, true, now), false);
  assert.equal(hasCommunityAccess(false, { ...membership, expiresAt: now }, true, now), false);
  assert.equal(hasCommunityAccess(true, null, false, now), true);
});
test("amounts reject malformed, fractional-cent, and out-of-range values", () => {
  for (const value of ["", "-1", "0", "0.99", "500.01", "Infinity", "1e2", "1.001", "NaN"]) assert.equal(validAmount(value), null, value);
  assert.equal(validAmount("1"), 100);
  assert.equal(validAmount("5.25"), 525);
  assert.equal(validAmount("500"), 50000);
});
