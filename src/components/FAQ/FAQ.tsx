"use client";

import AddIcon from "@mui/icons-material/Add";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import { FaqDTO } from "@/models/faq.dto";
import { getFAQs } from "@/services/faqService";

import styles from "./FAQ.module.scss";

export default function FAQ() {
    const [faqs, setFaqs] = useState<FaqDTO[]>([]);

    useEffect(() => {
        async function load() {
            const response = await getFAQs();

            if (response) {
                setFaqs(response);
            }
        };

        load();
    }, []);

    return (
        <Box>
            <Typography variant="h3" color="primary">
                Preguntas frecuentes
            </Typography>
            <Box
                mt={2}
                display="grid"
                gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
                gap={2}
            >
                {faqs && faqs.length > 0 && faqs.map((faq, i) => (
                    <Accordion key={i} className={styles.question}
                        elevation={0}
                        square
                        sx={{
                            "&:before": { display: "none" },
                        }}>
                        <AccordionSummary
                            expandIcon={<AddIcon sx={{ color: "var(--color-primary)" }} />}
                            sx={{ padding: 0 }}
                        >
                            <Typography variant="subtitle1" color="secondary">
                                {faq.question}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="subtitle1" color="secondary">{faq.answer}</Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>
            <Box textAlign="center" mt={5}>
                <Button variant="outlined" size="large" sx={{ py: 1, px: 3 }}>
                    Consultar todas las preguntas frecuentes
                </Button>
            </Box>
        </Box>
    );
}