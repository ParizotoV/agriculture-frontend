import { updateFarm } from "@/features/farms/farmsSlice";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ThemeProvider } from "styled-components";
import { EditFarmForm } from "./EditFarmForm";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));
jest.mock("@/features/farms/farmsSlice", () => {
  const fn = jest.fn();
  fn.rejected = { match: jest.fn().mockReturnValue(false) };
  return {
    loadFarmById: jest.fn(),
    updateFarm: fn,
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
      <EditFarmForm />
    </ThemeProvider>
  );

describe("EditFarmForm", () => {
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
      farms: { list: [], loading: true, error: "" },
    };
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector(mockState)
    );

    renderWithProviders();

    expect(
      screen.getByText("Carregando dados da fazenda para editar…")
    ).toBeInTheDocument();
  });

  it("exibe mensagem de erro quando error não é vazio", () => {
    const mockState = {
      farms: { list: [], loading: false, error: "Erro ao carregar fazenda" },
    };
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector(mockState)
    );

    renderWithProviders();

    expect(screen.getByText("Erro ao carregar fazenda")).toBeInTheDocument();
  });

  it("exibe 'Fazenda não encontrada.' quando farm é indefinido", () => {
    const mockState = {
      farms: {
        list: [{ id: "2", name: "Fazenda B", city: "B", state: "SP" }],
        loading: false,
        error: "",
      },
    };
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector(mockState)
    );

    renderWithProviders();

    expect(screen.getByText("Fazenda não encontrada.")).toBeInTheDocument();
  });

  it("renderiza o formulário preenchido quando farm existe e é carregada", async () => {
    const mockState = {
      farms: {
        list: [
          {
            id: "1",
            name: "Fazenda X",
            city: "CidadeX",
            state: "PR",
            totalArea: 120.5,
            agriculturalArea: 80,
            vegetationArea: 40.5,
            producerId: "p1",
          },
        ],
        loading: false,
        error: "",
      },
    };
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector(mockState)
    );

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText("Editar Fazenda")).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(
      "Nome da Fazenda"
    ) as HTMLInputElement;
    expect(nameInput.value).toBe("Fazenda X");

    const cityInput = screen.getByLabelText("Cidade") as HTMLInputElement;
    expect(cityInput.value).toBe("CidadeX");

    const stateInput = screen.getByLabelText("Estado") as HTMLInputElement;
    expect(stateInput.value).toBe("PR");

    const totalAreaInput = screen.getByLabelText(
      "Área Total (ha)"
    ) as HTMLInputElement;
    expect(totalAreaInput.value).toBe("120.5");

    const agriculturalInput = screen.getByLabelText(
      "Área Agricultável (ha)"
    ) as HTMLInputElement;
    expect(agriculturalInput.value).toBe("80");

    const vegetationInput = screen.getByLabelText(
      "Área de Vegetação (ha)"
    ) as HTMLInputElement;
    expect(vegetationInput.value).toBe("40.5");

    const producerInput = screen.getByLabelText(
      "ID do Produtor"
    ) as HTMLInputElement;
    expect(producerInput.value).toBe("p1");
    expect(producerInput).toHaveAttribute("readOnly");

    expect(screen.getByText("Cancelar")).toBeInTheDocument();
    expect(screen.getByText("Salvar Alterações")).toBeInTheDocument();
  });

  it("chama dispatch(updateFarm) e navega para /farms ao submeter dados válidos", async () => {
    const mockState = {
      farms: {
        list: [
          {
            id: "1",
            name: "Fazenda X",
            city: "CidadeX",
            state: "PR",
            totalArea: 120.5,
            agriculturalArea: 80,
            vegetationArea: 40.5,
            producerId: "p1",
          },
        ],
        loading: false,
        error: "",
      },
    };
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector(mockState)
    );

    (updateFarm as jest.Mock).mockResolvedValue({
      type: "farms/updateFarm/fulfilled",
    });

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText("Editar Fazenda")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Nome da Fazenda"), {
      target: { value: "Fazenda Y" },
    });
    fireEvent.change(screen.getByLabelText("Cidade"), {
      target: { value: "CidadeY" },
    });
    fireEvent.change(screen.getByLabelText("Estado"), {
      target: { value: "SP" },
    });
    fireEvent.change(screen.getByLabelText("Área Total (ha)"), {
      target: { value: "130" },
    });
    fireEvent.change(screen.getByLabelText("Área Agricultável (ha)"), {
      target: { value: "90" },
    });
    fireEvent.change(screen.getByLabelText("Área de Vegetação (ha)"), {
      target: { value: "40" },
    });

    fireEvent.click(screen.getByText("Salvar Alterações"));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/farms");
    });
  });

  it("exibe toast.error se updateFarm for rejeitado", async () => {
    const mockState = {
      farms: {
        list: [
          {
            id: "1",
            name: "Fazenda X",
            city: "CidadeX",
            state: "PR",
            totalArea: 120.5,
            agriculturalArea: 80,
            vegetationArea: 40.5,
            producerId: "p1",
          },
        ],
        loading: false,
        error: "",
      },
    };
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector(mockState)
    );

    (updateFarm as jest.Mock).mockResolvedValue({
      type: "farms/updateFarm/rejected",
      payload: "Erro ao atualizar fazenda",
    });
    (updateFarm.rejected.match as jest.Mock).mockReturnValue(true);

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText("Editar Fazenda")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Nome da Fazenda"), {
      target: { value: "Fazenda Y" },
    });
    fireEvent.change(screen.getByLabelText("Cidade"), {
      target: { value: "CidadeY" },
    });
    fireEvent.change(screen.getByLabelText("Estado"), {
      target: { value: "SP" },
    });

    fireEvent.click(screen.getByText("Salvar Alterações"));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith(
        "Erro inesperado ao atualizar fazenda."
      );
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it("navega para /farms ao clicar em 'Cancelar'", () => {
    const mockState = {
      farms: {
        list: [
          {
            id: "1",
            name: "Fazenda X",
            city: "CidadeX",
            state: "PR",
            totalArea: 120.5,
            agriculturalArea: 80,
            vegetationArea: 40.5,
            producerId: "p1",
          },
        ],
        loading: false,
        error: "",
      },
    };
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector(mockState)
    );

    renderWithProviders();

    fireEvent.click(screen.getByText("Cancelar"));

    expect(mockPush).toHaveBeenCalledWith("/farms");
  });
});
