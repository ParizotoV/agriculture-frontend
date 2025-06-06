import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { NavBar } from "./NavBar";

const mockSetSidebarOpen = jest.fn();
let sidebarOpenValue = false;

jest.mock("@/context/SidebarContext", () => ({
  useSidebar: () => ({
    sidebarOpen: sidebarOpenValue,
    setSidebarOpen: mockSetSidebarOpen,
  }),
}));

const theme = {
  colors: {
    primary: "#0000FF",
  },
};

const renderWithTheme = () =>
  render(
    <ThemeProvider theme={theme}>
      <NavBar />
    </ThemeProvider>
  );

describe("NavBar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("exibe o título da aplicação", () => {
    renderWithTheme();
    expect(screen.getByText("AgroApp")).toBeInTheDocument();
  });

  it("exibe o botão de menu invisível e alterna sidebarOpen de false para true ao clicar", () => {
    sidebarOpenValue = false;
    renderWithTheme();

    const button = screen.getByRole("button", { hidden: true });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(mockSetSidebarOpen).toHaveBeenCalledWith(true);
  });

  it("ao clicar, alterna sidebarOpen de true para false", () => {
    sidebarOpenValue = true;
    renderWithTheme();

    const button = screen.getByRole("button", { hidden: true });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(mockSetSidebarOpen).toHaveBeenCalledWith(false);
  });
});
