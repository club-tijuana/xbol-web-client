import { User } from "@/models/user.dto";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getUsers(): Promise<User[]> {
    const response = await fetch(`${BASE_URL}/users`);
    if (!response.ok) throw new Error("Error fetching users");
    return response.json();
}

export async function getUserById(id: string): Promise<User> {
    if (!id) throw new Error("ID vacío o undefined");

    const response = await fetch(`${BASE_URL}/users/${id}`);
    if (!response.ok) throw new Error("User not found");
    return response.json();
}