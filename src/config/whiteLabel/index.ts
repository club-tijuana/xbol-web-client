import { publicEnv } from "@/config/env";

import {
  defaultWhiteLabelId,
  whiteLabelConfigs,
  type WhiteLabelId,
} from "./configs";
import type { WhiteLabelConfig } from "./types";

export type { WhiteLabelConfig, WhiteLabelId };
export {
  defaultWhiteLabelId,
  whiteLabelConfigs,
  whiteLabelIds,
} from "./configs";

export function getWhiteLabelConfig(id: WhiteLabelId): WhiteLabelConfig {
  const config = whiteLabelConfigs[id];

  if (!config) {
    throw new Error(`Unknown white label: ${id}`);
  }

  return config;
}

export const whiteLabel = getWhiteLabelConfig(
  publicEnv.NEXT_PUBLIC_WHITE_LABEL ?? defaultWhiteLabelId,
);
