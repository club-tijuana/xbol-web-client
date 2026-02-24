"use client";

import { SeatingChart, SeatsioSeatingChart, SelectableObject } from "@seatsio/seatsio-react";
import { useEffect, useRef } from "react";

import { SeatsMapProps } from "./SeatsMap.type";


export default function SeatsMap({ eventKey, pricing, selectedObjects, mode = "normal", onSelected, onDeselected }: SeatsMapProps) {
    const chartRef = useRef<SeatingChart | null>(null);

    useEffect(() => {
        if (!chartRef.current || !selectedObjects) {
            return;
        }

        chartRef.current?.zoomToObjects([...selectedObjects]);
    }, [selectedObjects]);

    const handleSelected = (obj: SelectableObject) => {
        onSelected?.(obj);
    };

    const handleDeselected = (obj: SelectableObject) => {
        onDeselected?.(obj);
    };

    return (
        <div>
            <SeatsioSeatingChart
                workspaceKey={process.env.NEXT_PUBLIC_SEATS_WORKSPACE_KEY}
                event={eventKey}
                region={'na'}
                onObjectSelected={handleSelected}
                onObjectDeselected={handleDeselected}
                pricing={pricing}
                priceFormatter={(price) => '$' + price}
                selectedObjects={selectedObjects}
                mode={mode}
                onChartRendered={(chart) => {
                    chartRef.current = chart;

                    if (selectedObjects) {
                        chart.zoomToObjects(selectedObjects);
                    }
                }}
                showMinimap={mode !== "print"}
            />
        </div>
    );
}