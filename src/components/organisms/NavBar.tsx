"use client";

import { useSidebar } from "@/context/SidebarContext";
import React from "react";
import { MdMenu } from "react-icons/md";
import styled from "styled-components";

const NavContainer = styled.nav`
  width: 100%;
  height: 60px;
  background-color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #fff;
  font-size: 1.5rem;
  font-weight: bold;
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  margin-left: auto;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

export const NavBar: React.FC = () => {
  const { sidebarOpen, setSidebarOpen } = useSidebar();

  return (
    <NavContainer>
      <Logo>
        {/* Se tiver um logo.png no /public, pode fazer: */}
        {/* <img src="/logo.png" alt="AgroApp Logo" width={24} height={24} /> */}
        AgroApp
      </Logo>

      <MobileMenuButton onClick={() => setSidebarOpen(!sidebarOpen)}>
        <MdMenu />
      </MobileMenuButton>
    </NavContainer>
  );
};
