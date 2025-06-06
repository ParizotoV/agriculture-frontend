import Layout from "@/app/Layout";
import { SidebarProvider } from "@/context/SidebarContext";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";

jest.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: jest.fn() }),
}));

const theme = {
  colors: {
    background: "#ffffff",
    primary: "#000000",
    support: "#111111",
    sidebar: "#f0f0f0",
    text: "#000000",
    textSecondary: "#666666",
    border: "#dddddd",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
  fontSizes: {
    xs: "12px",
    sm: "14px",
    md: "16px",
    lg: "20px",
    xl: "24px",
  },
};

const ProvidersWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ThemeProvider theme={theme}>
    <SidebarProvider>{children}</SidebarProvider>
  </ThemeProvider>
);

describe("Layout", () => {
  it("renderiza NavBar, Sidebar e o conteúdo filho", () => {
    render(
      <ProvidersWrapper>
        <Layout>
          <div data-testid="child-content">Conteúdo</div>
        </Layout>
      </ProvidersWrapper>
    );

    expect(screen.getByRole("navigation")).toBeInTheDocument();

    expect(screen.getByRole("complementary")).toBeInTheDocument();

    expect(screen.getByTestId("child-content")).toHaveTextContent("Conteúdo");
  });

  it("alterna aria-label do botão de toggle corretamente", () => {
    render(
      <ProvidersWrapper>
        <Layout>
          <div>Outro Conteúdo</div>
        </Layout>
      </ProvidersWrapper>
    );

    const btnCollapse = screen.getByLabelText("Colapsar Sidebar");
    expect(btnCollapse).toBeInTheDocument();

    fireEvent.click(btnCollapse);

    const btnExpand = screen.getByLabelText("Expandir Sidebar");
    expect(btnExpand).toBeInTheDocument();

    fireEvent.click(btnExpand);

    expect(screen.getByLabelText("Colapsar Sidebar")).toBeInTheDocument();
  });
});
