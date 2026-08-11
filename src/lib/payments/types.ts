import type { PaymentStatus } from "@/lib/constants";

export type ChargeInput = {
  orderId: string;
  amountCents: number;
  currency?: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
};

export type ChargeResult = {
  success: boolean;
  providerRef: string;
  status: PaymentStatus;
  message?: string;
};

export type RefundInput = {
  providerRef: string;
  amountCents: number;
};

export type RefundResult = {
  success: boolean;
  status: PaymentStatus;
  message?: string;
};

// Every payment provider (mock, CCBill, Segpay, Epoch, ...) implements this
// interface. The rest of the app (checkout, refunds) only ever talks to
// this interface, so swapping the underlying processor is a one-file change
// — see src/lib/payments/index.ts.
export interface PaymentProvider {
  readonly name: string;
  charge(input: ChargeInput): Promise<ChargeResult>;
  refund(input: RefundInput): Promise<RefundResult>;
}
