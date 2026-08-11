import { MockPaymentProvider } from "@/lib/payments/mock-provider";
import type { PaymentProvider } from "@/lib/payments/types";

// To go live with a high-risk-friendly processor (Stripe/PayPal disallow
// adult products): implement PaymentProvider in a new file (e.g.
// ccbill-provider.ts) and add a case below. No other code changes needed —
// checkout, refunds, and the Payment model are all provider-agnostic.
export function getPaymentProvider(): PaymentProvider {
  const provider = process.env.PAYMENT_PROVIDER ?? "mock";

  switch (provider) {
    case "mock":
      return new MockPaymentProvider();
    default:
      throw new Error(`Unknown payment provider: ${provider}`);
  }
}

export * from "@/lib/payments/types";
