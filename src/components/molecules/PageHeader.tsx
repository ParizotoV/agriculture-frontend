import React from "react";
import styled from "styled-components";
import { Button } from "../atoms/Button";
import { Title } from "../atoms/Title";

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export interface PageHeaderProps {
  title: string;
  onAddClick: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  onAddClick,
}) => (
  <HeaderWrapper>
    <Title>{title}</Title>
    <Button $variant="accent" onClick={onAddClick}>
      + Adicionar Produtor
    </Button>
  </HeaderWrapper>
);
