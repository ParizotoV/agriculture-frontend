"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import type { Farm } from "@/entities/Farm";
import { createCrop } from "@/features/cultures/culturesSlice";
import { loadFarms } from "@/features/farms/farmsSlice";
import type { AppDispatch, RootState } from "@/store/store";

import { CropFormData, cropSchema } from "@/app/crops/[id]/edit/schema/schema";

import { Button } from "../atoms/Button";
import { ErrorMessage } from "../atoms/ErrorMessage";
import { FormField } from "../atoms/FormField";
import { FormTitle } from "../atoms/FormTitle";
import { FormWrapper } from "../atoms/FormWrapper";
import { Input } from "../atoms/Input";
import { Label } from "../atoms/Label";
import { MoneyInput } from "../atoms/MoneyInput";
import { Select } from "../atoms/Select";
import { ButtonGroup } from "../molecules/ButtonGroup";

export const NewCropForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { list: farms, loading: loadingFarms } = useSelector(
    (state: RootState) => state.farms
  );

  useEffect(() => {
    if (farms.length === 0) {
      dispatch(loadFarms());
    }
  }, [dispatch, farms.length]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<CropFormData>({
    resolver: zodResolver(cropSchema),
    defaultValues: {
      farmId: "",
      cultureName: "",
      season: "",
      harvestQuantity: "",
      priceReceived: "",
    },
  });

  const onSubmit = async (data: CropFormData) => {
    try {
      const farmId = data.farmId;
      const cultureName = data.cultureName;
      const season = data.season;

      let harvestQuantity = 0;
      if (data.harvestQuantity) {
        const parsed = parseFloat(data.harvestQuantity.replace(",", "."));
        harvestQuantity = isNaN(parsed) ? 0 : parsed;
      }

      let priceReceived = 0;
      if (data.priceReceived) {
        const cleaned = data.priceReceived
          .replace(/[^0-9,-]/g, "")
          .replace(",", ".");
        const parsed = parseFloat(cleaned);
        priceReceived = isNaN(parsed) ? 0 : parsed;
      }

      const newCropPayload = {
        farmId,
        cultureName,
        season,
        harvestQuantity,
        priceReceived,
      };

      const resultAction = await dispatch(createCrop(newCropPayload));

      if (createCrop.rejected.match(resultAction)) {
        const errorMsg = resultAction.payload as string;
        toast.error(errorMsg);
        return;
      }

      router.push("/crops");
    } catch (err) {
      console.error("Erro inesperado ao criar cultura:", err);
      toast.error("Erro inesperado ao criar cultura.");
    }
  };

  const onCancel = () => {
    router.push("/crops");
  };

  return (
    <FormWrapper>
      <FormTitle>Nova Cultura</FormTitle>

      {loadingFarms && <p>Carregando fazendas...</p>}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Seleção da Fazenda */}
        <FormField>
          <Label htmlFor="farmId">Fazenda</Label>
          <Select
            id="farmId"
            $hasError={!!errors.farmId}
            {...register("farmId")}
            defaultValue=""
          >
            <option value="" disabled>
              Selecione uma fazenda…
            </option>
            {farms.map((f: Farm) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.city}, {f.state})
              </option>
            ))}
          </Select>
          {errors.farmId && (
            <ErrorMessage>{errors.farmId.message}</ErrorMessage>
          )}
        </FormField>

        {/* Nome da Cultura */}
        <FormField>
          <Label htmlFor="cultureName">Nome da Cultura</Label>
          <Input
            id="cultureName"
            type="text"
            placeholder="Ex: Soja"
            $hasError={!!errors.cultureName}
            {...register("cultureName")}
          />
          {errors.cultureName && (
            <ErrorMessage>{errors.cultureName.message}</ErrorMessage>
          )}
        </FormField>

        {/* Safra */}
        <FormField>
          <Label htmlFor="season">Safra</Label>
          <Input
            id="season"
            type="text"
            placeholder="Ex: 2022"
            $hasError={!!errors.season}
            {...register("season")}
          />
          {errors.season && (
            <ErrorMessage>{errors.season.message}</ErrorMessage>
          )}
        </FormField>

        <FormField>
          <Label htmlFor="harvestQuantity">Colheita (Toneladas)</Label>
          <Input
            id="harvestQuantity"
            type="text"
            inputMode="decimal"
            placeholder="Ex: 200.5"
            $hasError={!!errors.harvestQuantity}
            {...register("harvestQuantity")}
            onKeyDown={(e) => {
              const allowedKeys = [
                "0",
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                ".",
                ",",
                "Backspace",
                "ArrowLeft",
                "ArrowRight",
                "Tab",
                "Delete",
              ];
              if (
                !allowedKeys.includes(e.key) &&
                !(e.key === "c" && (e.ctrlKey || e.metaKey)) &&
                !(e.key === "v" && (e.ctrlKey || e.metaKey))
              ) {
                e.preventDefault();
              }
            }}
            onBlur={(e) => {
              const val = Number(e.currentTarget.value).toFixed(2);

              if (val.includes(",")) {
                e.currentTarget.value = val.replace(",", ".");
              }
              e.currentTarget.value = val;
            }}
          />
          {errors.harvestQuantity && (
            <ErrorMessage>{errors.harvestQuantity.message}</ErrorMessage>
          )}
        </FormField>

        <FormField>
          <Label htmlFor="priceReceived">Preço Recebido (R$)</Label>

          {/** Usamos Controller para integrar o CurrencyInput ao React Hook Form */}
          <Controller
            name="priceReceived"
            control={control}
            render={({ field }) => (
              <MoneyInput
                id="priceReceived"
                placeholder="Ex: R$ 1.234,56"
                prefix="R$ "
                decimalSeparator=","
                groupSeparator="."
                decimalsLimit={2}
                value={field.value}
                $hasError={!!errors.priceReceived}
                onValueChange={(value) => {
                  field.onChange(value === undefined ? "" : value);
                }}
              />
            )}
          />
          {errors.priceReceived && (
            <ErrorMessage>{errors.priceReceived.message}</ErrorMessage>
          )}
        </FormField>

        <ButtonGroup>
          <Button type="button" $variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" $variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Salvando…" : "Salvar Cultura"}
          </Button>
        </ButtonGroup>
      </form>
    </FormWrapper>
  );
};
