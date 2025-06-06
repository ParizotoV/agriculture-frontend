import type { Farm } from "@/entities/Farm";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { FarmCard } from "./FarmCard";

jest.mock("@/utils/formatCurrency", () => ({
  formatCurrency: (value: number) => `R$${value}`,
}));

const theme = {
  colors: {
    border: "#E0E0E0",
    backgroundSecondary: "#F5F5F5",
    text: "#333333",
    textSecondary: "#757575",
    textDark: "#212121",
    primary: "#2E7D32",
    support: "#388E3C",
    accent: "#FDD835",
    danger: "#E53935",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
  },
  fontSizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.25rem",
    xl: "1.5rem",
  },
};

describe("FarmCard Component", () => {
  const baseFarm: Omit<Farm, "crops"> = {
    id: "farm-1",
    name: "Fazenda Teste",
    city: "São Paulo",
    state: "SP",
    totalArea: 100,
    agriculturalArea: 60,
    vegetationArea: 40,
  };

  const renderWithTheme = (farm: Farm) =>
    render(
      <ThemeProvider theme={theme as any}>
        <FarmCard farm={farm} />
      </ThemeProvider>
    );

  it("exibe mensagem quando não há culturas", () => {
    const farm = { ...baseFarm, crops: [] } as Farm;
    renderWithTheme(farm);

    expect(screen.getByText("Fazenda Teste")).toBeInTheDocument();
    expect(screen.getByText("São Paulo, SP")).toBeInTheDocument();

    expect(screen.getByText(/Área Total:/)).toBeInTheDocument();
    expect(screen.getByText(/100\s*ha/)).toBeInTheDocument();

    expect(screen.getByText(/Agricultável:/)).toBeInTheDocument();
    expect(screen.getByText(/60\s*ha/)).toBeInTheDocument();

    expect(screen.getByText(/Vegetação:/)).toBeInTheDocument();
    expect(screen.getByText(/40\s*ha/)).toBeInTheDocument();

    expect(screen.getByText("Culturas")).toBeInTheDocument();

    expect(
      screen.getByText("Nenhuma cultura cadastrada nesta fazenda.")
    ).toBeInTheDocument();
  });

  it("exibe corretamente até duas culturas sem o label '+ mais...'", () => {
    const farm = {
      ...baseFarm,
      crops: [
        {
          id: "crop-1",
          cultureName: "Soja",
          season: "2021",
          harvestQuantity: 10,
          priceReceived: 1500,
          farmId: baseFarm.id,
        },
        {
          id: "crop-2",
          cultureName: "Milho",
          season: "2022",
          harvestQuantity: 5,
          priceReceived: 2000,
          farmId: baseFarm.id,
        },
      ],
    } as Farm;

    renderWithTheme(farm);

    expect(screen.getByText("• Soja (Safra 2021)")).toBeInTheDocument();
    expect(screen.getByText("• Milho (Safra 2022)")).toBeInTheDocument();

    const colheitaLabels = screen.getAllByText("Colheita:");
    expect(colheitaLabels.length).toBe(2);
    expect(screen.getByText("10 t")).toBeInTheDocument();
    expect(screen.getByText("5 t")).toBeInTheDocument();

    const precoLabels = screen.getAllByText("Preço Recebido:");
    expect(precoLabels.length).toBe(2);
    expect(screen.getByText("R$1500")).toBeInTheDocument();
    expect(screen.getByText("R$2000")).toBeInTheDocument();

    expect(screen.queryByText(/\+\s*\d+\s*mais…/)).toBeNull();
  });

  it("exibe apenas as duas primeiras culturas e o label '+ 1 mais…'", () => {
    const farm = {
      ...baseFarm,
      crops: [
        {
          id: "crop-1",
          cultureName: "Soja",
          season: "2021",
          harvestQuantity: 10,
          priceReceived: 1500,
          farmId: baseFarm.id,
        },
        {
          id: "crop-2",
          cultureName: "Milho",
          season: "2022",
          harvestQuantity: 5,
          priceReceived: 2000,
          farmId: baseFarm.id,
        },
        {
          id: "crop-3",
          cultureName: "Café",
          season: "2023",
          harvestQuantity: 8,
          priceReceived: 2500,
          farmId: baseFarm.id,
        },
      ],
    } as Farm;

    renderWithTheme(farm);

    expect(screen.getByText("• Soja (Safra 2021)")).toBeInTheDocument();
    expect(screen.getByText("• Milho (Safra 2022)")).toBeInTheDocument();
    expect(screen.queryByText("• Café (Safra 2023)")).toBeNull();

    expect(screen.getByText("+ 1 mais…")).toBeInTheDocument();
  });

  it("exibe travessão quando não há harvestQuantity ou priceReceived", () => {
    const farm = {
      ...baseFarm,
      crops: [
        {
          id: "crop-1",
          cultureName: "Soja",
          season: "2021",
          harvestQuantity: undefined as any,
          priceReceived: undefined as any,
          farmId: baseFarm.id,
        },
      ],
    } as Farm;

    renderWithTheme(farm);

    const emDashes = screen.getAllByText("—");
    expect(emDashes.length).toBeGreaterThanOrEqual(2);
  });
});
