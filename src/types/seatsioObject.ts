import { SelectableObject } from "@seatsio/seatsio-react";

export type SeatsioObject = SelectableObject & {
    objectType?: string | (() => string);
    labels: {
        displayLabel: string;
        section?: string;
    };
};