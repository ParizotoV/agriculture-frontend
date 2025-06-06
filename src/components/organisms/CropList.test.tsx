import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { CropList } from "./CropList";

const theme = {
  colors: {
    border: "#CCCCCC",
    text: "#000000",
    textSecondary: "#666666",
    textDark: "#333333",
    accent: "#FF0000",
    secondary: "#CC0000",
    primary: "#0000FF",
    support: "#00FFFF",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
  },
  fontSizes: {
    sm: "12px",
    md: "14px",
    lg: "18px",
  },
};

interface Crop {
  id: string;
  cultureName: string;
  season: string;
  harvestQuantity?: number;
  priceReceived?: number;
}

const renderWithTheme = (crops: Crop[]) =>
  render(
    <ThemeProvider theme={theme}>
      <CropList crops={crops} />
    </ThemeProvider>
  );

describe("CropList", () => {
  it("exibe mensagem quando não há culturas cadastradas", () => {
    renderWithTheme([]);

    expect(screen.getByText("Nenhuma cultura cadastrada.")).toBeInTheDocument();
  });

  it("renderiza um CropCard para cada elemento em crops", () => {
    const mockCrops: Crop[] = [
      {
        id: "1",
        cultureName: "Milho",
        season: "2025",
        harvestQuantity: 100,
        priceReceived: 3000,
      },
      {
        id: "2",
        cultureName: "Soja",
        season: "2024",
        harvestQuantity: 200,
        priceReceived: 4500,
      },
    ];

    renderWithTheme(mockCrops);

    expect(screen.getByText("Milho")).toBeInTheDocument();
    expect(screen.getByText("Soja")).toBeInTheDocument();
    expect(screen.getByText("Safra: 2025")).toBeInTheDocument();
    expect(screen.getByText("Safra: 2024")).toBeInTheDocument();
    expect(screen.getAllByText("Colheita:").length).toBe(2);
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("200")).toBeInTheDocument();

    const numericPart1 = /3\.000,00/;
    expect(screen.getByText(numericPart1)).toBeInTheDocument();

    const numericPart2 = /4\.500,00/;
    expect(screen.getByText(numericPart2)).toBeInTheDocument();
  });
});
