export function getVisitorId() {
    if (typeof window === "undefined") {
        return "server-visitor";
    }

    const key = "visitorId";
    let visitorId = localStorage.getItem(key);

    if (!visitorId) {
        visitorId = crypto.randomUUID();
        localStorage.setItem(key, visitorId);
    }

    return visitorId;
}