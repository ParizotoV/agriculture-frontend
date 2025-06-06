"use client";

import { ConfirmationModal } from "@/components/organisms/ConfirmationModal";
import CropsTable from "@/components/organisms/CropsTable";
import type { Crop } from "@/entities/Crop";
import { deleteCrop, loadCrops } from "@/features/cultures/culturesSlice";
import type { AppDispatch, RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

const PageWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: auto;
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

export default function CropListPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [cropToDelete, setCropToDelete] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const {
    list: crops,
    loading,
    error,
  } = useSelector((state: RootState) => state.cultures);

  useEffect(() => {
    dispatch(loadCrops());
  }, [dispatch]);

  const handleDeleteClick = (farm: Crop) => {
    setCropToDelete(farm.id ?? null);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!cropToDelete) return;
    await dispatch(deleteCrop(cropToDelete));
    dispatch(loadCrops());
    setModalOpen(false);
    setCropToDelete(null);
  };

  const handleCancelDelete = () => {
    setModalOpen(false);
    setCropToDelete(null);
  };

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>Culturas Cadastradas</PageTitle>
        <AddButton onClick={() => (window.location.href = "/crops/new")}>
          + Nova Cultura
        </AddButton>
      </PageHeader>

      {loading && <p>Carregando culturas…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <CropsTable crops={crops} onDelete={handleDeleteClick} />
      )}

      <ConfirmationModal
        isOpen={modalOpen}
        title="Excluir Cultura"
        message="Tem certeza que deseja excluir esta cultura? Esta ação não pode ser desfeita."
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </PageWrapper>
  );
}
