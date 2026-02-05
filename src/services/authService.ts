import { AuthDto } from "@/models/auth.dto";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function login(username: string, password: string): Promise<AuthDto> {
    const response = await fetch(`${BASE_URL}account/sign-in`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
        throw new Error("Login error");
    }

    return response.json();
}