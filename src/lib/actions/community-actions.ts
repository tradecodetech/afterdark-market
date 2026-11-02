
"use server";

/**
 * PIKABOO PRELAUNCH
 *
 * Paid creator contact requests and their responses
 * are temporarily disabled.
 *
 * These server actions intentionally perform no
 * payment processing or database mutations.
 *
 * Do not restore paid contact functionality until
 * payment processing, creator verification, and
 * launch compliance have been approved.
 */

export type CommunityActionState =
  | {
      error?: string;
      success?: string;
    }
  | undefined;

/**
 * Disabled during prelaunch.
 *
 * No card information is processed.
 * No payment is attempted.
 * No contact request is created.
 */
export async function requestCreatorContact(
  _prevState: CommunityActionState,
  _formData: FormData,
): Promise<CommunityActionState> {
  return {
    error:
      "Creator contact requests are temporarily unavailable while Pikaboo prepares for launch. No payment has been collected.",
  };
}

/**
 * Disabled during prelaunch.
 *
 * Existing requests cannot be accepted or declined
 * through this action, and no private session
 * records can be generated.
 */
export async function respondToContactRequest(
  _formData: FormData,
): Promise<CommunityActionState> {
  return {
    error:
      "Creator contact requests are unavailable during Pikaboo's prelaunch.",
  };
}
