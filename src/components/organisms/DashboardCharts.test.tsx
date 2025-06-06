import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";

jest.mock("recharts", () => ({
  PieChart: ({ children }: any) => (
    <div data-testid="pie-chart">{children}</div>
  ),
  Pie: ({ children }: any) => <div data-testid="pie">{children}</div>,
  Cell: () => <div data-testid="cell" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  ResponsiveContainer: ({ children }: any) => (
    <div data-testid="responsive-container">{children}</div>
  ),
}));

import { DashboardCharts } from "./DashboardCharts";

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
    md: "14px",
  },
};

const renderWithTheme = (props: Parameters<typeof DashboardCharts>[0]) =>
  render(
    <ThemeProvider theme={theme}>
      <DashboardCharts {...props} />
    </ThemeProvider>
  );

describe("DashboardCharts", () => {
  const mockByCulture = [
    { cultureName: "Milho", count: 5, totalHarvest: 1000, totalRevenue: 25000 },
    { cultureName: "Soja", count: 3, totalHarvest: 800, totalRevenue: 18000 },
  ];
  const mockByLandUse = { agriculturalArea: 1200, vegetationArea: 800 };
  const mockByState = [
    { state: "PR", farmCount: 10 },
    { state: "SP", farmCount: 7 },
    { state: "MG", farmCount: 5 },
  ];

  beforeEach(() => {
    renderWithTheme({
      byCulture: mockByCulture,
      byLandUse: mockByLandUse,
      byState: mockByState,
    });
  });

  it("renderiza todos os títulos de gráfico corretos", () => {
    const titles = [
      "Fazendas por Estado",
      "Culturas (Contagem)",
      "Receita por Cultura (R$)",
      "Colheita por Cultura (t)",
      "Uso do Solo (ha)",
    ];

    titles.forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it("renderiza um PieChart para cada conjunto de dados", () => {
    const pieCharts = screen.getAllByTestId("pie-chart");
    expect(pieCharts.length).toBe(5);
  });

  it("renderiza a quantidade correta de fatias (cells) para cada gráfico", () => {
    const cells = screen.getAllByTestId("cell");
    expect(cells.length).toBe(11);
  });
});
