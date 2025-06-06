import { useSidebar } from "@/context/SidebarContext";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { ThemeContext } from "styled-components";
import Providers from "./Providers";

describe("Providers", () => {
  it("fornece corretamente Redux, Theme e SidebarContext aos descendentes", () => {
    const TestComponent: React.FC = () => {
      const { sidebarOpen, sidebarCollapsed } = useSidebar();
      const producersState = useSelector((state: any) => state.producers);
      const theme = useContext(ThemeContext);

      return (
        <div>
          <div data-testid="sidebar-open">{sidebarOpen ? "true" : "false"}</div>
          <div data-testid="sidebar-collapsed">
            {sidebarCollapsed ? "true" : "false"}
          </div>
          <div data-testid="producers-list-length">
            {Array.isArray(producersState.list)
              ? producersState.list.length.toString()
              : "no-list"}
          </div>
          <div data-testid="theme-primary-color">{theme.colors.primary}</div>
        </div>
      );
    };

    render(
      <Providers>
        <TestComponent />
      </Providers>
    );

    expect(screen.getByTestId("sidebar-open")).toHaveTextContent("false");
    expect(screen.getByTestId("sidebar-collapsed")).toHaveTextContent("false");
    expect(screen.getByTestId("producers-list-length")).toHaveTextContent("0");
    expect(screen.getByTestId("theme-primary-color")).toHaveTextContent(
      "#2E7D32"
    );
  });
});
