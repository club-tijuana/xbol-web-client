import { User } from "@/models/user.dto";

interface UserCardProps {
    user: User;
}

export default function UserCard({ user }: UserCardProps) {
    return (
        <div style={{ border: "1px solid #ddd", padding: "12px", borderRadius: 8 }}>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
        </div>
    );
}