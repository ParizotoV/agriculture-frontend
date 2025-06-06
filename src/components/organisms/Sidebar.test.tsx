import { useSidebar } from "@/context/SidebarContext";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "styled-components";
import { Sidebar } from "./Sidebar";

jest.mock("@/context/SidebarContext");
jest.mock("next/navigation");

const mockSetCollapsed = jest.fn();

const theme = {
  colors: {
    sidebar: "#f0f0f0",
    primary: "#0000FF",
    text: "#000000",
  },
  spacing: { lg: "24px" },
  fontSizes: { md: "14px" },
};

const renderWithTheme = () =>
  render(
    <ThemeProvider theme={theme}>
      <Sidebar />
    </ThemeProvider>
  );

describe("Sidebar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("exibe todos os links com texto quando não está colapsado", () => {
    (useSidebar as jest.Mock).mockReturnValue({
      sidebarOpen: true,
      sidebarCollapsed: false,
      setSidebarCollapsed: mockSetCollapsed,
    });
    (usePathname as jest.Mock).mockReturnValue("/producers");

    renderWithTheme();

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Produtores")).toBeInTheDocument();
    expect(screen.getByText("Fazendas")).toBeInTheDocument();
    expect(screen.getByText("Colheitas")).toBeInTheDocument();

    expect(screen.getByText("Dashboard").closest("a")).toHaveAttribute(
      "href",
      "/"
    );
    expect(screen.getByText("Produtores").closest("a")).toHaveAttribute(
      "href",
      "/producers"
    );
    expect(screen.getByText("Fazendas").closest("a")).toHaveAttribute(
      "href",
      "/farms"
    );
    expect(screen.getByText("Colheitas").closest("a")).toHaveAttribute(
      "href",
      "/crops"
    );
  });

  it("aplica cor primária ao link ativo conforme pathname", () => {
    (useSidebar as jest.Mock).mockReturnValue({
      sidebarOpen: true,
      sidebarCollapsed: false,
      setSidebarCollapsed: mockSetCollapsed,
    });
    (usePathname as jest.Mock).mockReturnValue("/farms");

    renderWithTheme();

    const farmLink = screen.getByText("Fazendas").closest("a")!;
    const style = window.getComputedStyle(farmLink);
    expect(style.color).toBe("rgb(0, 0, 255)");
  });

  it("não exibe texto dos links quando está colapsado", () => {
    (useSidebar as jest.Mock).mockReturnValue({
      sidebarOpen: true,
      sidebarCollapsed: true,
      setSidebarCollapsed: mockSetCollapsed,
    });
    (usePathname as jest.Mock).mockReturnValue("/");

    renderWithTheme();

    expect(screen.queryByText("Dashboard")).toBeNull();
    expect(screen.queryByText("Produtores")).toBeNull();
    expect(screen.queryByText("Fazendas")).toBeNull();
    expect(screen.queryByText("Colheitas")).toBeNull();

    const links = screen.getAllByRole("link");
    expect(links.length).toBe(4);
  });

  it("chama setSidebarCollapsed invertendo valor ao clicar no ToggleButton", () => {
    (useSidebar as jest.Mock).mockReturnValue({
      sidebarOpen: true,
      sidebarCollapsed: false,
      setSidebarCollapsed: mockSetCollapsed,
    });
    (usePathname as jest.Mock).mockReturnValue("/");

    renderWithTheme();

    const toggleButton = screen.getByRole("button", {
      name: /Colapsar Sidebar|Expandir Sidebar/,
    });
    fireEvent.click(toggleButton);

    expect(mockSetCollapsed).toHaveBeenCalledWith(true);
  });
});
