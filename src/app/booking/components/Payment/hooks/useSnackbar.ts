import { useState } from "react";

import { AlertColor } from "@mui/material";

interface SnackbarState {
    open: boolean;
    message: string;
    severity: AlertColor;
}

export function useSnackbar() {
    const [state, setState] = useState<SnackbarState>({
        open: false,
        message: "",
        severity: "success"
    });

    const show = (message: string, severity: AlertColor = "success") =>
        setState({ open: true, message, severity });

    const close = () => setState(prev => ({ ...prev, open: false }));

    return { ...state, show, close };
}
