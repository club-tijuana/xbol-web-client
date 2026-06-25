import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("renovation flow consumes dedicated order price endpoint", () => {
  const orderService = readFileSync("src/services/orderService.ts", "utf8");
  const wrapper = readFileSync(
    "src/app/season/renovation/[orderId]/components/RenovationClientWrapper/RenovationClientWrapper.tsx",
    "utf8",
  );

  assert.equal(orderService.includes("getOrderRenovationPrices"), true);
  assert.equal(orderService.includes("orders/renovate/${orderId}/prices"), true);
  assert.equal(wrapper.includes("getOrderRenovationPrices(orderId)"), true);
  assert.equal(wrapper.includes("previousSeatPrices.map"), true);
  assert.equal(wrapper.includes("fees: seat.fees"), true);
});
