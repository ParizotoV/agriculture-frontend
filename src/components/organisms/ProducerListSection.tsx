"use client";

import {
  deleteProducer,
  loadProducers,
} from "@/features/producers/producersSlice";
import type { AppDispatch, RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { Producer } from "@/entities/Producer";
import { Container } from "../atoms/Container";
import { Text, TextSecondary } from "../atoms/Text";
import { PageHeader } from "../molecules/PageHeader";
import { SearchBar } from "../molecules/SearchBar";
import { ConfirmationModal } from "./ConfirmationModal";
import { ProducerList } from "./ProducerList";

export const ProducerListSection: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const {
    list: allProducers,
    loading,
    error,
  } = useSelector((state: RootState) => state.producers);
  const [searchTerm, setSearchTerm] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [producerToDelete, setProducerToDelete] = useState<null | string>(null);

  useEffect(() => {
    dispatch(loadProducers());
  }, [dispatch]);

  const filteredProducers = useMemo(() => {
    return allProducers.filter((p) => {
      const lower = searchTerm.toLowerCase();
      return (
        p?.name?.toLowerCase().includes(lower) ||
        p?.cpfCnpj?.toLowerCase().includes(lower)
      );
    });
  }, [allProducers, searchTerm]);

  const handleDeleteClick = (producer: Producer) => {
    setProducerToDelete(producer.id ?? null);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!producerToDelete) return;
    await dispatch(deleteProducer(producerToDelete));
    dispatch(loadProducers());
    setModalOpen(false);
    setProducerToDelete(null);
  };

  const handleCancelDelete = () => {
    setModalOpen(false);
    setProducerToDelete(null);
  };

  return (
    <Container>
      <PageHeader
        title="Produtores Cadastrados"
        onAddClick={() => router.push("/producers/new")}
      />

      <SearchBar
        value={searchTerm}
        placeholder="Buscar produtor pelo nome ou documento..."
        onChange={(val) => setSearchTerm(val)}
      />

      {loading && <Text>Carregando produtores...</Text>}
      {error && <TextSecondary>{error}</TextSecondary>}
      {!loading && !error && (
        <ProducerList
          producers={filteredProducers}
          onDelete={handleDeleteClick}
        />
      )}

      <ConfirmationModal
        isOpen={modalOpen}
        title="Excluir Produtor"
        message="Tem certeza que deseja excluir este produtor? Esta ação não pode ser desfeita."
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </Container>
  );
};
