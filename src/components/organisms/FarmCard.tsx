"use client";

import type { Farm } from "@/entities/Farm";
import Link from "next/link";
import React from "react";
import { MdDelete, MdEdit, MdInfoOutline } from "react-icons/md";
import styled from "styled-components";
import { ProducerSubtitleName } from "../atoms/ProducerSubtitleName";

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
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const FarmName = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
`;

const FarmLocation = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const AreasInfo = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.4;

  & > div {
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }

  & > div:last-child {
    margin-bottom: 0;
  }

  & > div > span.label {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textDark};
    display: inline-block;
    width: 100px;
  }

  & > div > span.value {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const ActionsRow = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const ActionButton = styled(Link)<{ $variant?: "info" | "edit" | "delete" }>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;
  border-radius: 4px;
  text-decoration: none;
  color: #fff;
  transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out;

  ${({ $variant, theme }) =>
    $variant === "edit"
      ? `
    background-color: ${theme.colors.accent};
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
    &:hover {
      background-color: ${theme.colors.support};
    }
  `}

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

interface FarmCardProps {
  farm: Farm;
  onDeleteClick: (farm: Farm) => void;
}

export const FarmCard: React.FC<FarmCardProps> = ({ farm, onDeleteClick }) => {
  return (
    <Card>
      <TopInfo>
        <FarmName>{farm.name}</FarmName>
        {farm.producer && (
          <ProducerSubtitleName>{farm.producer.name}</ProducerSubtitleName>
        )}
        <FarmLocation>
          {farm.city}, {farm.state}
        </FarmLocation>
      </TopInfo>

      <AreasInfo>
        <div>
          <span className="label">Área Total:</span>
          <span className="value">{farm.totalArea} ha</span>
        </div>
        <div>
          <span className="label">Agricultável:</span>
          <span className="value">{farm.agriculturalArea} ha</span>
        </div>
        <div>
          <span className="label">Vegetação:</span>
          <span className="value">{farm.vegetationArea} ha</span>
        </div>
      </AreasInfo>

      <ActionsRow>
        <ActionButton
          href={`/farms/${farm.id}`}
          $variant="info"
          aria-label={`Ver detalhes da fazenda ${farm.name}`}
        >
          <MdInfoOutline size={18} />
          Ver detalhes
        </ActionButton>

        <ActionButton
          href={`/farms/${farm.id}/edit`}
          $variant="edit"
          aria-label={`Editar fazenda ${farm.name}`}
        >
          <MdEdit size={18} />
          Editar
        </ActionButton>

        <ActionButton
          as="button"
          type="button"
          href="#"
          $variant="delete"
          aria-label={`Excluir fazenda ${farm.name}`}
          onClick={() => onDeleteClick(farm)}
        >
          <MdDelete size={18} />
          Excluir
        </ActionButton>
      </ActionsRow>
    </Card>
  );
};
