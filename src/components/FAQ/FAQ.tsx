import AddIcon from "@mui/icons-material/Add";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Typography } from "@mui/material";

import styles from "./FAQ.module.scss";

export default function FAQ() {
    return (
        <Box>
            <Typography variant="xl2" className="textPrimary">
                Preguntas frecuentes
            </Typography>
            <Box mt={2}>
                <Accordion className={styles.question}>
                    <AccordionSummary
                        expandIcon={<AddIcon sx={{ color: "var(--color-text-primary)" }} />}
                        sx={{ padding: 0 }}
                    >
                        <Typography variant="subtitle1" className="textSecondary">
                            ¿Mis tickets están potegidos?
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion className={styles.question}>
                    <AccordionSummary
                        expandIcon={<AddIcon sx={{ color: "var(--color-text-primary)" }} />}
                        sx={{ padding: 0 }}
                    >
                        <Typography variant="subtitle1" className="textSecondary">
                            ¿Qué pasa si ya no puedo ir a mi evento?
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion className={styles.question}>
                    <AccordionSummary
                        expandIcon={<AddIcon sx={{ color: "var(--color-text-primary)" }} />}
                        sx={{ padding: 0 }}
                    >
                        <Typography variant="subtitle1" className="textSecondary">
                            ¿Cómo pedir un reembolso?
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            </Box>
            <Box textAlign="center" mt={5}>
                <Button variant="outlined" className="btnPrimaryOutlined">
                    <Typography variant="subtitle2">
                        Consultar todas las preguntas frecuentes
                    </Typography>
                </Button>
            </Box>
        </Box>
    );
}