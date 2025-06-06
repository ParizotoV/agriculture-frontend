"use client";

import type { Crop } from "@/entities/Crop";
import { formatCurrency } from "@/utils/formatCurrency";
import Link from "next/link";
import React from "react";
import { MdEdit, MdInfoOutline } from "react-icons/md";
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

  max-width: 320px;
  width: 100%;
`;

const TopInfo = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const CropName = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
`;

const CropSeason = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 ${({ theme }) => theme.spacing.xs}
    ${({ theme }) => theme.spacing.sm} 0;
`;

const CropStats = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.4;
  margin-bottom: ${({ theme }) => theme.spacing.md};

  & > div {
    margin-bottom: ${({ theme }) => theme.spacing.xs};
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
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ActionButton = styled(Link)<{ $variant?: "info" | "edit" }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
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

interface CropCardProps {
  crop: Crop;
}

export const CropCard: React.FC<CropCardProps> = ({ crop }) => {
  return (
    <Card>
      <TopInfo>
        <CropName>{crop.cultureName}</CropName>
        <CropSeason>Safra: {crop.season}</CropSeason>
      </TopInfo>

      {(crop.harvestQuantity || crop.priceReceived) && (
        <CropStats>
          {crop.harvestQuantity && (
            <div>
              <span className="label">Colheita:</span>
              <span className="value">{crop.harvestQuantity} </span>
            </div>
          )}
          {crop.priceReceived && (
            <div>
              <span className="label">Preço (R$):</span>
              <span className="value">
                {formatCurrency(crop.priceReceived)}
              </span>
            </div>
          )}
        </CropStats>
      )}

      <ActionsRow>
        <ActionButton
          href={`/crops/${crop.id}`}
          $variant="info"
          aria-label={`Ver detalhes da cultura ${crop.cultureName}`}
        >
          <MdInfoOutline size={18} />
          Ver detalhes
        </ActionButton>

        <ActionButton
          href={`/crops/${crop.id}/edit`}
          $variant="edit"
          aria-label={`Editar cultura ${crop.cultureName}`}
        >
          <MdEdit size={18} />
          Editar
        </ActionButton>
      </ActionsRow>
    </Card>
  );
};
