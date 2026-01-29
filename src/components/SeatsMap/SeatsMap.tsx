"use client";

import { SeatsioSeatingChart, SelectableObject } from "@seatsio/seatsio-react";

import { SeatsMapProps } from "./SeatsMap.type";

export default function SeatsMap({ eventKey, pricing, onSelected, onDeselected }: SeatsMapProps) {
    const handleSelected = (obj: SelectableObject) => {
        onSelected?.(obj);
    };

    const handleDeselected = (obj: SelectableObject) => {
        onDeselected?.(obj);
    };

    return (
        <div style={{ height: '500px' }}>
            <SeatsioSeatingChart
                workspaceKey={process.env.NEXT_PUBLIC_SEATS_WORKSPACE_KEY}
                event={eventKey}
                region={'na'}
                onObjectSelected={handleSelected}
                onObjectDeselected={handleDeselected}
                pricing={pricing}
                priceFormatter={(price) => '$' + price}
            />
        </div>
    );
}