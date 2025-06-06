# AgroApp

Aplicação web para gerenciamento de produtores, fazendas e culturas, construída com Next.js 15, React, Redux Toolkit, React Hook Form, Zod, Styled-Components e Recharts. 

> **Obs.** Este README está escrito em Português, mas os comandos de terminal são universais.

---

## Índice

- [Visão Geral](#visão-geral)
- [Principais Funcionalidades](#principais-funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Padrões e Convenções](#padrões-e-convenções)
- [Componentização](#componentização)
- [Testes](#testes)
- [Deploy](#deploy)
- [Licença](#licença)

---

## Visão Geral

O **AgroApp** é uma aplicação web que permite ao usuário:

- Cadastrar, listar, editar e remover **Produtores**.
- Cadastrar, listar, editar e remover **Fazendas**, associando-as a Produtores.
- Cadastrar, listar, editar e remover **Culturas** (colheitas), associadas a Fazendas.
- Visualizar um **Dashboard** com gráficos de:

  1. Contagem de fazendas por estado.
  2. Contagem de culturas.
  3. Receita por cultura.
  4. Colheita por cultura.
  5. Uso do solo.

- Navegar pela aplicação usando um layout que combina **NavBar** fixa, **Sidebar** recolhível/colapsável e menu responsivo.
- Buscar Produtores dinamicamente (filtro por nome ou CPF/CNPJ).

A interface utiliza React 20 com Next.js 15 (App Router), Redux Toolkit para gerenciamento de estado global, Styled-Components para estilização e Recharts para visualização de dados.

---

## Principais Funcionalidades

1. **Produtores**  
   - Listagem paginada/filtrada de produtores.  
   - Adicionar novo produtor via formulário (validações com Zod e React Hook Form).  
   - Editar produtor existente.  
   - Remover produtor.  

2. **Fazendas**  
   - Listagem de fazendas.  
   - Adicionar nova fazenda vinculando a um produtor.  
   - Editar fazenda existente.  
   - Remover fazenda.  

3. **Culturas (Colheitas)**  
   - Listagem de culturas.  
   - Adicionar nova cultura vinculando a uma fazenda.  
   - Editar cultura existente (quantidade de colheita, preço recebido, safra).  
   - Remover cultura.  

4. **Dashboard**  
   - Gráficos de pizza (PieChart) para análise de dados (fácil compreensão e interação).  

5. **UI/UX**  
   - Layout responsivo com NavBar fixa, Sidebar recolhível e área principal adaptável.  
   - Theming básico via Styled-Components.  
   - Feedback de carregamento e erros via **React Toastify**.  

---

## Tecnologias Utilizadas

- **Next.js 15** (App Router, Server/Client Components)
- **React 20**  
- **Redux Toolkit** (createSlice, createAsyncThunk)  
- **React Redux**  
- **React Hook Form** + **Zod** (validação de formulários)  
- **Styled-Components** (CSS-in-JS + ThemeProvider)  
- **Recharts** (visualização de gráficos)  
- **Axios** (chamadas HTTP)  
- **React Toastify** (notificações/toasts)  
- **TypeScript**  
- **Jest** + **React Testing Library** (testes unitários e de componente)  

---

## Pré-requisitos

1. **Node.js** (versão ≥ 18)  
2. **npm** ou **Yarn** (gerenciador de pacotes)

---

## Instalação

1. **Clone o repositório**  
   ```bash
   git clone https://github.com/seu-usuario/agroapp.git
   cd agroapp
   ```

2. **Instale as dependências**  
   Com npm:
   ```bash
   npm install
   ```
   Ou com Yarn:
   ```bash
   yarn install
   ```

3. **Variáveis de ambiente**  
   Crie um arquivo `.env.local` na raiz (caso ainda não exista) e defina a URL da API:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```
   > Se a API estiver em outra porta ou domínio, ajuste a variável `NEXT_PUBLIC_API_URL` conforme necessário.

---

## Scripts Disponíveis

No terminal, a partir da raiz do projeto, você poderá rodar:

- **`npm run dev`**  
  Inicia o servidor de desenvolvimento do Next.js em modo hot-reload (padrão: `http://localhost:3000`).  

- **`npm run build`**  
  Gera uma build otimizada para produção em pastas `.next`.

- **`npm run start`**  
  Executa a aplicação em modo de produção, servida a partir da build gerada.

- **`npm run lint`**  
  Roda o ESLint para verificar problemas de estilo/código.

- **`npm run test`**  
  Executa todos os testes unitários com Jest + React Testing Library.  

- **`npm run test:watch`**  
  Executa os testes em modo "watch", recarregando automaticamente sempre que um arquivo for alterado.

> **Dica:** se usar **Yarn**, substitua `npm run ...` por `yarn ...`.

---

## Estrutura de Pastas

```
├── public/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── crops/
│   │   │   ├── [id]/
│   │   │   │   ├── edit/       ← Página de edição (Next.js App Router)
│   │   │   │   │   └── schema/  ← Esquema Zod para validação de formulário
│   │   │   │   └── page.tsx     ← Exibição/Detalhes da cultura
│   │   │   ├── new/
│   │   │   │   └── page.tsx     ← Página de criação de nova cultura
│   │   ├── farms/
│   │   │   ├── [id]/
│   │   │   │   ├── edit/        ← Página de edição de fazenda
│   │   │   │   │   └── schema/  ← Esquema Zod para validação
│   │   │   │   └── page.tsx     ← Exibição/Detalhes da fazenda
│   │   │   ├── new/
│   │   │   │   └── page.tsx     ← Página de criação de nova fazenda
│   │   ├── producers/
│   │   │   ├── [id]/
│   │   │   │   ├── edit/        ← Página de edição de produtor
│   │   │   │   └── page.tsx     ← Exibição/Detalhes do produtor
│   │   │   ├── new/
│   │   │   │   └── page.tsx     ← Página de criação de novo produtor
│   │   ├── layout.tsx           ← Layout global (NavBar + Sidebar + Providers)
│   │   └── globals.css          ← Estilos globais
│   │
│   ├── components/              ← Componentes reutilizáveis (Design System)
│   │   ├── atoms/               ← Componentes atômicos
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Label.tsx
│   │   │   ├── MoneyInput.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── SectionTitle.tsx
│   │   │   ├── Text.tsx
│   │   │   └── … (outros)
│   │   │
│   │   ├── molecules/           ← Combinações de átomos (ex.: Card, PageHeader)
│   │   │   ├── ProducerCard.tsx
│   │   │   ├── FarmCard.tsx
│   │   │   ├── CropCard.tsx
│   │   │   ├── PageHeader.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── … (outros)
│   │   │
│   │   ├── organisms/           ← Combinações de moléculas e átomos (seções completas)
│   │   │   ├── ProducerList.tsx
│   │   │   ├── FarmList.tsx
│   │   │   ├── CropList.tsx
│   │   │   ├── CropsTable.tsx
│   │   │   ├── DashboardCharts.tsx
│   │   │   ├── EditProducerForm.tsx
│   │   │   ├── EditFarmForm.tsx
│   │   │   ├── EditCropForm.tsx
│   │   │   ├── NewProducerForm.tsx
│   │   │   ├── NewFarmForm.tsx
│   │   │   ├── NewCropForm.tsx
│   │   │   ├── NavBar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── … (outros)
│   │
│   ├── context/
│   │   ├── SidebarContext.tsx      ← Contexto para controlar abertura/colapso da sidebar
│   │
│   ├── entities/
│   │   ├── Producer.ts
│   │   ├── Farm.ts
│   │   └── Crop.ts
│   │
│   ├── features/
│   │   ├── producers/
│   │   │   ├── producersSlice.ts
│   │   │   └── producersSlice.test.ts
│   │   ├── farms/
│   │   │   ├── farmsSlice.ts
│   │   │   └── farmsSlice.test.ts
│   │   ├── cultures/
│   │   │   ├── culturesSlice.ts
│   │   │   └── culturesSlice.test.ts
│   │   └── dashboard/
│   │       ├── dashboardSlice.ts
│   │       └── dashboardSlice.test.ts
│   │
│   ├── services/                    ← Camada de comunicação com API (via Axios)
│   │   ├── config/                  ← Configurações gerais do Axios
│   │   │   ├── axios.ts
│   │   │   └── axios.test.ts
│   │   ├── ProducersService.ts
│   │   ├── ProducersService.test.ts
│   │   ├── FarmsService.ts
│   │   ├── FarmsService.test.ts
│   │   ├── CropsService.ts
│   │   ├── CropsService.test.ts
│   │   └── DashboardService.ts
│   │       └── DashboardService.test.ts
│   │
│   ├── store/
│   │   ├── store.ts
│   │   └── store.test.ts
│   │
│   ├── templates/                  ← Templates e Providers globais
│   │   ├── Providers.tsx
│   │   └── Providers.test.tsx
│   │
│   ├── utils/
│   │   ├── formatCurrency.ts       ← Função utilitária de formatação
│   │   └── formatCurrency.test.ts
│   │
│   └── styled.d.ts                  ← Tipagens do tema do Styled-Components
│
├── .eslintrc.js                     ← Configuração ESLint
├── jest.config.js                   ← Configuração Jest
├── jest.setup.js                    ← Setup Jest (ex.: configuração de Mocks)
├── next.config.js                   ← Configurações Next.js
├── tsconfig.json                    ← Configurações TypeScript
└── README.md                        ← Este arquivo
```

---

## Padrões e Convenções

1. **Arquivos e Pastas**  
   - `PascalCase` para componentes React (ex.: `ProducerCard.tsx`).  
   - `camelCase` para variáveis, funções e hooks (ex.: `useSidebar`).  
   - `store/`, `features/`, `services/`, `context/`, `components/`, `utils/`, `app/` → convenção de pastas por responsabilidade.  

2. **Estilização**  
   - **Styled-Components**: cada componente que possui estilos usa `styled.[element]` e recebe props tipadas para aplicar condicionais.  
   - O tema global (ThemeProvider) fica em `Providers.tsx`, com cores e espaçamentos reutilizáveis.  

3. **Formulários**  
   - **React Hook Form** + **Zod** para validação.  
   - Cada formulário (novo ou editar) está sob `app/[recurso]/[id]/edit/schema` ou `app/[recurso]/new/schema`.  

4. **Redux Toolkit**  
   - Cada slice está em `features/[recurso]/[recurso]Slice.ts`.  
   - Criar testes de slice em `features/[recurso]/[recurso]Slice.test.ts`.  
   - Estados assíncronos usando `createAsyncThunk`.  

5. **Testes**  
   - **Jest** + **React Testing Library** para componentes e slices.  
   - Testes seguem convenção de nome: `*.test.ts` ou `*.test.tsx`.  

---

## Componentização

Estamos seguindo a abordagem **Atomic Design**, dividindo em três níveis principais:

1. **Atoms (Átomos)**  
   - São componentes básicos, sem lógica de negócio além de estilo ou campos genéricos (ex.: `Button`, `Input`, `Label`, `Text`, `SectionTitle`).  
   - Devem ser reutilizáveis em toda a aplicação.

2. **Molecules (Moléculas)**  
   - Combinações de átomos que formam pequenas partes funcionais, mas ainda isoladas (ex.: `ProducerCard`, `FarmCard`, `CropCard`, `SearchBar`, `PageHeader`).  
   - Cada molécula recebe props tipadas e encapsula lógica mínima (ex.: links, ícones, eventos).

3. **Organisms (Organismos)**  
   - Partes completas de interface que reúnem moléculas e átomos, possivelmente com lógica mais complexa (ex.: `ProducerList`, `FarmList`, `CropList`, `CropsTable`, `DashboardCharts`, formulários de CRUD, `NavBar`, `Sidebar`).  
   - São responsáveis por orquestrar estado global, efeitos colaterais (hooks, dispatch), chamadas à API via Redux, etc.

---

## Testes

A pasta `src/` conta com testes para:

- **Slices do Redux** (`src/features/*/*.test.ts`):  
  - Validações de reducers e thunks (pending, fulfilled, rejected).  

- **Serviços (Services)** (`src/services/*Service.test.ts`):  
  - Mocks de `axios` para garantir que as chamadas corretas sejam feitas (método, rota, payload).  

- **Componentes** (`src/components/atoms/*.test.tsx`, `src/components/molecules/*.test.tsx`, `src/components/organisms/*.test.tsx`):  
  - Renderização, props, interações básicas, acessibilidade (role, aria-label).  

- **Templates/Providers** (`src/templates/*.test.tsx`):  
  - Verifica que providers de contexto, Redux e tema estejam funcionando corretamente para componentes internos.  

- **Utilitários** (`src/utils/formatCurrency.test.ts`):  
  - Validação das regras de formatação de moeda.

Para executar todos os testes:

```bash
npm run test
```

Para executar em modo watch (recomenda-se para desenvolvimento contínuo):

```bash
npm run test:watch
```

---

## Deploy

Para colocar em produção:

1. **Buildar a aplicação**  
   ```bash
   npm run build
   ```

2. **Iniciar no modo produção**  
   ```bash
   npm run start
   ```

3. **Servidor de Produção**  
   - Configure um servidor (Vercel, Netlify, DigitalOcean, AWS) apontando para o diretório gerado em `.next`.  
   - Garanta que a variável `NEXT_PUBLIC_API_URL` aponte para sua API REST em produção.  

---

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).  
Sinta-se à vontade para usar, modificar e distribuir conforme os termos desta licença.

---

**Desenvolvido com ❤️ por Vinicius V. Parizoto.**  
