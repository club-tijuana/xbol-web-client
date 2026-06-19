"use client";

import { Typography } from "@mui/material";
import {
  SeatingChart,
  SeatsioSeatingChart,
  SelectableObject,
} from "@seatsio/seatsio-react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { publicEnv } from "@/config/env";
import { MyEventSeatDTO } from "@/models/my-event-seat.dto";
import { BookingSeatRequest } from "@/models/requests/booking-seat-request.dto";
import { SeatAvailabilityDTO } from "@/models/seat-availability.dto";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSeats } from "@/store/slices/bookingFlowSlice";

import Loader from "../Loader/Loader";

import { SeatsMapProps } from "./SeatsMap.type";

/* -------------------- CONSTANTS -------------------- */
const MAX_SEATS_SELECTION: number = 12;
const DISABLED_SELECTED_SEAT_COLOR: string = "#F85E30";

export interface SeatsMapHandle {
  getSelectedSeats: () => Array<BookingSeatRequest>;
  getSelectedSeatsDto: () => MyEventSeatDTO[];
  clearSelection: () => void;
  freezeSeatEvents: () => void;
}

// TODO: Make two components from this
// SeatsMap -> booking map
// SeatsPrintMap -> print mode
const SeatsMap = forwardRef<SeatsMapHandle, SeatsMapProps>(
  (
    {
      eventKey,
      pricing,
      initialSeats,
      selectedZone,
      mode = "normal",
      categoryFilter = {
        enabled: true,
        sortBy: "price",
        multiSelect: true,
        zoomOnSelect: true,
      },
      channels,
      blockSameSeats = false,
      isRenewalWindow = false,
      bookingStep = "selection",
      onSeatsChange,
    },
    ref,
  ) => {
    const dispatch = useAppDispatch();
    const reduxSeats = useAppSelector(
      (store) => store.bookingFlow.initialSeats,
    );
    const initSeats = mode === "print" ? initialSeats : reduxSeats;
    const originalSeats = useAppSelector(
      (store) => store.bookingFlow.originalSeats,
    );
    const orderLeftSeats = useAppSelector(
      (store) => store.bookingFlow.orderLeftSeats,
    );
    const seatAvailability = useAppSelector(
      (store) => store.bookingFlow.seatAvailability,
    );

    const initializedRef = useRef(false);
    const ignoreSeatEventsRef = useRef(false);
    const chartRef = useRef<SeatingChart | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentSelectedSeats, setCurrentSelectedSeats] = useState<
      Array<BookingSeatRequest>
    >([]);
    const selectedSeatsRef = useRef<Array<BookingSeatRequest>>([]);
    const chartConfig = eventKey ? { eventKey } : null;
    const initialSelectedSeats: Array<string> | undefined = initialSeats
      ? initialSeats.map((s) => s.seatKey)
      : undefined;
    const syncingRef = useRef(false);
    const hydratingSelectionRef = useRef(false);

    const groupSeatsBySection = (seats: Array<BookingSeatRequest>) => {
      return seats.reduce<Record<string, string[]>>((acc, seat) => {
        const section = seat.seatKey.split("-")[0];

        if (!acc[section]) {
          acc[section] = [];
        }

        acc[section].push(seat.seatKey);

        return acc;
      }, {});
    };

    const buildSectionDto = (
      section: string,
      seats: string[],
    ): MyEventSeatDTO => {
      return {
        section: seats.length > 1 ? `${section} x${seats.length}` : section,
        seats: seats.join(", "),
      };
    };

    useEffect(() => {
      if (mode === "print") {
        return;
      }

      initializedRef.current = false;
    }, [eventKey]);

    useEffect(() => {
      if (mode === "print") {
        return;
      }

      if (!syncingRef.current && onSeatsChange) {
        onSeatsChange();
      }

      syncingRef.current = false;
    }, [currentSelectedSeats]);

    useEffect(() => {
      if (mode === "print") {
        return;
      }

      if (!chartRef.current) return;

      const newSeats = initSeats ?? [];

      // TODO: test if one of this two lines can be removed
      hydratingSelectionRef.current = true;
      chartRef.current.clearSelection?.();
      chartRef.current.deselectObjects(
        currentSelectedSeats.map((s) => s.seatKey),
      );

      if (newSeats.length) {
        chartRef.current
          .trySelectObjects(newSeats.map((s) => s.seatKey))
          .catch()
          .finally(() => {
            hydratingSelectionRef.current = false;
          });
      }

      syncingRef.current = true;
      selectedSeatsRef.current = newSeats;
      setCurrentSelectedSeats(newSeats);
    }, [initSeats]);

    useEffect(() => {
      if (mode === "print") {
        return;
      }

      async function loadZone() {
        if (chartRef && chartRef.current && selectedZone) {
          chartRef.current.changeConfig({
            filteredCategories: [selectedZone],
          });

          chartRef.current.zoomToFilteredCategories();
        }
      }

      loadZone();
    }, [selectedZone]);

    useImperativeHandle(ref, () => ({
      getSelectedSeats: () => selectedSeatsRef.current,

      getSelectedSeatsDto: () => {
        const seats = selectedSeatsRef.current;

        if (!seats.length) {
          return [];
        }

        return Object.entries(groupSeatsBySection(seats)).map(
          ([section, seats]) => buildSectionDto(section, seats),
        );
      },

      clearSelection: () => {
        if (!chartRef.current) return;

        chartRef.current.deselectObjects(
          selectedSeatsRef.current.map((s) => s.seatKey),
        );

        selectedSeatsRef.current = [];
        setCurrentSelectedSeats([]);
        dispatch(setSeats([]));
      },

      freezeSeatEvents: () => {
        ignoreSeatEventsRef.current = true;
      },
    }));

    const handleChartRendered = async (chart: SeatingChart) => {
      chartRef.current = chart;

      if (!initializedRef.current && initialSeats && initialSeats.length > 0) {
        initializedRef.current = true;
      }

      if (initialSeats?.length) {
        selectedSeatsRef.current = initialSeats;
        setCurrentSelectedSeats(initialSeats);
      }

      if (initialSeats?.length && initialSelectedSeats) {
        hydratingSelectionRef.current = true;

        setTimeout(() => {
          if (mode === "normal") {
            hydratingSelectionRef.current = true;

            chart.trySelectObjects(initialSelectedSeats)
              .finally(() => {
                hydratingSelectionRef.current = false;
              });
          }

          chart.zoomToObjects(initialSelectedSeats);
        }, 500);
      }

      setIsLoading(false);
    };

    const handleSelected = (obj: SelectableObject) => {
      if (ignoreSeatEventsRef.current) return;
      if (hydratingSelectionRef.current) return;
      if (!seatAvailability) return;

      setCurrentSelectedSeats((prev) => {
        const exists = prev.some((s) => s.seatKey === obj.label);

        if (exists) {
          return prev;
        }

        const pricing = getSeatPricing(obj, seatAvailability);

        const updated = [
          ...prev,
          {
            seatKey: obj.label,
            seatPrice: pricing.seatPrice,
            priceListItemId: pricing.priceListItemId,
          },
        ];

        selectedSeatsRef.current = updated;

        dispatch(setSeats(updated));

        return updated;
      });
    };

    const handleDeselected = (obj: SelectableObject) => {
      if (ignoreSeatEventsRef.current) return;
      if (hydratingSelectionRef.current) return;
      if (!obj.labels.section) return;

      const updated = selectedSeatsRef.current.filter(
        (s) => s.seatKey !== obj.label,
      );

      selectedSeatsRef.current = updated;
      setCurrentSelectedSeats(updated);
      dispatch(setSeats(updated));
    };

    const getSeatPricing = (
      obj: SelectableObject,
      availability: SeatAvailabilityDTO,
    ) => {
      const seatOverride = availability.seatOverrides.find(
        (seat) => seat.externalSeatObjectKey === obj.label,
      );

      if (seatOverride?.priceOverride != null) {
        return {
          seatPrice: seatOverride.priceOverride,
          priceListItemId: seatOverride.priceListItemId ?? 0,
        };
      }

      const zoneName = obj.category?.label;
      const zone = availability.zones.find((z) => z.name === zoneName);

      return {
        seatPrice: zone?.price ?? 0,
        priceListItemId: zone?.priceListItemId ?? 0,
      };
    };

    return (
      <div>
        {chartConfig && (
          <SeatsioSeatingChart
            workspaceKey={publicEnv.NEXT_PUBLIC_SEATS_WORKSPACE_KEY}
            event={eventKey}
            region="na"
            pricing={pricing}
            mode={mode}
            showMinimap={mode !== "print"}
            categoryFilter={categoryFilter}
            channels={channels}
            maxSelectedObjects={
              orderLeftSeats ? orderLeftSeats : MAX_SEATS_SELECTION
            }
            onObjectSelected={
              mode !== "print" && bookingStep === "selection"
                ? handleSelected
                : undefined
            }
            onObjectDeselected={
              mode !== "print" && bookingStep === "selection"
                ? handleDeselected
                : undefined
            }
            onChartRendered={handleChartRendered}
            objectWithoutPricingSelectable={mode !== "normal"}
            onRenderStarted={() => setIsLoading(true)}
            onChartRenderingFailed={() => setIsLoading(false)}
            selectableObjects={
              isRenewalWindow ? originalSeats?.map((os) => os.seatKey) : []
            }
            extraConfig={{
              allowedSeats: initialSeats?.map((s) => s.seatKey) ?? [],
              mapBlockSameSeats: blockSameSeats,
              mapDisabledSelectedColor: DISABLED_SELECTED_SEAT_COLOR,
              viewMode: mode,
            }}
            objectColor={(object: any, defaultColor, extraConfig) => {
              if (
                extraConfig.mapBlockSameSeats ||
                extraConfig.viewMode === "print"
              ) {
                const type =
                  typeof object.objectType === "function"
                    ? object.objectType()
                    : object.objectType;

                if (!extraConfig.allowedSeats?.length) {
                  return defaultColor;
                }

                if (
                  type === "Seat" &&
                  extraConfig.allowedSeats.includes(
                    object.label,
                  )
                ) {
                  return extraConfig.mapDisabledSelectedColor;
                }

                return defaultColor;
              } else {
                return defaultColor;
              }
            }}
            isObjectVisible={(object: any, extraConfig) => {
              if (extraConfig.mapBlockSameSeats) {
                const type =
                  typeof object.objectType === "function"
                    ? object.objectType()
                    : object.objectType;

                if (!extraConfig.allowedSeats?.length) {
                  return true;
                }

                if (type === "Seat") {
                  return extraConfig.allowedSeats.includes(object.label);
                }

                return type === "row" || type === "section";
              } else {
                return true;
              }
            }}
          />
        )}
        <Loader isLoading={isLoading} />
      </div>
    );
  },
);

SeatsMap.displayName = "SeatsMap";

export default SeatsMap;
