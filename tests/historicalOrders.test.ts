import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("season pass pagination keeps requesting bundle orders", () => {
  const source = readFileSync(
    "src/app/account/tickets/components/TicketsClientWrapper/TicketsClientWrapper.tsx",
    "utf8",
  );

  assert.equal(source.includes("orderType: OrderType.SeasonPass"), false);
  assert.equal(source.includes("orderType: OrderType.Bundle"), true);
});

test("historical order cards do not expose ticket drill-in", () => {
  const source = readFileSync(
    "src/app/account/tickets/components/TicketCard/TicketCard.tsx",
    "utf8",
  );

  assert.equal(
    source.includes("const canOpenTicket = ticket.canViewTickets && !ticket.isPastEvent;"),
    true,
  );
  assert.equal(source.includes("{canOpenTicket &&"), true);
});
