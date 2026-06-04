export type MediaType =
  | "Banner"
  | "Gallery"
  | "Logo"
  | "GeneralView"
  | "Facade"
  | "Sponsor";

export interface MediaDTO {
  id: number;
  url?: string | null;
  contentType: string;
  fileName: string;
  mediaType: MediaType;
  order: number;
}

export interface MediaSetDTO {
  banner?: MediaDTO | null;
  logo?: MediaDTO | null;
  sponsors: MediaDTO[];
  gallery: MediaDTO[];
}

export type EventMediaSetDTO = MediaSetDTO;

export function mediaUrl(media?: MediaDTO | null): string | undefined {
  return media?.url ?? undefined;
}
