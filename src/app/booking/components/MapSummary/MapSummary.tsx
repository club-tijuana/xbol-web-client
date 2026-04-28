import { Box, Grid, Typography } from "@mui/material";

import { formatCurrency } from "@/helpers/formatCurrencyHelper";
import { colors } from "@/theme/colors";

interface MapSummaryProps {
    seats: [string, number][];
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
                {seats.map(s => (
                    <Grid size={2} key={s[0]}>
                        <Box display="flex" alignItems="center">
                            <Typography color="secondary">
                                {s[0]}
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
                                {formatCurrency(s[1])}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}