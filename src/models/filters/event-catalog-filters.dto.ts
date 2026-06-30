import { BundleType } from "@/models/enums/bundle-type.enum";
import { EventCatalogItemType } from "@/models/enums/event-catalog-item-type.enum";

export interface EventCatalogFilters {
  searchTerm?: string;
  itemType?: EventCatalogItemType;
  bundleType?: BundleType;
  status?: string;
  venue?: string;
  startDate?: string;
  endDate?: string;
  upcoming?: boolean;
  buyableOnly?: boolean;
  sortBy?: string;
  descending?: boolean;
  page?: number;
  pageSize?: number;
}
