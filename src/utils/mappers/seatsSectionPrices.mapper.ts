import { Pricing } from "@seatsio/seatsio-react";

import { SeatAvailabilityDTO } from "@/models/seat-availability.dto";

export const mapPricing = (data: SeatAvailabilityDTO): Pricing => {
    const zonePrices = data.zones
        .filter(z => z.price != null && z.price !== undefined)
        .map(z => ({
            category: z.displayName,
            price: z.price as number
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