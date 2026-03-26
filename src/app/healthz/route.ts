import { NextResponse } from "next/server";

/** Evita respuestas cacheadas en CDN/proxy; el probe debe reflejar el proceso actual. */
export const dynamic = "force-dynamic";

export async function GET() {
    return NextResponse.json(
        {
            appName: "XBOL.PWRTicket",
            environment: process.env["NODE_ENV"],
            status: "Healthy",
            dockerImageVersion: process.env["DOCKER_IMAGE_VERSION"],
        },
        {
            status: 200,
            headers: {
                "Cache-Control": "no-store, no-cache, must-revalidate",
            },
        }
    );
}
