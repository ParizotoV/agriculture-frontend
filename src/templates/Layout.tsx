"use client";

import { NavBar } from "@/components/organisms/NavBar";
import { Sidebar } from "@/components/organisms/Sidebar";
import { useSidebar } from "@/context/SidebarContext";
import React from "react";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";
import Providers from "./Providers";

const MainContent = styled.main<{ $sidebarWidth: number }>`
  margin-top: 60px;
  margin-left: ${({ $sidebarWidth }) => `${$sidebarWidth}px`};
  padding: 1.5rem;
  min-height: calc(100vh - 60px);
  background-color: ${({ theme }) => theme.colors.background};
  transition: margin-left 0.3s ease-in-out;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { sidebarCollapsed } = useSidebar();

  const sidebarWidth = sidebarCollapsed ? 60 : 240;

  return (
    <Providers>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
      />
      <NavBar />
      <Sidebar />

      <MainContent $sidebarWidth={sidebarWidth}>{children}</MainContent>
    </Providers>
  );
}
