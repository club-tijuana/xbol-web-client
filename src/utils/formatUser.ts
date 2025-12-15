import { User } from "@/models/user.dto";

export function formatUser(user: User): string {
    return `${user.name} (${user.id})`;
}