// Every user-facing string of เว็บกลาง. Source: REQ-001 §User-facing wording +
// §Additional wording (2026-09-21), verbatim. Nothing here is invented — a missing
// string is a `## Questions` entry to Sober, never a placeholder.

export const SITE_NAME = "เว็บกลาง";

/** Room status label, keyed by SPEC-001 status code. */
export const STATUS_TH = {
  WAITING_BUYER_JOIN: "รอผู้ซื้อเข้าห้อง",
  WAITING_SELLER_JOIN: "รอผู้ขายเข้าห้อง",
  WAITING_PAYMENT: "รอผู้ซื้อชำระเงิน",
  SLIP_REVIEW: "รอแอดมินตรวจสอบยอดเงิน",
  PAID_WAITING_DELIVERY: "ชำระเงินแล้ว — รอผู้ขายส่งของ",
  DELIVERED_WAITING_CONFIRM: "ผู้ขายส่งของแล้ว — รอผู้ซื้อยืนยัน",
  SHIPPED_WAITING_PARCEL: "ผู้ขายส่งพัสดุแล้ว — รอพัสดุถึง",
  PARCEL_ARRIVED_WAITING_CONFIRM: "พัสดุถึงแล้ว — รอผู้ซื้อยืนยัน",
  WAITING_PAYOUT: "รอแอดมินโอนเงินให้ผู้ขาย",
  COMPLETED: "ปิดดีลแล้ว",
  CANCELLED: "ห้องถูกยกเลิก",
} as const;

/** Error message, keyed by SPEC-001 error code. `message` from the wire is never shown. */
export const ERROR_TH = {
  EMAIL_TAKEN: "อีเมลนี้ถูกใช้แล้ว",
  ROOM_FULL: "ห้องนี้เต็มแล้ว",
  EVIDENCE_REQUIRED: "ต้องแนบหลักฐานการส่งของอย่างน้อย 1 รูป",
  TRACKING_REQUIRED: "ต้องระบุขนส่งและเลขพัสดุ",
  UNAUTHENTICATED: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
  NOT_FOUND: "ไม่พบห้องนี้ — ตรวจสอบลิงก์อีกครั้ง",
  GENERIC: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
} as const;

export const PRICE_ERROR_TH = {
  NOT_WHOLE_BAHT: "กรุณาระบุราคาเป็นจำนวนเต็มบาท",
  TOO_LOW: (min: number) => `ราคานี้ต่ำเกินไป — ต้องไม่น้อยกว่า ${min} บาท`,
} as const;

export const FILE_ERROR_TH = {
  NOT_IMAGE: "แนบได้เฉพาะไฟล์รูปภาพ (JPG, PNG)",
  TOO_LARGE: "ไฟล์ใหญ่เกิน 5 MB",
} as const;

export const AUTH_TH = {
  DISPLAY_NAME: "ชื่อที่แสดง",
  EMAIL: "อีเมล",
  PASSWORD: "รหัสผ่าน",
  REGISTER: "สมัครสมาชิก",
  LOGIN: "เข้าสู่ระบบ",
  HAVE_ACCOUNT_LOGIN: "มีบัญชีแล้ว? เข้าสู่ระบบ",
  NO_ACCOUNT_REGISTER: "ยังไม่มีบัญชี? สมัครสมาชิก",
  LOGIN_FAILED: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
} as const;

export const ROOM_TH = {
  OPEN_ROOM: "เปิดห้องดีล",
  MY_ROOMS: "ห้องดีลของฉัน",
  JOIN: "เข้าร่วมห้อง",
  ROLE_BUYER: "ฉันเป็นผู้ซื้อ",
  ROLE_SELLER: "ฉันเป็นผู้ขาย",
  CATEGORY: "หมวดหมู่สินค้า",
  PRICE_MODE_FEE_ADDED: "ราคานี้ยังไม่รวมค่ากลาง",
  PRICE_MODE_FEE_INCLUDED: "ราคานี้รวมค่ากลางแล้ว",
  FEE_PAYER_SELLER: "ผู้ขายจ่ายค่ากลาง",
  FEE_PAYER_BUYER: "ผู้ซื้อจ่ายค่ากลาง",
  FEE_PAYER_SPLIT: "หารคนละครึ่ง",
  PREVIEW: (x: number, y: number, f: number) =>
    `ผู้ซื้อจ่าย ${x} บาท · ผู้ขายได้รับ ${y} บาท · ค่ากลาง ${f} บาท`,
  SHARE: "ส่งลิงก์นี้ให้อีกฝ่ายเข้าห้อง",
  UPLOAD_SLIP: (x: number) => `แนบสลิปโอนเงิน ${x} บาท`,
  DELIVER: "ส่งของแล้ว (แนบหลักฐาน)",
  COURIER: "ขนส่ง",
  TRACKING_NUMBER: "เลขพัสดุ",
  PARCEL_ARRIVED: "พัสดุถึงแล้ว",
  RECEIVED: "ได้รับของแล้ว",
  CANCEL: "ยกเลิกห้อง",
  COUNTDOWN: (d: number, h: number) =>
    `ระบบจะโอนเงินให้ผู้ขายอัตโนมัติใน ${d} วัน ${h} ชั่วโมง`,
  CREDIT: (n: number) => `ปิดดีลดี ${n} ครั้ง`,
  AUTO_RELEASED_EVENT: "ปล่อยเงินอัตโนมัติ (ครบ 3 วัน)",
  EMPTY_ROOMS: "ยังไม่มีห้องดีล — กด \"เปิดห้องดีล\" เพื่อเริ่ม",
} as const;

export const GUIDANCE_TH = {
  BUYER:
    "คำแนะนำสำหรับผู้ซื้อ — ถ่ายวิดีโอหรือติดกล้องตอนรับของทุกครั้ง · ระวังการหลอกเรื่องเบอร์โทรและขนส่ง — ตรวจสอบและติดตามสถานะพัสดุตลอด · โอนเงินเข้าบัญชีเว็บกลางเท่านั้น ห้ามโอนตรงให้ผู้ขาย",
  SELLER:
    "คำแนะนำสำหรับผู้ขาย — แนบหลักฐานการส่งของให้แน่นหนาทุกครั้ง (ภาพหน้าจอ, วิดีโอ, เลขพัสดุ) เพื่อป้องกันการกด \"ไม่โอเค\" มั่ว ๆ · อย่าส่งของก่อนเห็นสถานะ \"ชำระเงินแล้ว\"",
} as const;

export const ADMIN_TH = {
  SLIP_PAGE: "แอดมิน — ตรวจสอบสลิป",
  CONFIRM_SLIP: "ยืนยันยอดเงิน",
  REJECT_SLIP: "ปฏิเสธสลิป",
  REJECT_REASON: "เหตุผลที่ปฏิเสธ",
  PAYOUT_PAGE: "โอนเงินให้ผู้ขาย",
  RECORD_PAYOUT: "บันทึกการโอนเงิน",
  FEE_SETTINGS_PAGE: "ตั้งค่าค่ากลาง",
  FEE_RATE: "อัตราค่ากลาง (%)",
  FEE_MINIMUM: "ค่ากลางขั้นต่ำ (บาท)",
  SAVE_SETTINGS: "บันทึกการตั้งค่า",
  RUN_AUTO_RELEASE: "รันปล่อยเงินอัตโนมัติตอนนี้",
  EMPTY_SLIPS: "ไม่มีสลิปรอตรวจสอบ",
} as const;

export const CATEGORY_TH = {
  IN_GAME: "ไอเทม/ไอดีเกม",
  PHYSICAL: "สินค้าส่งพัสดุ",
} as const;
