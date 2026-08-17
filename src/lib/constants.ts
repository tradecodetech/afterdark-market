export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "Pikaboo";
export const MINIMUM_AGE = 18;
export const AGE_GATE_COOKIE = "pkb_age_ok";
export const AUTH_COOKIE_MAX_AGE_DAYS = 30;

export const ROLES = {
  CUSTOMER: "CUSTOMER",
  CREATOR: "CREATOR",
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

export const CONTACT_REQUEST_STATUS = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  DECLINED: "DECLINED",
  CANCELLED: "CANCELLED",
  EXPIRED: "EXPIRED",
} as const;
export type ContactRequestStatus =
  (typeof CONTACT_REQUEST_STATUS)[keyof typeof CONTACT_REQUEST_STATUS];

export const VIDEO_SESSION_STATUS = {
  SCHEDULED: "SCHEDULED",
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  NO_SHOW: "NO_SHOW",
} as const;
export type VideoSessionStatus =
  (typeof VIDEO_SESSION_STATUS)[keyof typeof VIDEO_SESSION_STATUS];

export const GIFT_STATUS = {
  PENDING: "PENDING",
  CAPTURED: "CAPTURED",
  REFUNDED: "REFUNDED",
  FAILED: "FAILED",
} as const;
export type GiftStatus = (typeof GIFT_STATUS)[keyof typeof GIFT_STATUS];

export function formatCents(cents: number): string {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}
