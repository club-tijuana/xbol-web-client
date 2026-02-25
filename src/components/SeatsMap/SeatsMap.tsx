"use client";

import { SeatingChart, SeatsioSeatingChart, SelectableObject } from "@seatsio/seatsio-react";
import { useEffect, useRef } from "react";

import { SeatsMapProps } from "./SeatsMap.type";

/* TODO:
1. Refactor SeatsMap to manage seat selection and deselection internally.
 - Use chartRef to call selectObjects/deselectObjects directly.
 - Avoid passing 'selectedObjecs' as a prop that changes on every click.

2. Keep Redux state in sync without causing re-renders of the chart.
 - 'onSelect' and 'onDeselected' handlers should updatte Redux only.
 - Chart visual state should be handled internally via chartRef.

3. Ensure chart initialization and zoom logic is only run once.
 - Use 'useEffect' for initial zoom to section.
 - Avoid re-running selection logic in useEffect when Redux state updates.

4. Test chart behavior:
 - Selecting seats should not cause "flash" or zoom reset.
 - Deselecting seats should update visual selection smoothly.
 - Navigating away and back should show correct selections.

5. Optional improvements:
 - Consider debouncing Redux updates if performance becomes an issue.
 - Make 'SeatsMap' fully self-contained and "controlled" internally. */
export default function SeatsMap({ eventKey, pricing, selectedObjects, selectedSection, mode = "normal", onSelected, onDeselected }: SeatsMapProps) {
    const chartRef = useRef<SeatingChart | null>(null);

    useEffect(() => {
        if (!chartRef.current) return;

        if (selectedSection) {
            chartRef.current.zoomToSection(selectedSection);
        }
    }, [selectedSection]);

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

                    if (selectedSection) {
                        chart.zoomToSection(selectedSection);
                    }
                }}
                showMinimap={mode !== "print"}

            />
        </div>
    );
}