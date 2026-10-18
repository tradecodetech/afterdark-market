
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Community Guidelines",
  description:
    "Review Pikaboo's community safety, creator content, and participation guidelines.",
  robots: {
    index: false,
    follow: false,
  },
};

const SUPPORT_EMAIL = "damon.gcesolutions@gmail.com";

const sections = [
  {
    title: "1. Adults-Only Community",
    paragraphs: [
      "Pikaboo is intended exclusively for adults aged 18 or older, or the higher minimum age required by applicable law.",
      "Minors are not permitted to register, participate in adult community features, or appear in sexual content.",
      "Age confirmation is not the same as identity verification. Creator onboarding and verification procedures must be finalized before unrestricted creator participation.",
    ],
  },
  {
    title: "2. Consent and Personal Rights",
    paragraphs: [
      "All real people depicted in adult content must be adults who have consented to the creation and permitted use of that content.",
      "Content involving non-consensual sexual activity, exploitation, coercion, trafficking, or abuse is strictly prohibited.",
      "Creators must have the necessary rights and permissions for every person and work represented in their submissions.",
    ],
  },
  {
    title: "3. Prohibited Content",
    paragraphs: [
      "Content involving minors, sexual exploitation, non-consensual intimate imagery, threats, harassment, stalking, or unlawful activity is prohibited.",
      "Users may not publish private personal information without authorization or upload material that infringes intellectual property rights.",
      "Pikaboo prohibits attempts to evade content restrictions, impersonate other users, or distribute malicious links and software.",
    ],
  },
  {
    title: "4. Creator Profiles and Authenticity",
    paragraphs: [
      "Creator profiles must not materially misrepresent who or what they represent.",
      "AI-generated, fictional, or synthetic creator identities must be clearly disclosed. They must not impersonate real people or imply verification that has not occurred.",
      "Creators must not claim identity or age verification unless the applicable verification process has actually been completed.",
    ],
  },
  {
    title: "5. Community Conduct",
    paragraphs: [
      "Treat other members respectfully. Harassment, intimidation, threats, discriminatory abuse, and repeated unwanted contact are not permitted.",
      "Do not pressure other users to share private information, send intimate material, or engage in unwanted interactions.",
      "Users are responsible for the messages, posts, and other material they submit.",
    ],
  },
  {
    title: "6. Creator Posts and Media",
    paragraphs: [
      "Creators may submit profile information, posts, and media through supported platform features.",
      "Submitted content must comply with applicable law, these guidelines, and the platform's Terms of Service.",
      "Content submission or an account-level approval flag does not by itself establish that identity, age, consent, or content rights have been independently verified.",
    ],
  },
  {
    title: "7. Memberships, Tips, and Sessions",
    paragraphs: [
      "Creator memberships, tips, paid sessions, and related features may be in development or demonstration stages.",
      "Users and creators must not represent unavailable payment features as active or request that customers bypass platform payment safeguards.",
      "Billing, cancellation, payout, and service rules must be published and approved before paid creator services launch.",
    ],
  },
  {
    title: "8. Privacy and Personal Information",
    paragraphs: [
      "Do not share another person's private information without permission.",
      "Avoid publishing sensitive personal information, financial credentials, private addresses, or identification documents in community posts or messages.",
      "For information about platform data practices, review the Privacy Policy.",
    ],
  },
  {
    title: "9. Reporting Safety Concerns",
    paragraphs: [
      "Users may report suspected prohibited content, underage participation, impersonation, harassment, privacy violations, or other safety concerns through Pikaboo support.",
      "Reports should include the relevant profile or content link and a description of the concern when available.",
      "Do not send illegal sexual imagery or unnecessary sensitive personal documents through ordinary email. Contact support for appropriate reporting instructions.",
    ],
  },
  {
    title: "10. Moderation and Enforcement",
    paragraphs: [
      "Pikaboo may review, restrict, or remove content and accounts associated with suspected policy violations, security concerns, or applicable legal requirements.",
      "The platform's moderation, escalation, appeals, and verification procedures must be finalized and tested before broader community launch.",
      "These guidelines do not guarantee that all user-generated content has been reviewed or verified.",
    ],
  },
  {
    title: "11. Updates to These Guidelines",
    paragraphs: [
      "These guidelines may be revised as Pikaboo develops its marketplace, creator onboarding, moderation, and payment systems.",
      "The final approved guidelines should identify their effective date and be made available to users before full community launch.",
    ],
  },
];

export default function CommunityGuidelinesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <p className="text-sm font-medium text-pink-500">
        Pikaboo Community
      </p>

      <h1 className="mt-2 font-display text-3xl tracking-tight">
        Community Guidelines
      </h1>

      <div className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
        Draft guidelines pending client approval, operational
        review, and legal review.
      </div>

      <p className="mt-6 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
        Pikaboo is building an adults-only marketplace and
        creator community. These guidelines outline the
        proposed standards for safe, lawful, and respectful
        participation.
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
          Related Policies
        </h2>

        <div className="mt-4 flex flex-wrap gap-5 text-sm">
          <Link
            href="/terms"
            className="text-pink-500 underline"
          >
            Terms of Service
          </Link>

          <Link
            href="/privacy"
            className="text-pink-500 underline"
          >
            Privacy Policy
          </Link>

          <Link
            href="/refund-policy"
            className="text-pink-500 underline"
          >
            Refund & Cancellation Policy
          </Link>
        </div>
      </section>

      <section className="mt-10 border-t border-neutral-200 pt-8 dark:border-neutral-800">
        <h2 className="text-lg font-semibold">
          Report a Concern
        </h2>

        <p className="mt-3 text-sm text-neutral-500">
          For safety reports, community concerns, or
          questions about these guidelines, contact:
        </p>

        <a
          href={`mailto:${SUPPORT_EMAIL}?subject=Pikaboo%20Community%20Safety%20Report`}
          className="mt-3 inline-block break-all text-sm font-medium text-pink-500 underline"
        >
          {SUPPORT_EMAIL}
        </a>
      </section>
    </div>
  );
}
