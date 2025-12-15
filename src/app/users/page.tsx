import UserCard from "@/components/UserCard/UserCard";
import { getUsers } from "@/services/userService";
import Link from "next/link";

export const metadata = {
    title: "Listado de Usuarios | Mi App",
    description: "Explora el listado de usuarios obtenidos desde JSONPlaceholder.",
    openGraph: {
        title: "Listado de Usuarios",
        description: "Explora el listado de usuarios obtenidos desde JSONPlaceholder.",
        url: "https://tu-sitio.com/users",
        siteName: "Mi App",
        locale: "es_MX",
        type: "website"
    }
};

export default async function UsersPage() {
    const users = await getUsers();

    return (
        <div style={{ padding: 20 }}>
            <h1>Usuarios</h1>

            <div style={{ display: "grid", gap: 16 }}>
                {
                    users.map((user) => (
                        <Link key={user.id} href={`/users/${user.id}`}>
                            <UserCard user={user} />
                        </Link>
                    ))
                }
            </div>
        </div>
    );
}