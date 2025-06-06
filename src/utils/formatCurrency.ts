export function formatCurrency(value?: number | string | null): string {
  if (value == null || value === "") {
    return "—";
  }

  let num: number;

  if (typeof value === "string") {
    const trimmed = value.trim();
    const noPrefix = trimmed.replace(/^[^\d]*/, "");
    const replacedComma = noPrefix.replace(/,/, ".");

    const parts = replacedComma.split(".");
    if (parts.length > 1) {
      const decimalPart = parts.pop()!;
      const integerParts = parts.join("");
      const normalized = `${integerParts}.${decimalPart}`;
      num = parseFloat(normalized);
    } else {
      num = parseFloat(replacedComma);
    }

    if (isNaN(num)) {
      return "—";
    }
  } else {
    num = value;
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}
