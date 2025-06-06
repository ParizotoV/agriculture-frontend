import { fireEvent, render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { PageHeader, PageHeaderProps } from "./PageHeader";

const theme = {
  colors: {
    text: "#333333",
    accent: "#FDD835",
  },
  fontSizes: {
    xl: "1.5rem",
  },
  spacing: {
    lg: "1.5rem",
  },
};

describe("PageHeader Component", () => {
  const renderWithTheme = (props: PageHeaderProps) =>
    render(
      <ThemeProvider theme={theme as any}>
        <PageHeader {...props} />
      </ThemeProvider>
    );

  it("exibe o título passado por props", () => {
    const onAddClick = jest.fn();
    renderWithTheme({ title: "Lista de Produtores", onAddClick });

    expect(screen.getByText("Lista de Produtores")).toBeInTheDocument();
  });

  it("exibe o botão '+ Adicionar Produtor' e dispara callback ao clicar", () => {
    const onAddClick = jest.fn();
    renderWithTheme({ title: "Qualquer Título", onAddClick });

    const button = screen.getByRole("button", { name: "+ Adicionar Produtor" });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(onAddClick).toHaveBeenCalledTimes(1);
  });
});
