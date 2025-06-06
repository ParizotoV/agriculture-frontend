"use client";

import type { Crop } from "@/entities/Crop";
import { formatCurrency } from "@/utils/formatCurrency";
import Link from "next/link";
import React from "react";
import { MdDelete, MdEdit, MdInfoOutline } from "react-icons/md";
import styled from "styled-components";

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  }

  th,
  td {
    padding: ${({ theme }) => theme.spacing.sm}
      ${({ theme }) => theme.spacing.md};
    vertical-align: middle;
    box-sizing: border-box;
  }

  th {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.textDark};
    font-weight: 600;
    text-align: left;
    border-bottom: 2px solid ${({ theme }) => theme.colors.border};
    white-space: nowrap;
  }

  td {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.text};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    white-space: nowrap;
  }

  td.numeric {
    text-align: left;
  }

  td.actions {
    display: flex;
    gap: ${({ theme }) => theme.spacing.xs};
    justify-content: flex-start;
  }

  tbody tr:hover {
    background-color: ${({ theme }) => theme.colors.backgroundHover};
  }
`;

const ActionLink = styled(Link)<{ $variant?: "info" | "edit" | "delete" }>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: 500;
  border-radius: 4px;
  text-decoration: none;
  color: #fff;
  transition: background-color 0.2s ease-in-out;

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

interface CropsTableProps {
  crops: Crop[];
  onDelete: (crop: Crop) => void;
}

const CropsTable: React.FC<CropsTableProps> = ({ crops, onDelete }) => {
  return (
    <Table>
      <thead>
        <tr>
          <th className="numeric">Safra</th>
          <th>Fazenda</th>
          <th>Cultura</th>
          <th className="numeric">Colheita</th>
          <th className="numeric">Preço (R$)</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {crops.length === 0 ? (
          <tr>
            <td colSpan={6} style={{ textAlign: "center", padding: "2rem 0" }}>
              Nenhuma cultura cadastrada.
            </td>
          </tr>
        ) : (
          crops.map((crop) => (
            <tr key={crop.id}>
              <td className="numeric">{crop.season}</td>
              <td>
                {crop.farm && crop.farm.name ? crop.farm.name : <em>—</em>}
              </td>
              <td>{crop.cultureName}</td>
              <td className="numeric">
                {crop.harvestQuantity ? crop.harvestQuantity : <em>—</em>}
              </td>
              <td className="numeric">
                {crop.priceReceived ? (
                  formatCurrency(crop.priceReceived)
                ) : (
                  <em>—</em>
                )}
              </td>
              <td className="actions">
                <ActionLink
                  href={`/crops/${crop.id}`}
                  $variant="info"
                  aria-label={`Ver detalhes da cultura ${crop.cultureName}`}
                >
                  <MdInfoOutline size={16} />
                  <span>Ver</span>
                </ActionLink>

                <ActionLink
                  href={`/crops/${crop.id}/edit`}
                  $variant="edit"
                  aria-label={`Editar cultura ${crop.cultureName}`}
                >
                  <MdEdit size={16} />
                  <span>Editar</span>
                </ActionLink>

                <ActionLink
                  as="button"
                  type="button"
                  href="#"
                  onClick={() => onDelete(crop)}
                  $variant="delete"
                  style={{ border: "none", background: "none" }}
                >
                  <MdDelete size={16} />
                  <span>Excluir</span>
                </ActionLink>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
};

export default CropsTable;
