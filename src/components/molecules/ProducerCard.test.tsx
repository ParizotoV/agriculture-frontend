import type { Producer } from "@/entities/Producer";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";
import { ProducerCard } from "./ProducerCard";

describe("ProducerCard", () => {
  const theme = {
    colors: {
      border: "#000000",
      text: "#000000",
      textSecondary: "#666666",
      primary: "#000000",
      accent: "#000000",
      support: "#000000",
    },
    spacing: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
    },
    fontSizes: {
      sm: "0.875rem",
      md: "1rem",
      lg: "1.25rem",
      xl: "1.5rem",
      xxl: "2rem",
    },
  };

  function renderWithTheme(ui: React.ReactNode) {
    return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
  }

  const mockProducer: Producer = {
    id: "1",
    name: "João Silva",
    cpfCnpj: "12345678900",
    farms: ["f1", "f2"],
  };

  it("renderiza corretamente nome e CPF/CNPJ", () => {
    renderWithTheme(
      <ProducerCard producer={mockProducer} onDeleteClick={() => {}} />
    );

    expect(screen.getByText("João Silva")).toBeInTheDocument();
    expect(screen.getByText("12345678900")).toBeInTheDocument();
  });

  it("possui botões 'Ver detalhes', 'Editar' e 'Excluir' com os aria-labels corretos", () => {
    renderWithTheme(
      <ProducerCard producer={mockProducer} onDeleteClick={() => {}} />
    );

    const detalhesBtn = screen.getByRole("button", {
      name: "Ver detalhes de João Silva",
    });
    expect(detalhesBtn).toBeInTheDocument();

    const editarBtn = screen.getByRole("button", {
      name: "Editar produtor João Silva",
    });
    expect(editarBtn).toBeInTheDocument();

    const excluirBtn = screen.getByRole("button", {
      name: "Excluir produtor João Silva",
    });
    expect(excluirBtn).toBeInTheDocument();
  });

  it("chama onDeleteClick corretamente ao clicar em 'Excluir'", () => {
    const mockOnDelete = jest.fn();
    renderWithTheme(
      <ProducerCard producer={mockProducer} onDeleteClick={mockOnDelete} />
    );

    const excluirBtn = screen.getByRole("button", {
      name: "Excluir produtor João Silva",
    });
    fireEvent.click(excluirBtn);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(mockProducer);
  });
});
