import axios from "axios";

export function getErrorMessage(error: unknown, defaultMessage = "Unexpected error"): string {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data;

        if (typeof data === "string") {
            return data;
        }

        if (
            typeof data === "object"
            && data !== null
        ) {
            if ("message" in data && typeof data.message === "string") {
                return data.message;
            }

            if ("title" in data && typeof data.title === "string") {
                return data.title;
            }
        }

        return error.message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return defaultMessage;
}