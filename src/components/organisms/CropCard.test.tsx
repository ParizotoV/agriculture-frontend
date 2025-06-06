import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { CropCard } from "./CropCard";

interface Crop {
  id: string;
  cultureName: string;
  season: string;
  harvestQuantity?: number;
  priceReceived?: number;
}

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
  },
  fontSizes: {
    sm: "12px",
    md: "14px",
    lg: "18px",
  },
};

const renderWithTheme = (crop: Crop) =>
  render(
    <ThemeProvider theme={theme}>
      <CropCard crop={crop} />
    </ThemeProvider>
  );

describe("CropCard", () => {
  it("renderiza corretamente o nome da cultura e a safra", () => {
    const mockCrop: Crop = {
      id: "1",
      cultureName: "Milho",
      season: "2025",
    };

    renderWithTheme(mockCrop);

    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "Milho"
    );

    expect(screen.getByText("Safra: 2025")).toBeInTheDocument();
  });

  it("exibe estatísticas de colheita e preço quando ambos estiverem presentes", () => {
    const mockCrop: Crop = {
      id: "2",
      cultureName: "Soja",
      season: "2024",
      harvestQuantity: 120,
      priceReceived: 2500,
    };

    renderWithTheme(mockCrop);

    expect(screen.getByText("Colheita:")).toBeInTheDocument();
    expect(screen.getByText("120")).toBeInTheDocument();
    expect(screen.getByText("Preço (R$):")).toBeInTheDocument();
    expect(screen.getByText(/2\.500,00/)).toBeInTheDocument();
  });

  it("não renderiza a seção de estatísticas se não houver quantidade nem preço", () => {
    const mockCrop: Crop = {
      id: "3",
      cultureName: "Trigo",
      season: "2023",
    };

    renderWithTheme(mockCrop);

    expect(screen.queryByText("Colheita:")).toBeNull();
    expect(screen.queryByText("Preço (R$):")).toBeNull();
  });

  it("possui links de 'Ver detalhes' e 'Editar' com href e aria-label corretos", () => {
    const mockCrop: Crop = {
      id: "4",
      cultureName: "Arroz",
      season: "2022",
      harvestQuantity: 80,
      priceReceived: 1800,
    };

    renderWithTheme(mockCrop);

    const detalhesLink = screen.getByRole("link", {
      name: `Ver detalhes da cultura ${mockCrop.cultureName}`,
    });
    expect(detalhesLink).toBeInTheDocument();
    expect(detalhesLink).toHaveAttribute("href", `/crops/${mockCrop.id}`);

    const editarLink = screen.getByRole("link", {
      name: `Editar cultura ${mockCrop.cultureName}`,
    });
    expect(editarLink).toBeInTheDocument();
    expect(editarLink).toHaveAttribute("href", `/crops/${mockCrop.id}/edit`);
  });
});
