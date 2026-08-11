export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "AfterDark Market";
export const MINIMUM_AGE = 18;
export const AGE_GATE_COOKIE = "adm_age_ok";
export const AUTH_COOKIE_MAX_AGE_DAYS = 30;

export const ROLES = {
  CUSTOMER: "CUSTOMER",
  VENDOR: "VENDOR",
  ADMIN: "ADMIN",
} as const;
export type Role = (typeof ROLES)[keyof typeof ROLES];

export const VENDOR_INTEGRATION = {
  MANUAL: "MANUAL",
  API: "API",
} as const;
export type VendorIntegrationType =
  (typeof VENDOR_INTEGRATION)[keyof typeof VENDOR_INTEGRATION];

export const ORDER_STATUS = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
} as const;
export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const FULFILLMENT_STATUS = {
  UNFULFILLED: "UNFULFILLED",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
} as const;
export type FulfillmentStatus =
  (typeof FULFILLMENT_STATUS)[keyof typeof FULFILLMENT_STATUS];

export const PAYMENT_STATUS = {
  AUTHORIZED: "AUTHORIZED",
  CAPTURED: "CAPTURED",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
} as const;
export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export function formatCents(cents: number): string {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}
