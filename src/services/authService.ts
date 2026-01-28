import authMock from "@/data/auth.mock.json";
import { LoginResponseDto } from "@/models/login-response.dto";

export function login(email: string, password: string): LoginResponseDto | null {
    const user = authMock.users.find(
        u => u.email === email && u.password === password
    );

    if (!user) return null;

    const { password: _, ...rest } = user;
    return rest;
}