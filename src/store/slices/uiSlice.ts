import { AlertColor } from "@mui/material";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type GeneralMessagePayload = {
    message: string;
    severity: AlertColor;
};

type GeneralMessage = {
    message?: string;
    severity: AlertColor;
}

interface UIState {
    loginModalOpen: boolean;
    generalMessage: GeneralMessage;
}

const initialState: UIState = {
    loginModalOpen: false,
    generalMessage: {
        message: undefined,
        severity: "success"
    }
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        openLoginModal: (state) => {
            state.loginModalOpen = true;
        },
        closeLoginModal: (state) => {
            state.loginModalOpen = false;
        },
        showGeneralMessage: (state, action: PayloadAction<GeneralMessagePayload>) => {
            state.generalMessage.message = action.payload.message;
            state.generalMessage.severity = action.payload.severity;
        },
        clearGeneralMessage: (state) => {
            state.generalMessage.message = undefined;
            state.generalMessage.severity = "success";
        }
    }
});

export const {
    openLoginModal,
    closeLoginModal,
    showGeneralMessage,
    clearGeneralMessage
} = uiSlice.actions;
export default uiSlice.reducer;