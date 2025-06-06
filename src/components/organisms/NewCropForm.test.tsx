import type { Farm } from "@/entities/Farm";
import { createCrop } from "@/features/cultures/culturesSlice";
import { loadFarms } from "@/features/farms/farmsSlice";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ThemeProvider } from "styled-components";
import { NewCropForm } from "./NewCropForm";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("@/features/farms/farmsSlice", () => ({
  loadFarms: jest.fn(),
}));
jest.mock("@/features/cultures/culturesSlice", () => {
  const fn = jest.fn();
  fn.rejected = { match: jest.fn().mockReturnValue(false) };
  return { createCrop: fn };
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
      <NewCropForm />
    </ThemeProvider>
  );

describe("NewCropForm", () => {
  const mockDispatch = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it("dispara loadFarms se farms estiver vazio e mostra 'Carregando fazendas...'", () => {
    const mockState = { farms: { list: [], loading: true } };
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector(mockState)
    );

    renderWithTheme();

    expect(loadFarms).toHaveBeenCalled();
    expect(screen.getByText("Carregando fazendas...")).toBeInTheDocument();
  });

  it("renderiza campos do formulário quando farms carregadas", async () => {
    const mockFarms: Farm[] = [
      {
        id: "f1",
        name: "Fazenda X",
        city: "CidadeX",
        state: "SP",
        totalArea: 0,
        agriculturalArea: 0,
        vegetationArea: 0,
      },
    ];
    const mockState = { farms: { list: mockFarms, loading: false } };
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector(mockState)
    );

    renderWithTheme();

    expect(screen.getByText("Nova Cultura")).toBeInTheDocument();

    const select = screen.getByLabelText("Fazenda") as HTMLSelectElement;
    expect(select).toBeInTheDocument();
    expect(screen.getByText("Fazenda X (CidadeX, SP)")).toBeInTheDocument();

    expect(screen.getByLabelText("Nome da Cultura")).toBeInTheDocument();
    expect(screen.getByLabelText("Safra")).toBeInTheDocument();
    expect(screen.getByLabelText("Colheita (Toneladas)")).toBeInTheDocument();
    expect(screen.getByLabelText("Preço Recebido (R$)")).toBeInTheDocument();

    expect(screen.getByText("Cancelar")).toBeInTheDocument();
    expect(screen.getByText("Salvar Cultura")).toBeInTheDocument();
  });

  it("exibe mensagens de erro específicas se tentar submeter campos obrigatórios vazios", async () => {
    const mockFarms: Farm[] = [
      {
        id: "f1",
        name: "Fazenda X",
        city: "CidadeX",
        state: "SP",
        totalArea: 0,
        agriculturalArea: 0,
        vegetationArea: 0,
      },
    ];
    const mockState = { farms: { list: mockFarms, loading: false } };
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector(mockState)
    );

    renderWithTheme();

    fireEvent.click(screen.getByText("Salvar Cultura"));

    await waitFor(() => {
      expect(screen.getByText("A fazenda é obrigatória")).toBeInTheDocument();
      expect(
        screen.getByText("O nome da cultura é obrigatório")
      ).toBeInTheDocument();
      expect(screen.getByText("A safra é obrigatória")).toBeInTheDocument();
    });
  });

  it("chama createCrop e navega para /crops ao submeter dados válidos", async () => {
    const mockFarms: Farm[] = [
      {
        id: "f1",
        name: "Fazenda X",
        city: "CidadeX",
        state: "SP",
        totalArea: 0,
        agriculturalArea: 0,
        vegetationArea: 0,
      },
    ];
    const mockState = { farms: { list: mockFarms, loading: false } };
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector(mockState)
    );
    (createCrop as jest.Mock).mockResolvedValue({
      type: "cultures/createCrop/fulfilled",
    });

    renderWithTheme();

    fireEvent.change(screen.getByLabelText("Fazenda"), {
      target: { value: "f1" },
    });
    fireEvent.change(screen.getByLabelText("Nome da Cultura"), {
      target: { value: "Soja" },
    });
    fireEvent.change(screen.getByLabelText("Safra"), {
      target: { value: "2025" },
    });
    fireEvent.change(screen.getByLabelText("Colheita (Toneladas)"), {
      target: { value: "100" },
    });
    fireEvent.change(screen.getByLabelText("Preço Recebido (R$)"), {
      target: { value: "R$ 2.500,00" },
    });

    fireEvent.click(screen.getByText("Salvar Cultura"));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/crops");
    });
  });

  it("exibe toast.error se createCrop for rejeitado", async () => {
    const mockFarms: Farm[] = [
      {
        id: "f1",
        name: "Fazenda X",
        city: "CidadeX",
        state: "SP",
        totalArea: 0,
        agriculturalArea: 0,
        vegetationArea: 0,
      },
    ];
    const mockState = { farms: { list: mockFarms, loading: false } };
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector(mockState)
    );
    (createCrop as jest.Mock).mockResolvedValue({
      type: "cultures/createCrop/rejected",
      payload: "Erro ao criar cultura",
    });
    (createCrop.rejected.match as jest.Mock).mockReturnValue(true);

    renderWithTheme();

    fireEvent.change(screen.getByLabelText("Fazenda"), {
      target: { value: "f1" },
    });
    fireEvent.change(screen.getByLabelText("Nome da Cultura"), {
      target: { value: "Soja" },
    });
    fireEvent.change(screen.getByLabelText("Safra"), {
      target: { value: "2025" },
    });

    fireEvent.click(screen.getByText("Salvar Cultura"));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith(
        "Erro inesperado ao criar cultura."
      );
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it("navega para /crops ao clicar em 'Cancelar'", () => {
    const mockFarms: Farm[] = [
      {
        id: "f1",
        name: "Fazenda X",
        city: "CidadeX",
        state: "SP",
        totalArea: 0,
        agriculturalArea: 0,
        vegetationArea: 0,
      },
    ];
    const mockState = { farms: { list: mockFarms, loading: false } };
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector(mockState)
    );

    renderWithTheme();

    fireEvent.click(screen.getByText("Cancelar"));

    expect(mockPush).toHaveBeenCalledWith("/crops");
  });
});
