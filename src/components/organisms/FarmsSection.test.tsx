import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { FarmsSection } from "./FarmsSection";

interface Producer {
  id: string;
  name: string;
}

interface Farm {
  id: string;
  name: string;
  city: string;
  state: string;
  totalArea: number;
  agriculturalArea: number;
  vegetationArea: number;
  producer?: Producer;
}

const theme = {
  colors: {
    border: "#CCCCCC",
    text: "#000000",
    textSecondary: "#666666",
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
    lg: "24px",
    xl: "32px",
  },
  fontSizes: {
    sm: "12px",
    md: "14px",
    lg: "18px",
    xl: "24px",
  },
};

const renderWithTheme = (farms: Farm[]) =>
  render(
    <ThemeProvider theme={theme}>
      <FarmsSection farms={farms} />
    </ThemeProvider>
  );

describe("FarmsSection", () => {
  it("exibe mensagem quando não há fazendas", () => {
    renderWithTheme([]);

    expect(screen.getByText("Fazendas")).toBeInTheDocument();
    expect(
      screen.getByText("Este produtor não possui fazendas.")
    ).toBeInTheDocument();
  });

  it("renderiza FarmCard quando houver fazendas", () => {
    const mockFarms: Farm[] = [
      {
        id: "1",
        name: "Fazenda A",
        city: "CidadeA",
        state: "SP",
        totalArea: 100,
        agriculturalArea: 60,
        vegetationArea: 40,
        producer: { id: "p1", name: "Produtor A" },
      },
      {
        id: "2",
        name: "Fazenda B",
        city: "CidadeB",
        state: "MG",
        totalArea: 200,
        agriculturalArea: 150,
        vegetationArea: 50,
      },
    ];

    renderWithTheme(mockFarms);

    expect(screen.getByText("Fazendas")).toBeInTheDocument();
    expect(screen.queryByText("Este produtor não possui fazendas.")).toBeNull();

    expect(screen.getByText("Fazenda A")).toBeInTheDocument();
    expect(screen.getByText("Fazenda B")).toBeInTheDocument();
  });
});
