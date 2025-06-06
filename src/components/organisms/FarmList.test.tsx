import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { FarmList } from "./FarmList";

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
  },
  fontSizes: {
    sm: "12px",
    md: "14px",
    lg: "18px",
  },
};

const renderWithTheme = (farms: Farm[]) =>
  render(
    <ThemeProvider theme={theme}>
      <FarmList farms={farms} />
    </ThemeProvider>
  );

describe("FarmList", () => {
  it("exibe mensagem quando não há fazendas cadastradas", () => {
    renderWithTheme([]);

    expect(screen.getByText("Nenhuma fazenda cadastrada.")).toBeInTheDocument();
  });

  it("renderiza um FarmCard para cada fazenda fornecida", () => {
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

    expect(screen.getByText("Fazenda A")).toBeInTheDocument();
    expect(screen.getByText("Fazenda B")).toBeInTheDocument();
    expect(screen.getByText("Produtor A")).toBeInTheDocument();
    expect(screen.getByText("CidadeA, SP")).toBeInTheDocument();
    expect(screen.getByText("CidadeB, MG")).toBeInTheDocument();
    expect(screen.getByText("100 ha")).toBeInTheDocument();
    expect(screen.getByText("200 ha")).toBeInTheDocument();
  });
});
