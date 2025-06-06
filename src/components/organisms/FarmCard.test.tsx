import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { FarmCard } from "./FarmCard";

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
  },
  fontSizes: {
    sm: "12px",
    md: "14px",
    lg: "18px",
  },
};

const renderWithTheme = (farm: Farm) =>
  render(
    <ThemeProvider theme={theme}>
      <FarmCard farm={farm} />
    </ThemeProvider>
  );

describe("FarmCard", () => {
  it("renderiza corretamente os dados da fazenda com produtor", () => {
    const mockFarm: Farm = {
      id: "1",
      name: "Fazenda Bela Vista",
      city: "Uberlândia",
      state: "MG",
      totalArea: 100.5,
      agriculturalArea: 60,
      vegetationArea: 40.5,
      producer: { id: "p1", name: "João Silva" },
    };

    renderWithTheme(mockFarm);

    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "Fazenda Bela Vista"
    );

    expect(screen.getByText("João Silva")).toBeInTheDocument();

    expect(screen.getByText("Uberlândia, MG")).toBeInTheDocument();

    expect(screen.getByText("Área Total:")).toBeInTheDocument();
    expect(screen.getByText("100.5 ha")).toBeInTheDocument();
    expect(screen.getByText("Agricultável:")).toBeInTheDocument();
    expect(screen.getByText("60 ha")).toBeInTheDocument();
    expect(screen.getByText("Vegetação:")).toBeInTheDocument();
    expect(screen.getByText("40.5 ha")).toBeInTheDocument();

    const detalhesLink = screen.getByRole("link", {
      name: `Ver detalhes da fazenda ${mockFarm.name}`,
    });
    expect(detalhesLink).toHaveAttribute("href", `/farms/${mockFarm.id}`);

    const editarLink = screen.getByRole("link", {
      name: `Editar fazenda ${mockFarm.name}`,
    });
    expect(editarLink).toHaveAttribute("href", `/farms/${mockFarm.id}/edit`);
  });

  it("não renderiza subtítulo quando não há produtor", () => {
    const mockFarm: Farm = {
      id: "2",
      name: "Fazenda Tranquila",
      city: "Rio Verde",
      state: "GO",
      totalArea: 200,
      agriculturalArea: 150,
      vegetationArea: 50,
    };

    renderWithTheme(mockFarm);

    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "Fazenda Tranquila"
    );
    expect(screen.queryByText("Tranquila")).not.toBeInTheDocument();
    expect(screen.getByText("Rio Verde, GO")).toBeInTheDocument();
    expect(screen.getByText("Área Total:")).toBeInTheDocument();
    expect(screen.getByText("200 ha")).toBeInTheDocument();
    expect(screen.getByText("Agricultável:")).toBeInTheDocument();
    expect(screen.getByText("150 ha")).toBeInTheDocument();
    expect(screen.getByText("Vegetação:")).toBeInTheDocument();
    expect(screen.getByText("50 ha")).toBeInTheDocument();

    const detalhesLink = screen.getByRole("link", {
      name: `Ver detalhes da fazenda ${mockFarm.name}`,
    });
    expect(detalhesLink).toHaveAttribute("href", `/farms/${mockFarm.id}`);

    const editarLink = screen.getByRole("link", {
      name: `Editar fazenda ${mockFarm.name}`,
    });
    expect(editarLink).toHaveAttribute("href", `/farms/${mockFarm.id}/edit`);
  });
});
