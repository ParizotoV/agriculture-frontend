"use client";

import React from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalBox = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.lg};
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  h3 {
    margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
    font-size: ${({ theme }) => theme.fontSizes.lg};
    color: ${({ theme }) => theme.colors.textDark};
  }

  p {
    margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
    font-size: ${({ theme }) => theme.fontSizes.md};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Button = styled.button<{ $variant?: "cancel" | "confirm" }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 500;

  ${({ $variant, theme }) =>
    $variant === "confirm"
      ? `
    background-color: ${theme.colors.accent};
    color: #fff;

    &:hover {
      background-color: ${theme.colors.secondary};
    }
  `
      : `
    background-color: ${theme.colors.border};
    color: ${theme.colors.textDark};

    &:hover {
      background-color: #ccc;
    }
  `}
`;

interface ConfirmationModalProps {
  title?: string;
  message: string;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title = "Confirmação",
  message,
  isOpen,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <Overlay>
      <ModalBox>
        <h3>{title}</h3>
        <p>{message}</p>
        <ButtonRow>
          <Button $variant="cancel" onClick={onCancel}>
            Cancelar
          </Button>
          <Button $variant="confirm" onClick={onConfirm}>
            Confirmar
          </Button>
        </ButtonRow>
      </ModalBox>
    </Overlay>
  );
};
