export { };

declare global {
    interface Window {
        PaymentSession: {
            configure: (config: unknown) => void;
            updateSessionFromForm: (form: string) => void;
        };
    }
}