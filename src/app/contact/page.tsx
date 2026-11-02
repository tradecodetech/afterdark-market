
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Support",
  description:
    "Contact Pikaboo customer support for help with accounts, orders, vendors, and creator community questions.",
};

const SUPPORT_EMAIL = "info@pikabooxo.com";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10">
        <p className="text-sm font-medium text-pink-500">
          Pikaboo Customer Care
        </p>

        <h1 className="mt-2 font-display text-3xl tracking-tight">
          Contact & Support
        </h1>

        <p className="mt-4 max-w-2xl text-neutral-500">
          Need assistance with your account, a product,
          or the creator community? We're here to help
          you find the right information.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
          <h2 className="text-lg font-semibold">
            Customer Support
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-neutral-500">
            For account questions, product inquiries,
            order concerns, or general assistance,
            contact our support team by email.
          </p>

          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="mt-5 inline-block break-all text-sm font-medium text-pink-500 underline"
          >
            {SUPPORT_EMAIL}
          </a>
        </section>

        <section className="rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
          <h2 className="text-lg font-semibold">
            Creators & Vendors
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-neutral-500">
            Interested in joining Pikaboo as a creator
            or vendor? Contact us with your questions
            about participation, listings, or accounts.
          </p>

          <a
            href={`mailto:${SUPPORT_EMAIL}?subject=Pikaboo%20Creator%20or%20Vendor%20Inquiry`}
            className="mt-5 inline-block text-sm font-medium text-pink-500 underline"
          >
            Contact our team
          </a>
        </section>

        <section className="rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
          <h2 className="text-lg font-semibold">
            Safety & Content Reports
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-neutral-500">
            To report suspected prohibited content,
            impersonation, harassment, or other safety
            concerns, email our team with the relevant
            page link and a description of the issue.
          </p>

          <a
            href={`mailto:${SUPPORT_EMAIL}?subject=Pikaboo%20Safety%20Report`}
            className="mt-5 inline-block text-sm font-medium text-pink-500 underline"
          >
            Report a concern
          </a>
        </section>

        <section className="rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
          <h2 className="text-lg font-semibold">
            Payments & Checkout
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-neutral-500">
            Online checkout is temporarily unavailable
            while Pikaboo completes its secure payment
            integration. No purchases can be completed
            through the current checkout.
          </p>
        </section>
      </div>

      <div className="mt-10 rounded-xl bg-neutral-100 p-6 dark:bg-neutral-900">
        <h2 className="font-semibold">
          When contacting support
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-neutral-500">
          Please include a brief description of your
          question and any relevant product or page
          links. Do not email passwords, full payment
          card numbers, or other sensitive financial
          information.
        </p>
      </div>
    </div>
  );
}
