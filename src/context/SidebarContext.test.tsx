import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { SidebarProvider, useSidebar } from "./SidebarContext";

const TestComponent: React.FC = () => {
  const { sidebarOpen, setSidebarOpen, sidebarCollapsed, setSidebarCollapsed } =
    useSidebar();

  return (
    <div>
      <div data-testid="open-status">{sidebarOpen ? "Aberto" : "Fechado"}</div>
      <button onClick={() => setSidebarOpen(!sidebarOpen)}>
        Alternar Open
      </button>

      <div data-testid="collapsed-status">
        {sidebarCollapsed ? "Colapsado" : "Expandido"}
      </div>
      <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
        Alternar Collapsed
      </button>
    </div>
  );
};

describe("SidebarContext", () => {
  it("fornece valores iniciais e permite atualizar sidebarOpen e sidebarCollapsed", () => {
    render(
      <SidebarProvider>
        <TestComponent />
      </SidebarProvider>
    );

    expect(screen.getByTestId("open-status")).toHaveTextContent("Fechado");
    expect(screen.getByTestId("collapsed-status")).toHaveTextContent(
      "Expandido"
    );

    fireEvent.click(screen.getByText("Alternar Open"));
    expect(screen.getByTestId("open-status")).toHaveTextContent("Aberto");

    fireEvent.click(screen.getByText("Alternar Open"));
    expect(screen.getByTestId("open-status")).toHaveTextContent("Fechado");

    fireEvent.click(screen.getByText("Alternar Collapsed"));
    expect(screen.getByTestId("collapsed-status")).toHaveTextContent(
      "Colapsado"
    );

    fireEvent.click(screen.getByText("Alternar Collapsed"));
    expect(screen.getByTestId("collapsed-status")).toHaveTextContent(
      "Expandido"
    );
  });

  it("useSidebar fora de SidebarProvider retorna valores padrão", () => {
    render(<TestComponent />);

    expect(screen.getByTestId("open-status")).toHaveTextContent("Fechado");
    expect(screen.getByTestId("collapsed-status")).toHaveTextContent(
      "Expandido"
    );
  });
});
