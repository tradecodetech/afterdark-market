
"use server";

export type GiftActionState =
  | { error?: string; success?: string }
  | undefined;

/**
 * PIKABOO PRELAUNCH
 *
 * Creator gifts are disabled until payment processing,
 * creator verification, and launch compliance are ready.
 *
 * This action does not charge a card, create a gift,
 * or record creator earnings.
 */
export async function sendCreatorGift(
  _prevState: GiftActionState,
  _formData: FormData,
): Promise<GiftActionState> {
  return {
    error:
      "Creator gifts are temporarily unavailable while Pikaboo prepares for launch. No payment has been collected.",
  };
}
