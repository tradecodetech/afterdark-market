
"use server";

export type CheckoutState = {
  error?: string;
} | undefined;

/**
 * Checkout is temporarily disabled until an approved
 * hosted payment provider is integrated.
 *
 * No card details are collected or processed.
 * No orders, payments, rewards, or inventory are modified.
 */
export async function placeOrder(
  _prevState: CheckoutState,
  _formData: FormData,
): Promise<CheckoutState> {
  return {
    error:
      "Secure checkout is temporarily unavailable. Please try again later.",
  };
}
