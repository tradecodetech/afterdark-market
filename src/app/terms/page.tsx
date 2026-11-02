
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Review the terms governing use of the Pikaboo marketplace and creator community.",
  robots: {
    index: false,
    follow: false,
  },
};

const SUPPORT_EMAIL = "info@pikabooxo.com";

const sections = [
  {
    title: "1. About Pikaboo",
    paragraphs: [
      "Pikaboo is an adult-oriented marketplace and creator community. These draft terms describe the conditions for accessing the platform, browsing products, maintaining accounts, and participating in community features.",
      "The legal entity operating Pikaboo and the effective date of these terms must be confirmed before public launch.",
    ],
  },
  {
    title: "2. Adult Eligibility",
    paragraphs: [
      "Pikaboo is intended exclusively for adults who are at least 18 years old or the higher legal age required in their jurisdiction.",
      "Users must provide accurate eligibility information. Age confirmation alone does not constitute identity verification.",
      "Accounts or content associated with minors are prohibited and may be restricted or removed.",
    ],
  },
  {
    title: "3. Accounts and Security",
    paragraphs: [
      "Users are responsible for providing accurate registration information and protecting their account credentials.",
      "Users must not impersonate another person, access another user's account without authorization, or attempt to bypass platform security controls.",
      "Suspected unauthorized account access should be reported to Pikaboo support.",
    ],
  },
  {
    title: "4. Marketplace Products",
    paragraphs: [
      "Product listings may be provided by participating vendors. Availability, pricing, descriptions, and fulfillment arrangements may vary by product.",
      "Products must comply with applicable laws and platform requirements. Listings must not contain materially misleading descriptions or prohibited products.",
      "Purchases and fulfillment will be subject to the applicable published shipping, refund, and cancellation policies once checkout becomes available.",
    ],
  },
  {
    title: "5. Payments and Checkout",
    paragraphs: [
      "Online checkout is temporarily unavailable while Pikaboo completes its secure payment-provider integration.",
      "No completed purchase should be inferred from adding a product to a cart or viewing an estimated order total.",
      "Before accepting payments, Pikaboo will publish applicable payment, billing, refund, and cancellation terms.",
    ],
  },
  {
    title: "6. Creators and Memberships",
    paragraphs: [
      "Creator profiles, posts, memberships, sessions, and other community features may be available in different stages of development.",
      "Creators must have appropriate rights, permissions, and consent for any content they submit or publish.",
      "Paid memberships, recurring billing, tips, and creator payouts must not be represented as operational until the necessary payment and compliance systems are active.",
      "AI-generated or fictional creator identities must be clearly disclosed and must not be presented as verified human individuals.",
    ],
  },
  {
    title: "7. Prohibited Conduct",
    paragraphs: [
      "Users may not publish, solicit, distribute, or facilitate content involving minors, non-consensual sexual activity, exploitation, threats, harassment, impersonation, or unlawful conduct.",
      "Users may not upload content without the necessary rights or consent, attempt unauthorized access, distribute malware, or misuse personal information.",
      "Attempts to evade moderation, age restrictions, or applicable legal requirements are prohibited.",
    ],
  },
  {
    title: "8. Community Content",
    paragraphs: [
      "Users remain responsible for content they submit and for ensuring that they have the necessary rights and permissions.",
      "Pikaboo may review, restrict, or remove content that violates platform rules or applicable law.",
      "Additional content rules and reporting procedures will be described in the Community Guidelines.",
    ],
  },
  {
    title: "9. Reports and Account Restrictions",
    paragraphs: [
      "Users may report suspected prohibited content, impersonation, abuse, or other safety concerns through the published support contact.",
      "Pikaboo may restrict access or suspend accounts when necessary to address suspected violations, security concerns, or legal obligations.",
      "Final moderation procedures, appeals, and enforcement practices require review before broader platform launch.",
    ],
  },
  {
    title: "10. Service Availability",
    paragraphs: [
      "Some Pikaboo features are under development and may be unavailable, modified, or discontinued.",
      "The platform does not guarantee uninterrupted availability. Users should not rely on unfinished features for time-sensitive transactions.",
    ],
  },
  {
    title: "11. Legal Terms and Changes",
    paragraphs: [
      "Additional provisions addressing governing law, warranties, liability, dispute resolution, and other legal matters must be approved by the platform operator and qualified legal counsel before these terms are finalized.",
      "Material changes to finalized terms should be communicated as required by applicable law.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <p className="text-sm font-medium text-pink-500">
        Pikaboo Legal
      </p>

      <h1 className="mt-2 font-display text-3xl tracking-tight">
        Terms of Service
      </h1>

      <div className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
        Draft for business and legal review. These terms are not
        finalized for public launch.
      </div>

      <p className="mt-6 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
        Please review these terms before using Pikaboo.
        The final version will identify the legal platform
        operator and applicable effective date.
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
          Questions About These Terms
        </h2>

        <p className="mt-3 text-sm text-neutral-500">
          Contact Pikaboo at:
        </p>

        <a
          href={`mailto:${SUPPORT_EMAIL}?subject=Pikaboo%20Terms%20Question`}
          className="mt-3 inline-block break-all text-sm font-medium text-pink-500 underline"
        >
          {SUPPORT_EMAIL}
        </a>
      </section>
    </div>
  );
}
