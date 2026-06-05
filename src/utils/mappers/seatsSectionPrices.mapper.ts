import { Pricing } from "@seatsio/seatsio-react";

import { SeatAvailabilityDTO } from "@/models/seat-availability.dto";

export const mapPricing = (data: SeatAvailabilityDTO): Pricing => {
    const zonePrices = data.zones
        .filter(s => s.price != null && s.price !== undefined)
        .map(s => ({
            category: s.displayName,
            price: s.price as number
        }));

    const seatPrices = data.seatOverrides
        .filter(s => s.priceOverride !== null && s.priceOverride !== undefined)
        .map(s => ({
            objects: [s.externalSeatObjectKey],
            price: s.priceOverride as number
        }));

    return {
        prices: [...zonePrices, ...seatPrices]
    };
};