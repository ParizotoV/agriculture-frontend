"use client";

import { DashboardCharts } from "@/components/organisms/DashboardCharts";
import { loadDashboard } from "@/features/dashboard/dashboardSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

const Container = styled.div`
  padding: 2rem;
`;

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { byCulture, byLandUse, byState, summary } = useSelector(
    (state: RootState) => state.dashboard
  );

  useEffect(() => {
    dispatch(loadDashboard());
  }, [dispatch]);

  return (
    <Container>
      <h1>Dashboard Brain Agriculture</h1>
      <p>Total de fazendas cadastradas: {summary.totalFarms}</p>
      <p>Total de hectares registrados: {summary.totalHectares}</p>
      <DashboardCharts
        byCulture={byCulture}
        byLandUse={byLandUse}
        byState={byState}
      />
    </Container>
  );
}
