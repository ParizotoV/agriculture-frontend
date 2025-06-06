import { formatCurrency } from "./formatCurrency";

describe("formatCurrency", () => {
  it("retorna '—' quando o valor é null ou undefined", () => {
    expect(formatCurrency(null)).toBe("—");
    expect(formatCurrency(undefined)).toBe("—");
  });

  it("retorna '—' quando o valor é string vazia", () => {
    expect(formatCurrency("")).toBe("—");
  });

  it("formata corretamente número como BRL com duas casas decimais", () => {
    expect(formatCurrency(0)).toBe("R$\u00A00,00");
    expect(formatCurrency(1234)).toBe("R$\u00A01.234,00");
    expect(formatCurrency(1234.5)).toBe("R$\u00A01.234,50");
    expect(formatCurrency(1234.567)).toBe("R$\u00A01.234,57");
  });

  it("formata string numérica com ponto como separador decimal", () => {
    expect(formatCurrency("1000.5")).toBe("R$\u00A01.000,50");
    expect(formatCurrency("  2000.75 ")).toBe("R$\u00A02.000,75");
  });

  it("formata string numérica com vírgula como separador decimal", () => {
    expect(formatCurrency("3000,25")).toBe("R$\u00A03.000,25");
    expect(formatCurrency("  4000,5  ")).toBe("R$\u00A04.000,50");
  });

  it("ignora prefixos não numéricos ao converter de string", () => {
    expect(formatCurrency("R$ 5.500,00")).toBe("R$\u00A05.500,00");
    expect(formatCurrency("$6.750,30")).toBe("R$\u00A06.750,30");
    expect(formatCurrency("USD 7.125,5")).toBe("R$\u00A07.125,50");
  });

  it("retorna '—' quando a string não contém número válido", () => {
    expect(formatCurrency("abc")).toBe("—");
    expect(formatCurrency("R$ sem número")).toBe("—");
  });
});
