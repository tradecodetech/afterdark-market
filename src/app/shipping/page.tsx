
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description:
    "Learn about shipping, fulfillment, packaging, and delivery for Pikaboo marketplace orders.",
  robots: {
    index: false,
    follow: false,
  },
};

const SUPPORT_EMAIL = "info@pikabooxo.com";

const sections = [
  {
    title: "1. Shipping Availability",
    paragraphs: [
      "Pikaboo is preparing its marketplace for secure online transactions. Checkout is temporarily unavailable, and new orders cannot currently be completed through the website.",
      "Shipping services will become available when payment processing and vendor fulfillment arrangements are ready.",
    ],
  },
  {
    title: "2. Marketplace Fulfillment",
    paragraphs: [
      "Pikaboo may feature products from multiple participating vendors. Depending on the product, fulfillment may be handled by the applicable vendor or an authorized fulfillment provider.",
      "Products purchased from different vendors may be shipped separately and may have different delivery schedules.",
    ],
  },
  {
    title: "3. Processing and Delivery Times",
    paragraphs: [
      "Processing times and estimated delivery dates will depend on the product, vendor, destination, and shipping service selected.",
      "Applicable delivery estimates should be displayed or communicated before an order is completed once checkout becomes available.",
      "Delivery estimates are not guaranteed unless expressly stated in the applicable purchase terms.",
    ],
  },
  {
    title: "4. Shipping Costs",
    paragraphs: [
      "Shipping charges may vary according to destination, product size, weight, vendor, and available delivery methods.",
      "Any applicable shipping charges will be disclosed before the customer confirms a purchase.",
      "Pikaboo has not yet finalized a universal free-shipping threshold or flat-rate shipping program.",
    ],
  },
  {
    title: "5. Discreet Packaging",
    paragraphs: [
      "Pikaboo recognizes the importance of customer privacy when purchasing adult-oriented products.",
      "Discreet packaging is an intended marketplace standard, but specific packaging materials, shipping labels, and sender descriptions depend on confirmed vendor fulfillment arrangements.",
      "Packaging and billing descriptor details will be clarified before paid orders become available. Customers should not assume that every vendor uses identical packaging.",
    ],
  },
  {
    title: "6. Shipping Destinations",
    paragraphs: [
      "Shipping availability may vary by vendor, destination, product type, and applicable laws.",
      "Pikaboo will identify supported shipping regions and any restrictions before checkout is enabled.",
      "Certain products may not be available for shipment to every jurisdiction.",
    ],
  },
  {
    title: "7. Tracking and Delivery",
    paragraphs: [
      "When supported by the shipping provider, tracking information may be provided after an order has shipped.",
      "Customers should review their shipping information carefully and contact support if they discover an error.",
      "The final process for tracking updates, delivery exceptions, and address changes will be established with participating vendors.",
    ],
  },
  {
    title: "8. Lost, Damaged, or Incorrect Deliveries",
    paragraphs: [
      "Customers should contact Pikaboo support if an order is lost, arrives damaged, or contains an incorrect item.",
      "Pikaboo will review the available order and shipping information and coordinate with the responsible vendor where appropriate.",
      "Any available replacement, refund, or other remedy will depend on the circumstances, published purchase terms, and applicable consumer-protection laws.",
    ],
  },
  {
    title: "9. Returns and Refunds",
    paragraphs: [
      "Returns and refunds are addressed separately in Pikaboo's Refund & Cancellation Policy.",
      "Customers should contact support before shipping an item back because participating vendors may use different return locations.",
    ],
  },
  {
    title: "10. Policy Updates",
    paragraphs: [
      "This draft will be updated when Pikaboo confirms participating vendors, supported shipping destinations, processing times, shipping costs, and packaging standards.",
      "The final shipping terms must be approved before live marketplace checkout begins.",
    ],
  },
];

export default function ShippingPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <p className="text-sm font-medium text-pink-500">
        Pikaboo Customer Care
      </p>

      <h1 className="mt-2 font-display text-3xl tracking-tight">
        Shipping Policy
      </h1>

      <div className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
        Draft policy pending vendor confirmation and client approval.
        Shipping services are not yet active.
      </div>

      <p className="mt-6 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
        Pikaboo is developing a multi-vendor marketplace for
        adult-oriented products. This draft explains the proposed
        shipping and fulfillment approach while secure checkout
        and vendor integrations are being prepared.
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
          Shipping Questions
        </h2>

        <p className="mt-3 text-sm text-neutral-500">
          For shipping and fulfillment inquiries, contact:
        </p>

        <a
          href={`mailto:${SUPPORT_EMAIL}?subject=Pikaboo%20Shipping%20Inquiry`}
          className="mt-3 inline-block break-all text-sm font-medium text-pink-500 underline"
        >
          {SUPPORT_EMAIL}
        </a>
      </section>
    </div>
  );
}
