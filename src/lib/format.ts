// ============================================================
// PC Center — Formatting Helpers
// ============================================================

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
}

export function formatShortDate(dateStr: string): string {
  return new Intl.DateTimeFormat("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateStr));
}

export function getOrderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: "รอดำเนินการ",
    confirmed: "ยืนยันแล้ว",
    processing: "กำลังจัดเตรียม",
    shipped: "จัดส่งแล้ว",
    delivered: "ส่งถึงแล้ว",
    cancelled: "ยกเลิก",
  };
  return labels[status] || status;
}

export function getPaymentStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: "รอชำระเงิน",
    paid: "ชำระแล้ว",
    refunded: "คืนเงินแล้ว",
  };
  return labels[status] || status;
}

export function getPaymentMethodLabel(method: string): string {
  const labels: Record<string, string> = {
    credit_card: "บัตรเครดิต",
    bank_transfer: "โอนเงิน",
    cod: "เก็บเงินปลายทาง",
  };
  return labels[method] || method;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    processing: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    shipped: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
    delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    refunded: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    draft: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    archived: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    expired: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    disabled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}
