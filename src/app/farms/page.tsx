"use client";

import { ConfirmationModal } from "@/components/organisms/ConfirmationModal";
import { FarmList } from "@/components/organisms/FarmList";
import type { Farm } from "@/entities/Farm";
import { deleteFarm, loadFarms } from "@/features/farms/farmsSlice";
import type { AppDispatch, RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

const PageWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PageTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.text};
`;

const AddButton = styled.button`
  background-color: ${({ theme }) => theme.colors.accent};
  color: #fff;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: none;
  border-radius: 4px;
  font-size: ${({ theme }) => theme.fontSizes.md};
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

export default function FarmsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [farmToDelete, setFarmToDelete] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const {
    list: farms,
    loading,
    error,
  } = useSelector((state: RootState) => state.farms);

  useEffect(() => {
    dispatch(loadFarms());
  }, [dispatch]);

  const handleDeleteClick = (farm: Farm) => {
    setFarmToDelete(farm.id ?? null);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!farmToDelete) return;
    await dispatch(deleteFarm(farmToDelete));
    dispatch(loadFarms());
    setModalOpen(false);
    setFarmToDelete(null);
  };

  const handleCancelDelete = () => {
    setModalOpen(false);
    setFarmToDelete(null);
  };

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>Fazendas Cadastradas</PageTitle>
        <AddButton onClick={() => (window.location.href = "/farms/new")}>
          + Adicionar Fazenda
        </AddButton>
      </PageHeader>

      {loading && <p>Carregando fazendas...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <FarmList farms={farms} onDelete={handleDeleteClick} />
      )}

      <ConfirmationModal
        isOpen={modalOpen}
        title="Excluir Fazenda"
        message="Tem certeza que deseja excluir esta fazenda? Esta ação não pode ser desfeita."
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </PageWrapper>
  );
}
