import authMock from "@/data/auth.mock.json";
import { LoginResponseDto } from "@/models/login-response.dto";

export function login(email: string, inputPassword: string): LoginResponseDto | null {
    const user = authMock.users.find(
        u => u.email === email && u.password === inputPassword
    );

    if (!user) return null;

    const { password, ...rest } = user;
    return rest;
}