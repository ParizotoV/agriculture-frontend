"use client";

import type { AppDispatch } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

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

import { createProducer } from "@/features/producers/producersSlice";

export const NewProducerForm: React.FC = () => {
  const { register, handleSubmit, formState } = useForm<ProducerFormData>({
    resolver: zodResolver(producerSchema),
  });
  const { errors, isSubmitting } = formState;

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const onSubmit = async (data: ProducerFormData) => {
    try {
      const resultAction = await dispatch(
        createProducer({
          name: data.name,
          cpfCnpj: data.cpfCnpj,
        })
      );

      if (createProducer.rejected.match(resultAction)) {
        const errorMsg = resultAction.payload as string;
        toast.error(errorMsg);
        return;
      }

      router.push("/producers");
    } catch (err) {
      console.error("Falha inesperada ao criar produtor:", err);
      toast.error("Erro inesperado ao criar produtor.");
    }
  };

  const onCancel = () => {
    router.push("/producers");
  };

  return (
    <FormWrapper>
      <FormTitle>Novo Produtor</FormTitle>
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
            {isSubmitting ? "Salvando..." : "Salvar Produtor"}
          </Button>
        </ButtonGroup>
      </form>
    </FormWrapper>
  );
};
