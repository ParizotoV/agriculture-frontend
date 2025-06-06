import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider } from "styled-components";
import { ProducerListSection } from "./ProducerListSection";

jest.mock("@/features/producers/producersSlice", () => ({
  loadProducers: jest.fn(() => ({ type: "MOCK_LOAD_PROD" })),
  deleteProducer: jest.fn((id: string) => ({
    type: "MOCK_DELETE_PROD",
    payload: id,
  })),
}));

import {
  deleteProducer,
  loadProducers,
} from "@/features/producers/producersSlice";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("./ProducerList", () => ({
  ProducerList: ({ producers, onDelete }) => (
    <div data-testid="producer-list">
      {producers.map((p) => (
        <button
          key={p.id}
          onClick={() => onDelete(p)}
          aria-label={`Excluir produtor ${p.name}`}
        >
          Delete {p.name}
        </button>
      ))}
    </div>
  ),
}));

jest.mock("./ConfirmationModal", () => ({
  ConfirmationModal: ({ isOpen, title, message, onCancel, onConfirm }) =>
    isOpen ? (
      <div data-testid="confirmation-modal">
        <h1>{title}</h1>
        <p>{message}</p>
        <button onClick={onCancel}>Cancelar</button>
        <button onClick={onConfirm}>Confirmar</button>
      </div>
    ) : null,
}));

const theme = {
  colors: {
    primary: "#2E7D32",
    secondary: "#8D6E63",
    accent: "#FBC02D",
    support: "#A5D6A7",

    background: "#FAF9F6",
    sidebar: "#ECE5DC",
    text: "#333333",
    textSecondary: "#757575",

    border: "#DDDDDD",
  },
  spacing: {
    xs: "0.5rem",
    sm: "1rem",
    md: "1.5rem",
    lg: "2rem",
    xl: "3rem",
  },
  fontSizes: {
    sm: "0.875rem",
    md: "1rem",
    lg: "1.25rem",
    xl: "1.5rem",
    xxl: "2rem",
  },
};

describe("ProducerListSection", () => {
  let mockDispatch: jest.Mock;
  let mockPush: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockDispatch = jest.fn().mockResolvedValue(undefined);
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);

    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    (useSelector as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        producers: {
          list: [
            { id: "1", name: "Ana", cpfCnpj: "11122233344", farms: [] },
            { id: "2", name: "Bruno", cpfCnpj: "55566677788", farms: [] },
          ],
          loading: false,
          error: null,
        },
      })
    );
  });

  function renderWithTheme(ui: React.ReactNode) {
    return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
  }

  it("dispara loadProducers ao montar e renderiza lista de produtores", () => {
    renderWithTheme(<ProducerListSection />);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(loadProducers).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({ type: "MOCK_LOAD_PROD" });

    expect(screen.getByText("Delete Ana")).toBeInTheDocument();
    expect(screen.getByText("Delete Bruno")).toBeInTheDocument();
  });

  it("exibe mensagem de carregando quando loading=true", () => {
    (useSelector as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        producers: {
          list: [],
          loading: true,
          error: null,
        },
      })
    );

    renderWithTheme(<ProducerListSection />);
    expect(screen.getByText("Carregando produtores...")).toBeInTheDocument();
  });

  it("exibe mensagem de erro quando error está presente", () => {
    (useSelector as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        producers: {
          list: [],
          loading: false,
          error: "Falha ao carregar",
        },
      })
    );

    renderWithTheme(<ProducerListSection />);
    expect(screen.getByText("Falha ao carregar")).toBeInTheDocument();
  });

  it("filtra produtores pelo searchTerm", () => {
    renderWithTheme(<ProducerListSection />);

    expect(screen.getByText("Delete Ana")).toBeInTheDocument();
    expect(screen.getByText("Delete Bruno")).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(
      "Buscar produtor pelo nome ou documento..."
    );
    fireEvent.change(searchInput, { target: { value: "bruno" } });

    expect(screen.queryByText("Delete Ana")).not.toBeInTheDocument();
    expect(screen.getByText("Delete Bruno")).toBeInTheDocument();
  });

  it("abre modal de confirmação ao clicar em 'Excluir' e fecha ao cancelar", async () => {
    renderWithTheme(<ProducerListSection />);

    const deleteAnaBtn = screen.getByRole("button", {
      name: /Excluir produtor Ana/i,
    });
    fireEvent.click(deleteAnaBtn);

    expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument();
    expect(screen.getByText("Excluir Produtor")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Tem certeza que deseja excluir este produtor? Esta ação não pode ser desfeita."
      )
    ).toBeInTheDocument();

    const cancelBtn = screen.getByRole("button", { name: /Cancelar/i });
    fireEvent.click(cancelBtn);

    await waitFor(() => {
      expect(
        screen.queryByTestId("confirmation-modal")
      ).not.toBeInTheDocument();
    });
  });

  it("confirma exclusão, despacha deleteProducer e loadProducers, e fecha o modal", async () => {
    renderWithTheme(<ProducerListSection />);

    const deleteAnaBtn = screen.getByRole("button", {
      name: /Excluir produtor Ana/i,
    });
    fireEvent.click(deleteAnaBtn);

    const confirmBtn = screen.getByRole("button", { name: /Confirmar/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(deleteProducer).toHaveBeenCalledWith("1");
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "MOCK_DELETE_PROD",
        payload: "1",
      });
    });

    expect(loadProducers).toHaveBeenCalledTimes(2);
    expect(mockDispatch).toHaveBeenCalledWith({ type: "MOCK_LOAD_PROD" });

    await waitFor(() => {
      expect(
        screen.queryByTestId("confirmation-modal")
      ).not.toBeInTheDocument();
    });
  });
});
