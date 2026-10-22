
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Pikaboo collects, uses, and protects personal information.",
  robots: {
    index: false,
    follow: false,
  },
};

const SUPPORT_EMAIL = "damon.gcesolutions@gmail.com";

const sections = [
  {
    title: "1. Information We Collect",
    paragraphs: [
      "When you register for Pikaboo, we collect information such as your name, email address, date of birth, and account credentials. Passwords are stored as hashes rather than plaintext.",
      "Depending on the features you use, we may collect phone numbers, verification information, shipping addresses, cart contents, order records, and reward activity.",
      "Creator and vendor features may involve profile details, uploaded media, community posts, messages, membership records, and business contact information.",
    ],
  },
  {
    title: "2. How We Use Information",
    paragraphs: [
      "We use personal information to operate accounts, authenticate users, manage marketplace and community features, respond to support requests, and maintain platform safety.",
      "Where applicable, we also use information to manage orders, investigate misuse, and comply with legal obligations.",
    ],
  },
  {
    title: "3. Cookies and Sessions",
    paragraphs: [
      "Pikaboo uses cookies and related technologies to support authentication and the site's age-confirmation experience.",
      "Authentication uses JWT-based sessions. Session information may include an account identifier, user role, and vendor association.",
      "Pikaboo does not currently have Google Analytics or Meta Pixel configured. Other hosting or infrastructure services may process technical information necessary to operate the website.",
    ],
  },
  {
    title: "4. Payments",
    paragraphs: [
      "Online checkout is temporarily unavailable while Pikaboo prepares integration with an approved payment processor.",
      "When payments become available, this policy will be updated to explain the payment provider's role and the information shared to process transactions.",
      "Pikaboo's payment records are designed to store transaction details such as amounts, statuses, and provider references rather than full payment card numbers.",
    ],
  },
  {
    title: "5. Sharing Information",
    paragraphs: [
      "Information may be processed by service providers supporting website hosting, database operations, authentication, and other necessary platform functions.",
      "When marketplace fulfillment becomes available, relevant order and delivery information may need to be shared with participating vendors or fulfillment providers.",
      "We may disclose information when required by applicable law or to investigate safety, security, or fraud concerns.",
    ],
  },
  {
    title: "6. Creator and Community Content",
    paragraphs: [
      "Information you choose to publish in public profiles or community areas may be visible to other users.",
      "Some creator content may be intended for restricted audiences. Access controls and moderation processes are subject to ongoing review before broader platform launch.",
      "Please avoid posting sensitive personal information in public areas.",
    ],
  },
  {
    title: "7. Data Security",
    paragraphs: [
      "Pikaboo uses technical measures such as password hashing and authenticated sessions to help protect accounts.",
      "No online service can guarantee absolute security. Users should protect their passwords and report suspected account misuse.",
    ],
  },
  {
    title: "8. Retention and Privacy Requests",
    paragraphs: [
      "Personal information may be retained as necessary to operate the platform, maintain records, resolve disputes, address security concerns, and satisfy applicable legal obligations.",
      "You may contact Pikaboo to request access to, correction of, or deletion of your personal information. Requests will be reviewed subject to applicable law and legitimate retention requirements.",
    ],
  },
  {
    title: "9. Adults Only",
    paragraphs: [
      "Pikaboo is intended for adults who meet the minimum age requirement shown on the website. The platform is not intended for children.",
      "If you believe an underage person has created an account or appears in prohibited content, please report the concern immediately.",
    ],
  },
  {
    title: "10. Changes to This Policy",
    paragraphs: [
      "This policy may be updated as Pikaboo adds services, payment processing, verification systems, or additional privacy controls.",
      "Material changes should be reflected in the published policy when they take effect.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <p className="text-sm font-medium text-pink-500">
        Pikaboo Legal
      </p>

      <h1 className="mt-2 font-display text-3xl tracking-tight">
        Privacy Policy
      </h1>

      <div className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
        Draft for business and legal review. Not yet finalized
        for public launch.
      </div>

      <p className="mt-6 text-sm leading-relaxed text-neutral-500">
        "This draft describes how Pikaboo, operated by Velvet Vault, handles information associated with its adult marketplace and creator community. The final effective date and operating procedures must be confirmed before publication.",
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
          Privacy Questions
        </h2>

        <p className="mt-3 text-sm text-neutral-500">
          For privacy-related questions or requests, contact:
        </p>

        <a
          href={`mailto:${SUPPORT_EMAIL}?subject=Pikaboo%20Privacy%20Request`}
          className="mt-3 inline-block break-all text-sm font-medium text-pink-500 underline"
        >
          {SUPPORT_EMAIL}
        </a>
      </section>
    </div>
  );
}
