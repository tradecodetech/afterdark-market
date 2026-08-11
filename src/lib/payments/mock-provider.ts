import { randomUUID } from "crypto";
import { PAYMENT_STATUS } from "@/lib/constants";
import type {
  ChargeInput,
  ChargeResult,
  PaymentProvider,
  RefundInput,
  RefundResult,
} from "@/lib/payments/types";

// Test-card numbers, same convention as Stripe's test mode, so checkout is
// fully exercisable without any real processor credentials.
const DECLINE_CARD = "4000000000000002";

export class MockPaymentProvider implements PaymentProvider {
  readonly name = "mock";

  async charge(input: ChargeInput): Promise<ChargeResult> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const digits = input.cardNumber.replace(/\s+/g, "");
    if (digits === DECLINE_CARD) {
      return {
        success: false,
        providerRef: `mock_decline_${randomUUID()}`,
        status: PAYMENT_STATUS.FAILED,
        message: "Card declined.",
      };
    }

    if (digits.length < 12) {
      return {
        success: false,
        providerRef: `mock_invalid_${randomUUID()}`,
        status: PAYMENT_STATUS.FAILED,
        message: "Invalid card number.",
      };
    }

    return {
      success: true,
      providerRef: `mock_ch_${randomUUID()}`,
      status: PAYMENT_STATUS.CAPTURED,
    };
  }

  async refund(input: RefundInput): Promise<RefundResult> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    void input;
    return { success: true, status: PAYMENT_STATUS.REFUNDED };
  }
}
