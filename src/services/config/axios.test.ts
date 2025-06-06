import type { AxiosRequestConfig } from "axios";
import { api } from "./axios";

describe("api axios instance", () => {
  const interceptor = api.interceptors.request.handlers[0].fulfilled;

  beforeEach(() => {
    localStorage.clear();
  });

  it("deve adicionar o header Authorization quando existir token no localStorage", () => {
    localStorage.setItem("token", "meu-token-de-teste");
    const config: AxiosRequestConfig = { headers: {} };

    const updatedConfig = interceptor(config);

    expect(updatedConfig.headers!["Authorization"]).toBe(
      "Bearer meu-token-de-teste"
    );
  });

  it("não deve adicionar header Authorization quando não houver token", () => {
    const config: AxiosRequestConfig = { headers: {} };

    const updatedConfig = interceptor(config);

    expect(updatedConfig.headers!["Authorization"]).toBeUndefined();
  });

  it("mantém outras propriedades do config inalteradas", () => {
    localStorage.setItem("token", "token123");
    const config: AxiosRequestConfig = {
      url: "/teste",
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    const updatedConfig = interceptor(config);

    expect(updatedConfig.url).toBe("/teste");
    expect(updatedConfig.method).toBe("GET");
    expect(updatedConfig.headers!["Content-Type"]).toBe("application/json");
    expect(updatedConfig.headers!["Authorization"]).toBe("Bearer token123");
  });
});
