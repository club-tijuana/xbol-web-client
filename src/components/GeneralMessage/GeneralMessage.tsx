"use client";

import { Alert, Snackbar } from "@mui/material";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearGeneralMessage } from "@/store/slices/uiSlice";

export default function GeneralMessage() {
    const dispatch = useAppDispatch();
    const generalMessage = useAppSelector(state => state.ui.generalMessage);

    return (
        <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={!!generalMessage.message}
            autoHideDuration={4000}
            onClose={() => dispatch(clearGeneralMessage())}>
            <Alert
                severity={generalMessage.severity}
                variant="filled"
                sx={{ width: "100%" }}>
                {generalMessage.message}
            </Alert>
        </Snackbar>
    );
}
