"use client";

import type { AppDispatch } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import type { Producer } from "@/entities/Producer";
import {
  loadProducerById,
  updateProducer,
} from "@/features/producers/producersSlice";
import type { RootState } from "@/store/store";
import {
  ProducerFormData,
  producerSchema,
} from "../../app/producers/new/schema";

import { Button } from "../atoms/Button";
import { ErrorMessage } from "../atoms/ErrorMessage";
import { FormField } from "../atoms/FormField";
import { FormTitle } from "../atoms/FormTitle";
import { FormWrapper } from "../atoms/FormWrapper";
import { Input } from "../atoms/Input";
import { Label } from "../atoms/Label";
import { ButtonGroup } from "../molecules/ButtonGroup";

export const EditProducerForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const {
    list: producers,
    loading,
    error,
  } = useSelector((state: RootState) => state.producers);

  useEffect(() => {
    const exists = producers.some((p) => p.id === id);
    if (!exists) {
      dispatch(loadProducerById(id));
    }
  }, [dispatch, id, producers]);

  const producer: Producer | undefined = producers.find((p) => p.id === id);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProducerFormData>({
    resolver: zodResolver(producerSchema),
    defaultValues: {
      name: producer?.name || "",
      cpfCnpj: producer?.cpfCnpj || "",
    },
  });

  useEffect(() => {
    if (producer) {
      reset({
        name: producer.name,
        cpfCnpj: producer.cpfCnpj,
      });
    }
  }, [producer, reset]);

  const onSubmit = async (data: ProducerFormData) => {
    try {
      const resultAction = await dispatch(
        updateProducer({
          id: id as string,
          cpfCnpj: data.cpfCnpj,
          name: data.name,
        })
      );
      if (updateProducer.rejected.match(resultAction)) {
        const errorMsg = resultAction.payload as string;
        toast.error(errorMsg);
        return;
      }

      router.push("/producers");
    } catch (err) {
      console.error("Erro inesperado ao atualizar produtor:", err);
      toast.error("Erro inesperado ao atualizar produtor.");
    }
  };

  const onCancel = () => {
    router.push("/producers");
  };

  if (loading)
    return <FormWrapper>Carregando dados do produtor para editar…</FormWrapper>;

  if (error)
    return (
      <FormWrapper>
        <p style={{ color: "#e53935" }}>{error}</p>
      </FormWrapper>
    );

  if (!producer)
    return (
      <FormWrapper>
        <p style={{ color: "#757575" }}>Produtor não encontrado.</p>
      </FormWrapper>
    );

  return (
    <FormWrapper>
      <FormTitle>Editar Produtor</FormTitle>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField>
          <Label htmlFor="name">Nome do Produtor</Label>
          <Input
            id="name"
            type="text"
            placeholder="Digite o nome completo"
            $hasError={!!errors.name}
            {...register("name")}
          />
          {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
        </FormField>

        <FormField>
          <Label htmlFor="cpfCnpj">CPF ou CNPJ (apenas dígitos)</Label>
          <Input
            id="cpfCnpj"
            type="text"
            placeholder="Ex: 12345678900 ou 12345678000199"
            $hasError={!!errors.cpfCnpj}
            maxLength={14}
            {...register("cpfCnpj")}
          />
          {errors.cpfCnpj && (
            <ErrorMessage>{errors.cpfCnpj.message}</ErrorMessage>
          )}
        </FormField>

        <ButtonGroup>
          <Button type="button" $variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" $variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Atualizando..." : "Salvar Alterações"}
          </Button>
        </ButtonGroup>
      </form>
    </FormWrapper>
  );
};
