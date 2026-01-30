import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";

import styles from "./TicketQRCard.module.scss";
import { TicketQRCardProps } from "./TicketQRCard.type";

export default function TicketQRCard({ ticket }: TicketQRCardProps) {
    return (
        <Card variant="outlined" className={styles.card}>
            <CardContent className={styles.cardContent}>
                <CardMedia
                    component="img"
                    image={ticket.image}
                    alt={"title"}
                    sx={{ display: 'block' }}
                />

                <Box className={styles.overlay} />

                <Box className={styles.cardInfo}>
                    <Typography variant="body3" className="textPrimary textBold">
                        {ticket.title}
                    </Typography>
                    <Typography variant="body1" className="textWhite">
                        {ticket.dateStr}
                    </Typography>
                    <Typography variant="body1" className="textWhite">
                        {ticket.location}
                    </Typography>
                    <Typography variant="body1" className="textWhite">
                        {'section'}
                    </Typography>
                    <Typography variant="body1" className="textWhite">
                        {'row - seat'}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}