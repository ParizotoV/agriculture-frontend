"use client";

import { SidebarProvider } from "@/context/SidebarContext";
import { store } from "@/store/store";
import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { ThemeProvider } from "styled-components";

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

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider theme={theme}>
        <SidebarProvider>{children}</SidebarProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}
