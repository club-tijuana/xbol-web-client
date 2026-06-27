import type { WhiteLabelConfig } from "./types";

export const whiteLabelConfigs = {
  "pwr-ticket": {
    brandName: "PWRTicket",
    legalBrandName: "PWR TICKET",
    legalEntityName: "Luup Global, S.A. de C.V.",
    websiteUrl: "https://pwrticket.mx/",
    legalLastUpdated: "26 de junio de 2026",
    contact: {
      name: "Martin Ibarra Cervantes",
      address: "Calle Rufino Tamayo No. 9990, Int. 401, Zona Urbana Rio Tijuana, C.P. 22010, Tijuana, Baja California, México.",
      email: "soporte@pwrticket.mx",
      phone: "664 375 9594",
      whatsapp: "+52 1 664 6933586",
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
