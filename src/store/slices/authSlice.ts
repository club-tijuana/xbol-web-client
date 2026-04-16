import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getErrorMessage } from "@/helpers/getErrorMessage";
import { AuthDto } from "@/models/auth.dto";
import { login as loginService } from "@/services/authService";


interface LoginPayload {
    username: string;
    password: string;
}

interface AuthState {
    user: AuthDto | null;
    status: "idle" | "loading" | "success" | "error";
    error?: string;
}

const initialState: AuthState = {
    user: null,
    status: "idle"
};

export const login = createAsyncThunk<
    AuthDto,
    LoginPayload,
    { rejectValue: string }
>(
    "auth/login",
    async ({ username, password }, thunkAPI) => {
        try {
            const response = await loginService(username, password);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                getErrorMessage(error, "Error al iniciar sesión")
            );
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = "loading";
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = "success";
                state.user = action.payload;
            })
            .addCase(login.rejected, (state) => {
                state.status = "error";
            });
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;