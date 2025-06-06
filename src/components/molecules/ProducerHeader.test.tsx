import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { ProducerHeader, ProducerHeaderProps } from "./ProducerHeader";

const theme = {
  colors: {
    border: "#CCCCCC",
    text: "#000000",
    textSecondary: "#666666",
  },
  spacing: {
    xs: "4px",
    md: "16px",
    lg: "24px",
  },
  fontSizes: {
    md: "14px",
    xl: "20px",
  },
};

describe("ProducerHeader", () => {
  const defaultProps: ProducerHeaderProps = {
    name: "Maria Oliveira",
    cpfCnpj: "987.654.321-00",
  };

  const renderWithTheme = (props: ProducerHeaderProps) => {
    return render(
      <ThemeProvider theme={theme}>
        <ProducerHeader {...props} />
      </ThemeProvider>
    );
  };

  it("renderiza corretamente o nome informado", () => {
    renderWithTheme(defaultProps);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Maria Oliveira"
    );
  });

  it("exibe o texto 'CPF/CNPJ:' em negrito seguido do valor do CPF/CNPJ", () => {
    renderWithTheme(defaultProps);

    const labelStrong = screen.getByText("CPF/CNPJ:", { selector: "strong" });
    expect(labelStrong).toBeInTheDocument();

    expect(screen.getByText("987.654.321-00")).toBeInTheDocument();
  });
});
