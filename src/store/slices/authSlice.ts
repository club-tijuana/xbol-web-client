import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { getErrorMessage } from "@/helpers/getErrorMessage";
import { RegisterRequest } from "@/models/auth-profile.dto";
import { AuthDto } from "@/models/auth.dto";
import { login as loginService, register as registerService } from "@/services/authService";


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

export const register = createAsyncThunk<
    AuthDto,
    RegisterRequest,
    { rejectValue: string }
>(
    "auth/register",
    async (request, thunkAPI) => {
        try {
            const response = await registerService(request);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                getErrorMessage(error, "Error al registrar cuenta")
            );
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<AuthDto | null>) => {
            state.user = action.payload;
            state.status = action.payload ? "success" : "idle";
        },
        logout: (state) => {
            state.user = null;
            state.status = "idle";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = "loading";
                state.user = null;
                state.error = undefined;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = "success";
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.status = "error";
                state.error = action.payload;
                state.user = null;
            })
            .addCase(register.pending, (state) => {
                state.status = "loading";
                state.user = null;
                state.error = undefined;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.status = "success";
                state.user = action.payload;
            })
            .addCase(register.rejected, (state, action) => {
                state.status = "error";
                state.error = action.payload;
                state.user = null;
            });
    }
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
