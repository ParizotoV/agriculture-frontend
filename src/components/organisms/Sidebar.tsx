"use client";

import { useSidebar } from "@/context/SidebarContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import {
  MdAgriculture,
  MdChevronLeft,
  MdChevronRight,
  MdDashboard,
  MdLocalFlorist,
  MdPeople,
} from "react-icons/md";
import styled from "styled-components";

const AsideContainer = styled.aside<{
  $collapsed: boolean;
  $sidebarOpen: boolean;
}>`
  position: fixed;
  top: 60px; /* altura do NavBar */
  left: 0;
  height: calc(100vh - 60px);
  background-color: ${({ theme }) => theme.colors.sidebar};
  border-right: 1px solid #e0e0e0;
  transition: all 0.3s ease-in-out;
  z-index: 999;

  width: ${({ $collapsed }) => ($collapsed ? "60px" : "240px")};

  @media (max-width: 768px) {
    width: 240px;
    transform: ${({ $sidebarOpen }) =>
      $sidebarOpen ? "translateX(0)" : "translateX(-100%)"};
  }
`;

const AsideHeader = styled.div<{ $collapsed: boolean }>`
  position: relative;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) => ($collapsed ? "center" : "flex-end")};
  padding-right: ${({ $collapsed }) => ($collapsed ? "0" : "0.5rem")};
  background-color: ${({ theme }) => theme.colors.sidebar};
  z-index: 2;
`;

const ToggleButton = styled.button<{ $collapsed: boolean }>`
  position: absolute;
  top: 50%;
  right: -1rem;
  transform: translateY(-50%);

  background-color: ${({ theme }) => theme.colors.primary};
  border: none;
  color: #fff;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  transition: transform 0.2s ease-in-out;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MenuWrapper = styled.div`
  position: absolute;
  top: 3rem;
  left: 0;
  width: 100%;
  bottom: 0;
  overflow-y: auto;
  padding-top: 1rem;
`;

const MenuList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const MenuItem = styled.li`
  margin-bottom: 1rem;
`;

const MenuLink = styled(Link)<{ $active?: boolean; $collapsed?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ $collapsed }) => ($collapsed ? "0" : "0.5rem")};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.text};
  font-size: 1rem;
  padding: 0.5rem 1.25rem;
  border-radius: 4px;
  text-decoration: none;
  white-space: nowrap;
  justify-content: ${({ $collapsed }) =>
    $collapsed ? "center" : "flex-start"};
  overflow: hidden;
  transition: gap 0.2s ease-in-out;

  & > span {
    opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
    transition: opacity 0.2s ease-in-out 0.1s;
  }

  &:hover {
    background-color: #e0e0e0;
  }
`;

export const Sidebar: React.FC = () => {
  const { sidebarOpen, sidebarCollapsed, setSidebarCollapsed } = useSidebar();
  const pathname = usePathname();

  return (
    <AsideContainer $collapsed={sidebarCollapsed} $sidebarOpen={sidebarOpen}>
      <AsideHeader $collapsed={sidebarCollapsed}>
        <ToggleButton
          $collapsed={sidebarCollapsed}
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          aria-label={
            sidebarCollapsed ? "Expandir Sidebar" : "Colapsar Sidebar"
          }
        >
          {sidebarCollapsed ? <MdChevronRight /> : <MdChevronLeft />}
        </ToggleButton>
      </AsideHeader>

      <MenuWrapper>
        <MenuList>
          <MenuItem>
            <MenuLink
              href="/"
              $active={pathname === "/"}
              $collapsed={sidebarCollapsed}
            >
              <MdDashboard size={24} />
              {!sidebarCollapsed && "Dashboard"}
            </MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink
              href="/producers"
              $active={pathname === "/producers"}
              $collapsed={sidebarCollapsed}
            >
              <MdPeople size={24} />
              {!sidebarCollapsed && "Produtores"}
            </MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink
              href="/farms"
              $active={pathname === "/farms"}
              $collapsed={sidebarCollapsed}
            >
              <MdAgriculture size={24} />
              {!sidebarCollapsed && "Fazendas"}
            </MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink
              href="/crops"
              $active={pathname.startsWith("/crops")}
              $collapsed={sidebarCollapsed}
            >
              <MdLocalFlorist size={24} />
              {!sidebarCollapsed && "Colheitas"}
            </MenuLink>
          </MenuItem>
        </MenuList>
      </MenuWrapper>
    </AsideContainer>
  );
};
