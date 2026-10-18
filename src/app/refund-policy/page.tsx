
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description:
    "Learn about Pikaboo's proposed returns, refunds, damaged item procedures, and subscription cancellations.",
  robots: {
    index: false,
    follow: false,
  },
};

const SUPPORT_EMAIL = "damon.gcesolutions@gmail.com";

const sections = [
  {
    title: "1. Physical Product Returns",
    paragraphs: [
      "Under this proposed policy, customers may request a return within 30 calendar days after delivery for eligible physical products that are unopened, unused, and in their original packaging.",
      "Returns may require proof of purchase and review of the product's condition. Customers should contact Pikaboo support before sending any item back.",
      "Return eligibility, shipping arrangements, and any applicable return costs must be confirmed before this policy is finalized.",
    ],
  },
  {
    title: "2. Hygiene-Sensitive Products",
    paragraphs: [
      "For hygiene and safety reasons, opened or used intimate products generally will not be eligible for discretionary returns.",
      "This restriction does not remove any rights customers may have under applicable law for defective, damaged, misdescribed, or otherwise nonconforming products.",
    ],
  },
  {
    title: "3. Damaged, Defective, or Incorrect Items",
    paragraphs: [
      "If an order arrives damaged, defective, or different from the item purchased, customers should contact support with the order information and a description of the problem.",
      "Pikaboo will review the concern and coordinate with the responsible vendor where applicable.",
      "Depending on the circumstances and applicable law, an appropriate resolution may include replacement, repair, refund, or another legally required remedy.",
    ],
  },
  {
    title: "4. Return Authorization",
    paragraphs: [
      "Customers should email Pikaboo support before returning a product to request instructions.",
      "Do not send products to an address that has not been confirmed by support. Participating vendors may use different fulfillment or return locations.",
      "The final policy will specify who pays return shipping and how return labels are provided.",
    ],
  },
  {
    title: "5. Refund Processing",
    paragraphs: [
      "Once a return or refund request has been reviewed and approved, Pikaboo will provide information about the next steps.",
      "Approved refunds are expected to be issued through the original payment method when supported by the payment processor.",
      "Final processing timelines will be published after Pikaboo confirms its payment provider and vendor fulfillment procedures.",
    ],
  },
  {
    title: "6. Order Cancellations",
    paragraphs: [
      "Customers may contact support to request cancellation of an order that has not yet shipped.",
      "A cancellation cannot be guaranteed once fulfillment or shipping has begun. Eligible shipped orders may instead be handled through the return process.",
      "Online checkout is currently unavailable, so new purchases cannot presently be completed through Pikaboo.",
    ],
  },
  {
    title: "7. Digital Content",
    paragraphs: [
      "Digital purchases, downloads, and access-based creator content may have different refund conditions from physical products.",
      "Before paid digital content is enabled, Pikaboo will publish the applicable refund conditions, including any statutory cancellation rights and circumstances involving inaccessible or misdescribed content.",
      "This draft does not establish a blanket no-refund rule for digital purchases.",
    ],
  },
  {
    title: "8. Creator Memberships and Subscriptions",
    paragraphs: [
      "Paid creator memberships and recurring subscriptions are not currently available for completed payment transactions.",
      "Before recurring billing launches, Pikaboo will disclose the price, billing frequency, renewal terms, cancellation method, and applicable refund conditions.",
      "The proposed cancellation approach is to stop future renewals when a customer cancels, while maintaining already-paid access through the current billing period unless applicable terms or law require otherwise.",
      "The final subscription policy must be approved before recurring charges are enabled.",
    ],
  },
  {
    title: "9. Consumer Rights",
    paragraphs: [
      "Nothing in this policy is intended to limit rights or remedies that cannot legally be waived under applicable consumer-protection laws.",
      "Where applicable law provides additional return, refund, cancellation, or warranty rights, those requirements will apply.",
    ],
  },
  {
    title: "10. Contact for Returns and Refunds",
    paragraphs: [
      "Customers may contact Pikaboo support to ask questions about eligibility, damaged items, order cancellations, or refund requests.",
      "Please include relevant order information when available. Never email full payment card numbers, passwords, or sensitive financial credentials.",
    ],
  },
];

export default function RefundPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <p className="text-sm font-medium text-pink-500">
        Pikaboo Customer Care
      </p>

      <h1 className="mt-2 font-display text-3xl tracking-tight">
        Refund & Cancellation Policy
      </h1>

      <div className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
        Draft policy pending client approval and legal review.
        The proposed 30-day return window and other conditions
        are not yet finalized.
      </div>

      <p className="mt-6 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
        Pikaboo is preparing its marketplace for secure
        transactions. This draft outlines the proposed
        procedures for physical product returns, damaged
        items, digital content, and creator memberships.
      </p>

      <div className="mt-10 space-y-9">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-semibold">
              {section.title}
            </h2>

            <div className="mt-3 space-y-3">
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-sm leading-7 text-neutral-600 dark:text-neutral-400"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="mt-10 border-t border-neutral-200 pt-8 dark:border-neutral-800">
        <h2 className="text-lg font-semibold">
          Request Assistance
        </h2>

        <p className="mt-3 text-sm text-neutral-500">
          For return, refund, or cancellation questions,
          contact:
        </p>

        <a
          href={`mailto:${SUPPORT_EMAIL}?subject=Pikaboo%20Refund%20or%20Cancellation%20Request`}
          className="mt-3 inline-block break-all text-sm font-medium text-pink-500 underline"
        >
          {SUPPORT_EMAIL}
        </a>
      </section>
    </div>
  );
}
