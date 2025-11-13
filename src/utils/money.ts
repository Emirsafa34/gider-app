// src/utils/money.ts
export function formatTL(amountKurus: number) {
  return (amountKurus / 100).toLocaleString("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
  });
}
