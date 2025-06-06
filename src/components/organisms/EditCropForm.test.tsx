import { updateCrop } from "@/features/cultures/culturesSlice";
import "@testing-library/jest-dom";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ThemeProvider } from "styled-components";
import { EditCropForm } from "./EditCropForm";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));
jest.mock("@/features/cultures/culturesSlice", () => {
  const fn = jest.fn();
  fn.rejected = { match: jest.fn().mockReturnValue(false) };
  return {
    loadCropById: jest.fn(),
    updateCrop: fn,
  };
});
jest.mock("@/features/farms/farmsSlice", () => ({
  loadFarms: jest.fn(),
}));
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
      <EditCropForm />
    </ThemeProvider>
  );

describe("EditCropForm", () => {
  const mockDispatch = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useParams as jest.Mock).mockReturnValue({ id: "1" });
  });

  it("exibe indicador de carregamento quando loadingCrops ou loadingFarms é verdadeiro", () => {
    const mockState = {
      cultures: { list: [], loading: true, error: "" },
      farms: { list: [], loading: false },
    };
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector(mockState)
    );

    renderWithProviders();

    expect(
      screen.getByText("Carregando dados para editar…")
    ).toBeInTheDocument();
  });

  it("exibe mensagem de erro quando errorCrops não é vazio", () => {
    const mockState = {
      cultures: { list: [], loading: false, error: "Erro ao carregar" },
      farms: { list: [], loading: false },
    };
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector(mockState)
    );

    renderWithProviders();

    expect(screen.getByText("Erro ao carregar")).toBeInTheDocument();
  });

  it("exibe 'Cultura não encontrada.' quando crop é indefinido", () => {
    const mockState = {
      cultures: {
        list: [{ id: "2", farmId: "f1", cultureName: "Soja", season: "2024" }],
        loading: false,
        error: "",
      },
      farms: { list: [], loading: false },
    };
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector(mockState)
    );

    renderWithProviders();

    expect(screen.getByText("Cultura não encontrada.")).toBeInTheDocument();
  });

  it("renderiza o formulário preenchido quando crop existe e farms carregadas", async () => {
    const mockState = {
      cultures: {
        list: [
          {
            id: "1",
            farmId: "f1",
            cultureName: "Milho",
            season: "2025",
            harvestQuantity: 150,
            priceReceived: 1234.5,
          },
        ],
        loading: false,
        error: "",
      },
      farms: {
        list: [
          { id: "f1", name: "Fazenda X", city: "CidadeX", state: "PR" },
          { id: "f2", name: "Fazenda Y", city: "CidadeY", state: "SP" },
        ],
        loading: false,
      },
    };
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector(mockState)
    );

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText("Editar Cultura: Milho")).toBeInTheDocument();
    });

    const select = screen.getByLabelText("Fazenda") as HTMLSelectElement;
    expect(select.value).toBe("f1");
    expect(
      within(select).getByText("Fazenda X (CidadeX, PR)")
    ).toBeInTheDocument();

    const nameInput = screen.getByLabelText(
      "Nome da Cultura"
    ) as HTMLInputElement;
    expect(nameInput.value).toBe("Milho");

    const seasonInput = screen.getByLabelText("Safra") as HTMLInputElement;
    expect(seasonInput.value).toBe("2025");

    const harvestInput = screen.getByLabelText(
      "Colheita (Toneladas)"
    ) as HTMLInputElement;
    expect(harvestInput.value).toBe("150");

    const priceInput = screen.getByLabelText(
      "Preço Recebido (R$)"
    ) as HTMLInputElement;
    expect(priceInput.value).toMatch(/1\.234/);

    expect(screen.getByText("Cancelar")).toBeInTheDocument();
    expect(screen.getByText("Salvar Alterações")).toBeInTheDocument();
  });

  it("chama dispatch(updateCrop) e navega para /crops ao submeter dados válidos", async () => {
    const mockState = {
      cultures: {
        list: [
          {
            id: "1",
            farmId: "f1",
            cultureName: "Milho",
            season: "2025",
            harvestQuantity: 150,
            priceReceived: 1234.5,
          },
        ],
        loading: false,
        error: "",
      },
      farms: {
        list: [{ id: "f1", name: "Fazenda X", city: "CidadeX", state: "PR" }],
        loading: false,
      },
    };
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector(mockState)
    );

    (updateCrop as jest.Mock).mockResolvedValue({ type: updateCrop.fulfilled });

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText("Editar Cultura: Milho")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Nome da Cultura"), {
      target: { value: "Soja" },
    });
    fireEvent.change(screen.getByLabelText("Safra"), {
      target: { value: "2024" },
    });
    fireEvent.change(screen.getByLabelText("Colheita (Toneladas)"), {
      target: { value: "200" },
    });
    fireEvent.change(screen.getByLabelText("Preço Recebido (R$)"), {
      target: { value: "R$ 2.000,00" },
    });

    fireEvent.click(screen.getByText("Salvar Alterações"));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/crops");
    });
  });

  it("exibe toast.error se updateCrop for rejeitado", async () => {
    const mockState = {
      cultures: {
        list: [
          {
            id: "1",
            farmId: "f1",
            cultureName: "Milho",
            season: "2025",
            harvestQuantity: 150,
            priceReceived: 1234.5,
          },
        ],
        loading: false,
        error: "",
      },
      farms: {
        list: [{ id: "f1", name: "Fazenda X", city: "CidadeX", state: "PR" }],
        loading: false,
      },
    };
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector(mockState)
    );

    (updateCrop as jest.Mock).mockResolvedValue({
      type: updateCrop.rejected.toString(),
      payload: "Erro ao atualizar",
    });
    (updateCrop.rejected.match as jest.Mock).mockReturnValue(true);

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText("Editar Cultura: Milho")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Nome da Cultura"), {
      target: { value: "Soja" },
    });
    fireEvent.change(screen.getByLabelText("Safra"), {
      target: { value: "2024" },
    });
    fireEvent.change(screen.getByLabelText("Colheita (Toneladas)"), {
      target: { value: "200" },
    });
    fireEvent.change(screen.getByLabelText("Preço Recebido (R$)"), {
      target: { value: "R$ 2.000,00" },
    });

    fireEvent.click(screen.getByText("Salvar Alterações"));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith(
        "Erro inesperado ao atualizar cultura."
      );
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it("navega para /crops ao clicar em 'Cancelar'", () => {
    const mockState = {
      cultures: {
        list: [
          {
            id: "1",
            farmId: "f1",
            cultureName: "Milho",
            season: "2025",
            harvestQuantity: 150,
            priceReceived: 1234.5,
          },
        ],
        loading: false,
        error: "",
      },
      farms: {
        list: [{ id: "f1", name: "Fazenda X", city: "CidadeX", state: "PR" }],
        loading: false,
      },
    };
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector(mockState)
    );

    renderWithProviders();

    fireEvent.click(screen.getByText("Cancelar"));

    expect(mockPush).toHaveBeenCalledWith("/crops");
  });
});
