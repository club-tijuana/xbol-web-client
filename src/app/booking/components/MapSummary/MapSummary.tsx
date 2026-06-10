import { Box, Grid, Typography } from "@mui/material";

import { formatCurrency } from "@/helpers/formatCurrencyHelper";
import { BookingSeatRequest } from "@/models/requests/booking-seat-request.dto";
import { colors } from "@/theme/colors";

interface MapSummaryProps {
    seats: BookingSeatRequest[];
}

export default function MapSummary({ seats }: MapSummaryProps) {
    return (
        <Box mt={3}>
            <Grid container columns={2} px={10}>
                <Grid size={1}>
                    <Typography variant="subtitle1">
                        Asiento
                    </Typography>
                </Grid>
                <Grid size={1}>
                    <Typography variant="subtitle1" textAlign="right">
                        Precio
                    </Typography>
                </Grid>
                {seats.map((s, i) => (
                    <Grid size={2} key={`${s.seatKey}${i}`}>
                        <Box display="flex" alignItems="center">
                            <Typography color="secondary">
                                {s.seatKey}
                            </Typography>
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    borderBottom: "1px solid",
                                    borderColor: colors.brand.primary,
                                    mx: 1
                                }}
                            />
                            <Typography textAlign="right" color="secondary">
                                {formatCurrency(s.seatPrice)}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}