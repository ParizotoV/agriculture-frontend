import type { Producer } from "@/entities/Producer";
import { createFarm } from "@/features/farms/farmsSlice";
import { loadProducers } from "@/features/producers/producersSlice";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ThemeProvider } from "styled-components";
import { NewFarmForm } from "./NewFarmForm";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("@/features/producers/producersSlice", () => ({
  loadProducers: jest.fn(),
}));
jest.mock("@/features/farms/farmsSlice", () => {
  const fn = jest.fn();
  fn.rejected = { match: jest.fn().mockReturnValue(false) };
  return { createFarm: fn };
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
      <NewFarmForm />
    </ThemeProvider>
  );

describe("NewFarmForm", () => {
  const mockDispatch = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it("dispara loadProducers se producers estiver vazio e mostra 'Carregando produtores...'", () => {
    const mockState = { producers: { list: [], loading: true } };
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector(mockState)
    );

    renderWithTheme();

    expect(loadProducers).toHaveBeenCalled();
    expect(screen.getByText("Carregando produtores...")).toBeInTheDocument();
  });

  it("renderiza campos do formulário quando producers carregados", () => {
    const mockProducers: Producer[] = [
      { id: "p1", name: "João", cpfCnpj: "12345678900" },
    ];
    const mockState = { producers: { list: mockProducers, loading: false } };
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector(mockState)
    );

    renderWithTheme();

    expect(screen.getByText("Nova Fazenda")).toBeInTheDocument();

    const select = screen.getByLabelText("Produtor") as HTMLSelectElement;
    expect(select).toBeInTheDocument();
    expect(screen.getByText("João (12345678900)")).toBeInTheDocument();

    expect(screen.getByLabelText("Nome da Fazenda")).toBeInTheDocument();
    expect(screen.getByLabelText("Cidade")).toBeInTheDocument();
    expect(screen.getByLabelText("Estado")).toBeInTheDocument();
    expect(screen.getByLabelText("Área Total (ha)")).toBeInTheDocument();
    expect(screen.getByLabelText("Área Agricultável (ha)")).toBeInTheDocument();
    expect(screen.getByLabelText("Área de Vegetação (ha)")).toBeInTheDocument();

    expect(screen.getByText("Cancelar")).toBeInTheDocument();
    expect(screen.getByText("Salvar Fazenda")).toBeInTheDocument();
  });

  it("exibe mensagens de erro ao submeter sem preencher campos obrigatórios", async () => {
    const mockProducers: Producer[] = [
      { id: "p1", name: "João", cpfCnpj: "12345678900" },
    ];
    const mockState = { producers: { list: mockProducers, loading: false } };
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector(mockState)
    );

    renderWithTheme();

    fireEvent.click(screen.getByText("Salvar Fazenda"));

    await waitFor(() => {
      expect(
        screen.getByText("ID do produtor é obrigatório")
      ).toBeInTheDocument();
      expect(
        screen.getByText("O nome da fazenda é obrigatório")
      ).toBeInTheDocument();
      expect(screen.getByText("A cidade é obrigatória")).toBeInTheDocument();
      expect(screen.getByText("O estado é obrigatório")).toBeInTheDocument();
    });
  });

  it("chama createFarm e navega para /farms ao submeter dados válidos", async () => {
    const mockProducers: Producer[] = [
      { id: "p1", name: "João", cpfCnpj: "12345678900" },
    ];
    const mockState = { producers: { list: mockProducers, loading: false } };
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector(mockState)
    );
    const fulfilledAction = { type: "farms/createFarm/fulfilled" };
    (createFarm as jest.Mock).mockReturnValue(fulfilledAction);
    mockDispatch.mockImplementation((action) => action);

    renderWithTheme();

    fireEvent.change(screen.getByLabelText("Produtor"), {
      target: { value: "p1" },
    });
    fireEvent.change(screen.getByLabelText("Nome da Fazenda"), {
      target: { value: "Fazenda Teste" },
    });
    fireEvent.change(screen.getByLabelText("Cidade"), {
      target: { value: "CidadeY" },
    });
    fireEvent.change(screen.getByLabelText("Estado"), {
      target: { value: "SP" },
    });
    fireEvent.change(screen.getByLabelText("Área Total (ha)"), {
      target: { value: "100" },
    });
    fireEvent.change(screen.getByLabelText("Área Agricultável (ha)"), {
      target: { value: "80" },
    });
    fireEvent.change(screen.getByLabelText("Área de Vegetação (ha)"), {
      target: { value: "20" },
    });

    fireEvent.click(screen.getByText("Salvar Fazenda"));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/farms");
    });
  });

  it("exibe toast.error se createFarm for rejeitado", async () => {
    const mockProducers: Producer[] = [
      { id: "p1", name: "João", cpfCnpj: "12345678900" },
    ];
    const mockState = { producers: { list: mockProducers, loading: false } };
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector(mockState)
    );
    const rejectedAction = {
      type: "farms/createFarm/rejected",
      payload: "Erro ao criar fazenda",
    };
    (createFarm as jest.Mock).mockReturnValue(rejectedAction);
    (createFarm.rejected.match as jest.Mock).mockReturnValue(true);
    mockDispatch.mockImplementation((action) => action);

    renderWithTheme();

    fireEvent.change(screen.getByLabelText("Produtor"), {
      target: { value: "p1" },
    });
    fireEvent.change(screen.getByLabelText("Nome da Fazenda"), {
      target: { value: "Fazenda Teste" },
    });
    fireEvent.change(screen.getByLabelText("Cidade"), {
      target: { value: "CidadeY" },
    });
    fireEvent.change(screen.getByLabelText("Estado"), {
      target: { value: "SP" },
    });
    fireEvent.change(screen.getByLabelText("Área Total (ha)"), {
      target: { value: "100" },
    });

    fireEvent.click(screen.getByText("Salvar Fazenda"));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith("Erro ao criar fazenda");
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it("navega para /farms ao clicar em 'Cancelar'", () => {
    const mockProducers: Producer[] = [
      { id: "p1", name: "João", cpfCnpj: "12345678900" },
    ];
    const mockState = { producers: { list: mockProducers, loading: false } };
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector(mockState)
    );

    renderWithTheme();

    fireEvent.click(screen.getByText("Cancelar"));

    expect(mockPush).toHaveBeenCalledWith("/farms");
  });
});
