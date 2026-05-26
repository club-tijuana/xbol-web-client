import type { WhiteLabelConfig } from "./types";

export const whiteLabelConfigs = {
  "pwr-ticket": {
    brandName: "PWRTicket",
    legalBrandName: "PWR TICKET",
    legalEntityName: "Luup Global, S.A. de C.V.",
    websiteUrl: "https://pwrticket.com/",
    legalLastUpdated: "13 de abril de 2026",
    contact: {
      name: "Martin Ibarra Cervantes",
      address: "9990 Calle Rufino Tamayo, Interior 401, Zona Urbana Rio Tijuana, 22010",
      email: "soporte@pwrticket.com",
      phone: "664 375 9594",
      whatsapp: "(+52) 6647646736",
    },
    social: {
      facebookName: "PWR TICKET",
      instagramName: "PWR TICKET",
    },
  },
  "test-brand": {
    brandName: "Test Brand Tickets",
    legalBrandName: "TEST BRAND",
    legalEntityName: "Test Brand Legal, S.A. de C.V.",
    websiteUrl: "https://test-brand.example/",
    legalLastUpdated: "1 de enero de 2026",
    contact: {
      name: "Test Contact",
      address: "Test Address 123",
      email: "support@test-brand.example",
      phone: "555 000 0000",
      whatsapp: "(+52) 5550000000",
    },
    social: {
      facebookName: "Test Brand",
      instagramName: "Test Brand",
    },
  },
} satisfies Record<string, WhiteLabelConfig>;

export type WhiteLabelId = keyof typeof whiteLabelConfigs;

export const defaultWhiteLabelId = "pwr-ticket" satisfies WhiteLabelId;
export const whiteLabelIds = Object.keys(whiteLabelConfigs) as [
  WhiteLabelId,
  ...WhiteLabelId[],
];
