import { getUserById } from "@/services/userService";
import Link from "next/link";

interface UserDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export async function generateMetadata(props: UserDetailPageProps) {
    const { id } = await props.params;
    
    const user = await getUserById(id);

    if (!user) {
        return {
            title: "Usuario no encontrado",
            description: "El usuario solicitado no existe."
        };
    }

    return {
        title: `${user.name} | Detalle del Usuario`,
        description: `Información detallada del usuario ${user.name}.`,
        openGraph: {
            title: `${user.name} | Detalle del Usuario`,
            description: `Información detallada del usuario ${user.name}.`,
            url: `https://tu-sitio.com/users/${user.id}`,
            type: "article",
            locale: "es_MX",
        }
    };
}

export default async function UserDetailPage(props: UserDetailPageProps) {
    const { id } = await props.params;

    const user = await getUserById(id);

    return (
        <div className="page-container">
            <h1>{user.name}</h1>

            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Usuario:</strong> {user.username}</p>
            <p><strong>Correo:</strong> {user.email}</p>

            <Link href={"/users"}>Regresar</Link>
        </div>
    );
}