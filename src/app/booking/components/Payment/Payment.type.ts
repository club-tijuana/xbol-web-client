export interface PaymentProps {
    subtotal?: number;
    taxes?: number;
    fees?: number;
    discount?: number;
    total?: number;
    currency?: string;
    paymentLinkCode?: string;
    showTotals?: boolean;
    scheduleId?: number;
    bundleId?: number;
    onPay?: () => void;
}