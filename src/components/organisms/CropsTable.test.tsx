import { formatCurrency } from "@/utils/formatCurrency";
import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import CropsTable from "./CropsTable";

interface Crop {
  id: string;
  season: string;
  farm?: { name?: string } | null;
  cultureName: string;
  harvestQuantity?: number;
  priceReceived?: number;
}

const theme = {
  colors: {
    backgroundSecondary: "#F5F5F5",
    backgroundHover: "#EEEEEE",
    border: "#CCCCCC",
    text: "#000000",
    textDark: "#333333",
    primary: "#0000FF",
    support: "#00FFFF",
    accent: "#FF0000",
    secondary: "#CC0000",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
  },
  fontSizes: {
    xs: "10px",
    sm: "12px",
  },
};

const renderWithTheme = (crops: Crop[]) =>
  render(
    <ThemeProvider theme={theme}>
      <CropsTable crops={crops} />
    </ThemeProvider>
  );

describe("CropsTable", () => {
  it("renderiza os cabeçalhos corretos na tabela", () => {
    renderWithTheme([]);
    const headers = [
      "Safra",
      "Fazenda",
      "Cultura",
      "Colheita",
      "Preço (R$)",
      "Ações",
    ];
    headers.forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  it("exibe uma linha para cada cultura com todos os campos preenchidos", () => {
    const mockCrops: Crop[] = [
      {
        id: "1",
        season: "2025",
        farm: { name: "Fazenda A" },
        cultureName: "Milho",
        harvestQuantity: 100,
        priceReceived: 3000,
      },
      {
        id: "2",
        season: "2024",
        farm: { name: "Fazenda B" },
        cultureName: "Soja",
        harvestQuantity: 200,
        priceReceived: 4500,
      },
    ];

    renderWithTheme(mockCrops);

    const rows = screen.getAllByRole("row");
    expect(rows.length).toBeGreaterThanOrEqual(3);

    mockCrops.forEach((crop) => {
      expect(screen.getByText(crop.season)).toBeInTheDocument();
      expect(screen.getByText(crop.farm!.name!)).toBeInTheDocument();
      expect(screen.getByText(crop.cultureName)).toBeInTheDocument();
      expect(
        screen.getByText(String(crop.harvestQuantity))
      ).toBeInTheDocument();
      const numericRegex = new RegExp(
        formatCurrency(crop.priceReceived!).replace(/[^\d.,]/g, "")
      );
      expect(screen.getByText(numericRegex)).toBeInTheDocument();

      const verButton = screen.getByRole("link", {
        name: `Ver detalhes da cultura ${crop.cultureName}`,
      });
      expect(verButton).toHaveAttribute("href", `/crops/${crop.id}`);

      const editarButton = screen.getByRole("link", {
        name: `Editar cultura ${crop.cultureName}`,
      });
      expect(editarButton).toHaveAttribute("href", `/crops/${crop.id}/edit`);
    });
  });

  it("exibe ‘—’ quando fazenda, colheita ou preço estiverem ausentes", () => {
    const mockCrops: Crop[] = [
      {
        id: "3",
        season: "2023",
        farm: null,
        cultureName: "Trigo",
      },
    ];

    renderWithTheme(mockCrops);

    const row = screen.getByText("2023").closest("tr")!;
    const cells = within(row).getAllByRole("cell");

    expect(within(cells[1]).getByText("—")).toBeInTheDocument();
    expect(within(cells[2]).getByText("Trigo")).toBeInTheDocument();
    expect(within(cells[3]).getByText("—")).toBeInTheDocument();
    expect(within(cells[4]).getByText("—")).toBeInTheDocument();
    const verButton = within(cells[5]).getByRole("link", {
      name: `Ver detalhes da cultura Trigo`,
    });
    expect(verButton).toHaveAttribute("href", `/crops/3`);
    const editarButton = within(cells[5]).getByRole("link", {
      name: `Editar cultura Trigo`,
    });
    expect(editarButton).toHaveAttribute("href", `/crops/3/edit`);
  });
});
