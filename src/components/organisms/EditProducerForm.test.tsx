import { updateProducer } from "@/features/producers/producersSlice";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ThemeProvider } from "styled-components";
import { EditProducerForm } from "./EditProducerForm";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));
jest.mock("@/features/producers/producersSlice", () => {
  const fn = jest.fn();
  fn.rejected = { match: jest.fn().mockReturnValue(false) };
  return {
    loadProducerById: jest.fn(),
    updateProducer: fn,
  };
});
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
  },
}));

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
    backgroundSecondary: "#F5F5F5",
    backgroundHover: "#EEEEEE",
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

const renderWithProviders = () =>
  render(
    <ThemeProvider theme={theme}>
      <EditProducerForm />
    </ThemeProvider>
  );

describe("EditProducerForm", () => {
  const mockDispatch = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useParams as jest.Mock).mockReturnValue({ id: "1" });
  });

  it("exibe indicador de carregamento quando loading é verdadeiro", () => {
    const mockState = {
      producers: { list: [], loading: true, error: "" },
    };
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector(mockState)
    );

    renderWithProviders();

    expect(
      screen.getByText("Carregando dados do produtor para editar…")
    ).toBeInTheDocument();
  });

  it("exibe mensagem de erro quando error não é vazio", () => {
    const mockState = {
      producers: {
        list: [],
        loading: false,
        error: "Erro ao carregar produtor",
      },
    };
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector(mockState)
    );

    renderWithProviders();

    expect(screen.getByText("Erro ao carregar produtor")).toBeInTheDocument();
  });

  it("exibe 'Produtor não encontrado.' quando producer é indefinido", () => {
    const mockState = {
      producers: {
        list: [{ id: "2", name: "João", cpfCnpj: "123" }],
        loading: false,
        error: "",
      },
    };
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector(mockState)
    );

    renderWithProviders();

    expect(screen.getByText("Produtor não encontrado.")).toBeInTheDocument();
  });

  it("renderiza o formulário preenchido quando producer existe", async () => {
    const mockState = {
      producers: {
        list: [{ id: "1", name: "Maria", cpfCnpj: "12345678900" }],
        loading: false,
        error: "",
      },
    };
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector(mockState)
    );

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText("Editar Produtor")).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(
      "Nome do Produtor"
    ) as HTMLInputElement;
    expect(nameInput.value).toBe("Maria");

    const cpfInput = screen.getByLabelText(
      "CPF ou CNPJ (apenas dígitos)"
    ) as HTMLInputElement;
    expect(cpfInput.value).toBe("12345678900");

    expect(screen.getByText("Cancelar")).toBeInTheDocument();
    expect(screen.getByText("Salvar Alterações")).toBeInTheDocument();
  });

  it("chama dispatch(updateProducer) e navega para /producers ao submeter dados válidos", async () => {
    const mockState = {
      producers: {
        list: [{ id: "1", name: "Maria", cpfCnpj: "12345678900" }],
        loading: false,
        error: "",
      },
    };
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector(mockState)
    );

    (updateProducer as jest.Mock).mockResolvedValue({
      type: "producers/updateProducer/fulfilled",
    });

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText("Editar Produtor")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Nome do Produtor"), {
      target: { value: "Carlos" },
    });
    fireEvent.change(screen.getByLabelText("CPF ou CNPJ (apenas dígitos)"), {
      target: { value: "98765432100" },
    });

    fireEvent.click(screen.getByText("Salvar Alterações"));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/producers");
    });
  });

  it("exibe toast.error se updateProducer for rejeitado", async () => {
    const mockState = {
      producers: {
        list: [{ id: "1", name: "Maria", cpfCnpj: "12345678900" }],
        loading: false,
        error: "",
      },
    };
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector(mockState)
    );

    (updateProducer as jest.Mock).mockResolvedValue({
      type: "producers/updateProducer/rejected",
      payload: "Erro ao atualizar produtor",
    });
    (updateProducer.rejected.match as jest.Mock).mockReturnValue(true);

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText("Editar Produtor")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Nome do Produtor"), {
      target: { value: "Carlos" },
    });
    fireEvent.change(screen.getByLabelText("CPF ou CNPJ (apenas dígitos)"), {
      target: { value: "98765432100" },
    });

    fireEvent.click(screen.getByText("Salvar Alterações"));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith(
        "Erro inesperado ao atualizar produtor."
      );
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it("navega para /producers ao clicar em 'Cancelar'", () => {
    const mockState = {
      producers: {
        list: [{ id: "1", name: "Maria", cpfCnpj: "12345678900" }],
        loading: false,
        error: "",
      },
    };
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector(mockState)
    );

    renderWithProviders();

    fireEvent.click(screen.getByText("Cancelar"));

    expect(mockPush).toHaveBeenCalledWith("/producers");
  });
});
