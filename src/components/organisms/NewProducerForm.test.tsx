import { createProducer } from "@/features/producers/producersSlice";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { ThemeProvider } from "styled-components";
import { NewProducerForm } from "./NewProducerForm";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("@/features/producers/producersSlice", () => {
  const fn = jest.fn();
  fn.rejected = { match: jest.fn().mockReturnValue(false) };
  return { createProducer: fn };
});
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
  },
}));

const theme = {
  colors: {
    primary: "#0000FF",
    support: "#00FFFF",
    accent: "#FF0000",
    secondary: "#CC0000",
    text: "#000000",
    textSecondary: "#666666",
    border: "#CCCCCC",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
  },
  fontSizes: {
    xs: "10px",
    sm: "12px",
    md: "14px",
    lg: "18px",
  },
};

const renderWithTheme = () =>
  render(
    <ThemeProvider theme={theme}>
      <NewProducerForm />
    </ThemeProvider>
  );

describe("NewProducerForm", () => {
  const mockDispatch = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it("exibe mensagens de erro ao submeter sem preencher campos obrigatórios", async () => {
    renderWithTheme();

    fireEvent.click(screen.getByText("Salvar Produtor"));

    await waitFor(() => {
      expect(
        screen.getByText("O nome deve ter pelo menos 3 caracteres.")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Apenas dígitos são permitidos.")
      ).toBeInTheDocument();
    });
  });

  it("chama createProducer e navega para /producers ao submeter dados válidos", async () => {
    const fulfilledAction = { type: "producers/createProducer/fulfilled" };
    (createProducer as jest.Mock).mockReturnValue(fulfilledAction);
    mockDispatch.mockImplementation((action) => action);

    renderWithTheme();

    fireEvent.change(screen.getByLabelText("Nome do Produtor"), {
      target: { value: "Carlos Souza" },
    });
    fireEvent.change(screen.getByLabelText("CPF ou CNPJ (apenas dígitos)"), {
      target: { value: "12345678900" },
    });

    fireEvent.click(screen.getByText("Salvar Produtor"));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/producers");
    });
  });

  it("exibe toast.error se createProducer for rejeitado", async () => {
    const rejectedAction = {
      type: "producers/createProducer/rejected",
      payload: "Erro ao criar produtor",
    };
    (createProducer as jest.Mock).mockReturnValue(rejectedAction);
    (createProducer.rejected.match as jest.Mock).mockReturnValue(true);
    mockDispatch.mockImplementation((action) => action);

    renderWithTheme();

    fireEvent.change(screen.getByLabelText("Nome do Produtor"), {
      target: { value: "Ana Pereira" },
    });
    fireEvent.change(screen.getByLabelText("CPF ou CNPJ (apenas dígitos)"), {
      target: { value: "09876543211" },
    });

    fireEvent.click(screen.getByText("Salvar Produtor"));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith("Erro ao criar produtor");
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it("navega para /producers ao clicar em 'Cancelar'", () => {
    renderWithTheme();

    fireEvent.click(screen.getByText("Cancelar"));

    expect(mockPush).toHaveBeenCalledWith("/producers");
  });
});
