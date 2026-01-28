import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    user: {
        id: number;
        name: string;
        lastName: string;
        token: string;
    } | null;
}

const initialState: AuthState = {
    user: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<AuthState["user"]>) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = null;
        }
    }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;