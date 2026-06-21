"use client";

import { Box, Button, Typography } from "@mui/material";
import { Pricing } from "@seatsio/seatsio-react";
import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import SeatsMap, { SeatsMapHandle } from "@/components/SeatsMap/SeatsMap";
import { MyEventSeatDTO } from "@/models/my-event-seat.dto";
import { BookingSeatRequest } from "@/models/requests/booking-seat-request.dto";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setRenovationType } from "@/store/slices/bookingFlowSlice";
import { BookingMode } from "@/types/bookingMode";
import { BookingStep } from "@/types/bookingStep";

import MapSummary from "../MapSummary/MapSummary";
import Payment from "../Payment/Payment";

export interface BookingRightPanelHandle {
  getSelectedSeats: () => Array<BookingSeatRequest>;
  getSelectedSeatsDto: () => MyEventSeatDTO[];
  clearSelection: () => void;
  freezeSeatEvents: () => void;
}

interface BookingRightPanelProps {
  mapKey: string;
  bookingMode: BookingMode;
  bookingStep: BookingStep;
  selectedZone?: string;
  zonesPrices: Pricing | undefined;
  isRenewalWindow?: boolean;
  scheduleId?: number;
  bundleId?: number;
  onPay?: () => void;
}

const BookingRightPanel = forwardRef<
  BookingRightPanelHandle,
  BookingRightPanelProps
>(
  (
    {
      mapKey,
      bookingMode,
      bookingStep,
      selectedZone,
      zonesPrices,
      isRenewalWindow = false,
      scheduleId,
      bundleId,
      onPay,
    },
    ref,
  ) => {
    const mapRef = useRef<SeatsMapHandle>(null);
    const dispatch = useAppDispatch();

    const initialSeats = useAppSelector(
      (store) => store.bookingFlow.initialSeats,
    );
    const selectedSeats = useAppSelector(
      (store) => store.bookingFlow.selectedSeats,
    );
    const renovationType = useAppSelector(
      (store) => store.bookingFlow.renovationType,
    );

    const [mapSelectionSummary, setMapSelectionSummary] = useState<
      BookingSeatRequest[] | undefined
    >();

    useImperativeHandle(ref, () => ({
      getSelectedSeats: () => mapRef.current?.getSelectedSeats() ?? [],

      getSelectedSeatsDto: () =>
        mapRef.current?.getSelectedSeatsDto() ?? [],

      clearSelection: () =>
        mapRef.current?.clearSelection(),

      freezeSeatEvents: () =>
        mapRef.current?.freezeSeatEvents(),
    }));

    const TAX_NAMES = new Set(["IVA", "ISR", "IEPS"]);

    const { subtotal, taxes, fees, total } = useMemo(() => {
      let _subtotal = 0;
      let _taxes = 0;
      let _fees = 0;

      selectedSeats?.forEach((s) => {
        _subtotal += s.seatPrice;
        s.fees?.forEach((f) => {
          if (TAX_NAMES.has(f.feeType)) {
            _taxes += f.amount;
          } else {
            _fees += f.amount;
          }
        });
      });

      return {
        subtotal: _subtotal,
        taxes: _taxes,
        fees: _fees,
        total: _subtotal + _fees + _taxes,
      };
    }, [initialSeats, selectedSeats]);

    const handleOnMapSeatChange = () => {
      if (mapRef.current) {
        const seats = mapRef.current.getSelectedSeats();
        setMapSelectionSummary(seats);
      } else {
        setMapSelectionSummary([]);
      }
    };

    const handleSetSeats = () => {
      setMapSelectionSummary([]);
      dispatch(setRenovationType("changeSeats"));
    };

    const renderContent = () => {
      switch (bookingStep) {
        case "selection":
          return mapKey ? (
            <Box>
              <SeatsMap
                ref={mapRef}
                selectedZone={selectedZone}
                initialSeats={initialSeats}
                eventKey={mapKey}
                pricing={zonesPrices}
                blockSameSeats={
                  bookingMode === "renovateSeason" &&
                  renovationType === "sameSeats"
                }
                isRenewalWindow={isRenewalWindow}
                onSeatsChange={handleOnMapSeatChange}
                bookingStep={bookingStep}
              />
              {bookingMode === "renovateSeason" &&
                renovationType === "sameSeats" &&
                !isRenewalWindow && (
                  <Box textAlign="center">
                    <Button
                      variant="contained"
                      sx={{ py: 1.3, px: 4, mt: 3 }}
                      onClick={handleSetSeats}
                    >
                      <Typography variant="body2" color="neutral">
                        Cambiar asientos
                      </Typography>
                    </Button>
                  </Box>
                )}
              {mapSelectionSummary && mapSelectionSummary.length > 0 && (
                <MapSummary seats={mapSelectionSummary} />
              )}
            </Box>
          ) : null;
        case "payment":
          return (
            <Payment
              subtotal={subtotal}
              taxes={taxes}
              fees={fees}
              total={total}
              currency="MXN"
              scheduleId={scheduleId}
              bundleId={bundleId}
              onPay={onPay}
            />
          );
        default:
          return null;
      }
    };

    return renderContent();
  },
);

BookingRightPanel.displayName = "BookingRightPanel";

export default BookingRightPanel;
