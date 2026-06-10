import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

import { publicEnvSchema } from "../src/config/envContracts.ts";

const DEFAULT_EVENT_IMAGE = "/assets/eventDefault/default.png";

const requiredPublicEnv = {
  NEXT_PUBLIC_API_BASE_URL: "https://example.test/client/api/",
  NEXT_PUBLIC_SEATS_WORKSPACE_KEY: "d88faf51-0cbb-474e-95d9-3c945a6a279e",
  NEXT_PUBLIC_FIREBASE_API_KEY: "firebase-api-key",
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "example.firebaseapp.com",
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: "example-project",
  NEXT_PUBLIC_FIREBASE_APP_ID: "1:123456789:web:abcdef",
};

test("public env schema defaults the event image to the checked-in asset", () => {
  const env = publicEnvSchema.parse(requiredPublicEnv);

  assert.equal(env.NEXT_PUBLIC_DEFAULT_EVENT_IMAGE, DEFAULT_EVENT_IMAGE);
});

test("public env schema accepts the deployment override as provided", () => {
  const defaultImage = "event-default-from-deploy.png";
  const env = publicEnvSchema.parse({
    ...requiredPublicEnv,
    NEXT_PUBLIC_DEFAULT_EVENT_IMAGE: defaultImage,
  });

  assert.equal(env.NEXT_PUBLIC_DEFAULT_EVENT_IMAGE, defaultImage);
});

test("default event image does not use a feature-specific resolver module", () => {
  assert.equal(existsSync("src/config/defaultEventImage.ts"), false);
});

test("event image components do not import the default image config directly", () => {
  const componentPaths = [
    "src/components/EventCard/EventCard.tsx",
    "src/app/event/components/EventsSearch/EventsSearch.tsx",
    "src/app/booking/components/BookingClient/BookingClient.tsx",
    "src/app/booking/components/BookingSeasonClient/BookingSeasonClient.tsx",
    "src/app/account/tickets/components/TicketCard/TicketCard.tsx",
    "src/app/account/tickets/order/[orderId]/event/[eventId]/components/TicketPageClient/TicketPageClient.tsx",
    "src/app/account/tickets/order/[orderId]/event/[eventId]/components/TicketQRGridItem/TicketQRGridItem.tsx",
    "src/app/account/tickets/order/[orderId]/event/[eventId]/components/CarouselSlideQRTickets/CarouselSlideQRTicket.tsx",
    "src/app/account/tickets/order/[orderId]/success/components/SuccessClient/SuccessClient.tsx",
  ];

  for (const path of componentPaths) {
    const source = readFileSync(path, "utf8");

    assert.equal(source.includes("defaultEventImage"), false, path);
  }
});
