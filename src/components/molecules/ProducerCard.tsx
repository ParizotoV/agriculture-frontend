"use client";

import type { Producer } from "@/entities/Producer";
import Link from "next/link";
import React from "react";
import { MdDelete, MdEdit, MdInfoOutline } from "react-icons/md";
import styled from "styled-components";

const Card = styled.div`
  background-color: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.md};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const TopInfo = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ProducerName = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
`;

const ProducerDoc = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const ActionsRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const ActionButton = styled.button<{
  asLink?: boolean;
  $variant?: "info" | "edit" | "delete";
}>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out;
  border: none;
  cursor: pointer;

  ${({ $variant, theme }) =>
    $variant === "edit"
      ? `
    background-color: ${theme.colors.accent};
    color: #fff;
    &:hover {
      background-color: ${theme.colors.secondary};
    }
  `
      : $variant === "delete"
      ? `
    background-color: #E53935;
    color: #fff;
    &:hover {
      background-color: #D32F2F;
    }
  `
      : `
    background-color: ${theme.colors.primary};
    color: #fff;
    &:hover {
      background-color: ${theme.colors.support};
    }
  `}

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

interface ProducerCardProps {
  producer: Producer;
  onDeleteClick: (producer: Producer) => void;
}

export const ProducerCard: React.FC<ProducerCardProps> = ({
  producer,
  onDeleteClick,
}) => {
  return (
    <Card>
      <TopInfo>
        <ProducerName>{producer.name}</ProducerName>
        <ProducerDoc>{producer.cpfCnpj}</ProducerDoc>
      </TopInfo>

      <ActionsRow>
        <Link href={`/producers/${producer.id}`} passHref>
          <ActionButton
            asLink
            $variant="info"
            aria-label={`Ver detalhes de ${producer.name}`}
          >
            <MdInfoOutline size={18} />
            Ver detalhes
          </ActionButton>
        </Link>

        <Link href={`/producers/${producer.id}/edit`} passHref>
          <ActionButton
            asLink
            $variant="edit"
            aria-label={`Editar produtor ${producer.name}`}
          >
            <MdEdit size={18} />
            Editar
          </ActionButton>
        </Link>

        <ActionButton
          $variant="delete"
          aria-label={`Excluir produtor ${producer.name}`}
          onClick={() => onDeleteClick(producer)}
        >
          <MdDelete size={18} />
          Excluir
        </ActionButton>
      </ActionsRow>
    </Card>
  );
};
