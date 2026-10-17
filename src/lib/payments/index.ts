
import { MockPaymentProvider } from "@/lib/payments/mock-provider";
import type { PaymentProvider } from "@/lib/payments/types";

export function getPaymentProvider(): PaymentProvider {
  const provider = process.env.PAYMENT_PROVIDER ?? "mock";

  if (process.env.NODE_ENV === "production" && provider === "mock") {
    throw new Error(
      "Mock payments are disabled in production. Configure an approved payment provider."
    );
  }

  switch (provider) {
    case "mock":
      return new MockPaymentProvider();

    default:
      throw new Error(`Unknown payment provider: ${provider}`);
  }
}

export * from "@/lib/payments/types";
