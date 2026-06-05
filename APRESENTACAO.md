# 🏢 TrabalhoJusto — ODS 8 (Apresentação Técnico-Estrutural)

> [!NOTE]
> Este documento apresenta a arquitetura de software, as tecnologias adotadas, a estrutura de pastas e o fluxo do banco de dados da plataforma **TrabalhoJusto**, desenvolvida sob as diretrizes do **Objetivo de Desenvolvimento Sustentável 8 da ONU (Trabalho Decente e Crescimento Econômico)**.

---

## 🛠️ Tecnologias Utilizadas

A plataforma foi construída em cima de uma arquitetura moderna e escalável, utilizando um monorepo gerido por **pnpm workspaces**. Abaixo estão detalhadas as tecnologias empregadas nas três camadas do sistema:

### 1. Frontend
* **[React](https://react.dev/) + [Vite](https://vite.dev/):** Ferramental moderno para SPA (Single Page Application) que garante build instantâneo e excelente performance em tempo de desenvolvimento.
* **[TailwindCSS](https://tailwindcss.com/):** Framework utilitário de CSS usado para criar uma interface limpa, moderna, responsiva e altamente interativa.
* **[TanStack Query (React Query)](https://tanstack.com/query/latest):** Gerenciador de estado assíncrono utilizado para caching de requisições, sincronização e atualização de dados em tempo real da API.
* **[Wouter](https://github.com/molecula-js/wouter):** Roteador minimalista focado em performance e leveza para gerenciamento de páginas internas.

### 2. Backend (Dupla API)
O projeto oferece duas opções de servidor de API independentes que cumprem a mesma especificação (OpenAPI/Swagger):
* **Express 5 (Node.js):** Arquitetura ágil em TypeScript usando bundler [esbuild](https://esbuild.github.io/) para empacotamento em produção.
* **ASP.NET Core (.NET 10 Web API):** Servidor de alta performance em C# com injeção de dependência nativa e documentação Swagger UI integrada no endpoint `/swagger`.

### 3. Banco de Dados & ORMs
* **PostgreSQL + [Drizzle ORM](https://orm.drizzle.team/):** Configuração adotada no backend Node.js. O Drizzle permite escrever queries fortemente tipadas no TypeScript e sincronizar esquemas declarativos de forma instantânea através da ferramenta CLI `drizzle-kit`.
* **SQLite + Entity Framework Core (EF Core):** Configuração adotada no backend .NET. Utiliza persistência local em arquivo (`trabalhojusto.db`) ideal para execução local rápida sem necessidade de servidores externos.

---

## 📂 Mapa da Estrutura do Código e Módulos

Abaixo está o mapa de diretórios do projeto com links rápidos para a localização de cada componente crítico:

* **[ods-8-solution](file:///E:/Ods-8-Solution-main/)** (Raiz do Projeto)
  * **[artifacts/](file:///E:/Ods-8-Solution-main/artifacts/)** (Aplicações Executáveis)
    * 💻 **[trabalho-justo/](file:///E:/Ods-8-Solution-main/artifacts/trabalho-justo/)** (Código-fonte do Frontend em React)
      * **[src/components/](file:///E:/Ods-8-Solution-main/artifacts/trabalho-justo/src/components/)** (Componentes reutilizáveis da interface: botões, cards, layouts)
      * **[src/pages/](file:///E:/Ods-8-Solution-main/artifacts/trabalho-justo/src/pages/)** (Telas do sistema: Dashboard, Empresas, Vagas, Cursos, Recomendações)
    * ⚙️ **[api-server/](file:///E:/Ods-8-Solution-main/artifacts/api-server/)** (Código da API Node.js/Express)
      * **[src/routes/](file:///E:/Ods-8-Solution-main/artifacts/api-server/src/routes/)** (Endpoints que processam requisições de empresas, funcionários e score)
    * ⚙️ **[api-server-dotnet/](file:///E:/Ods-8-Solution-main/artifacts/api-server-dotnet/)** (Código da API C#/.NET 10)
      * **[Controllers/](file:///E:/Ods-8-Solution-main/artifacts/api-server-dotnet/Controllers/)** (Rotas C# estruturadas no padrão MVC)
      * **[Data/](file:///E:/Ods-8-Solution-main/artifacts/api-server-dotnet/Data/)** (Contexto do Entity Framework e Seeder do banco SQLite)
  * **[lib/](file:///E:/Ods-8-Solution-main/lib/)** (Bibliotecas e Módulos Compartilhados)
    * 🗄️ **[db/](file:///E:/Ods-8-Solution-main/lib/db/)** (Esquema de Dados e Conexão PostgreSQL)
      * **[src/schema/](file:///E:/Ods-8-Solution-main/lib/db/src/schema/)** (Definições de tabelas para Drizzle: `companies.ts`, `employees.ts`, `indicators.ts`, etc.)
    * 📜 **[api-spec/](file:///E:/Ods-8-Solution-main/lib/api-spec/)** (Especificação do protocolo da API via OpenAPI 3.1)
  * **[scripts/](file:///E:/Ods-8-Solution-main/scripts/)** (Utilitários)
    * 🌱 **[src/seed-jobs-courses.ts](file:///E:/Ods-8-Solution-main/scripts/src/seed-jobs-courses.ts)** (Script de carga inicial do banco de dados Node)

---

## 🗄️ Funcionamento e Sincronização dos Bancos de Dados

O banco de dados armazena as informações das empresas cadastradas, funcionários vinculados, cursos de capacitação técnica, vagas disponíveis e métricas ODS 8.

### 🔄 Fluxo no Node.js (PostgreSQL + Drizzle)
O banco de dados relacional é monitorado pelo Drizzle ORM através do arquivo de configuração **[drizzle.config.ts](file:///E:/Ods-8-Solution-main/lib/db/drizzle.config.ts)**.
1. **Modelagem:** Tabelas como a de empresas são definidas no arquivo **[companies.ts](file:///E:/Ods-8-Solution-main/lib/db/src/schema/companies.ts)**.
2. **Push de Schema:** A ferramenta CLI sincroniza o modelo local com o banco de dados em execução rodando:
   `npx pnpm --filter @workspace/db run push`
3. **Alimentação (Seeding):** O script **[seed-jobs-courses.ts](file:///E:/Ods-8-Solution-main/scripts/src/seed-jobs-courses.ts)** deleta registros anteriores de vagas e cursos e insere a carga padrão de testes.

### 💾 Fluxo no .NET (SQLite + EF Core)
1. **Modelagem:** As tabelas são modeladas como classes em C# na pasta **[Models/](file:///E:/Ods-8-Solution-main/artifacts/api-server-dotnet/Models/)**.
2. **Carga e Criação Automática:** A classe **[DbSeeder.cs](file:///E:/Ods-8-Solution-main/artifacts/api-server-dotnet/Data/DbSeeder.cs)** verifica no início da execução se o banco de dados SQLite `trabalhojusto.db` já existe. Se não existir, ela cria o arquivo físico, as tabelas correspondentes e insere as vagas e cursos de exemplo.

---

## 📈 Módulos e Lógicas de Negócio Aplicadas

### 🎯 Algoritmo de Score ODS 8
A regra de cálculo da conformidade trabalhista da empresa está implementada no backend. Ela analisa cinco pilares fundamentais definidos na ODS 8:
* **Equidade Salarial (Gênero/Carga):** Compara remunerações médias.
* **Carga Horária Adequada:** Avalia percentual de horas extras abusivas.
* **Taxa de Formalidade de Contratos:** Mede a proporção de funcionários sob regime CLT oficial.
* **Diversidade e Inclusão:** Analisa composição de gênero, faixa etária e equidade de oportunidades.
* **Capacitação:** Horas anuais investidas em treinamentos por funcionário.

O resultado consolida um Score Geral de 0 a 100 com faixas de classificação (*Excelente*, *Bom*, *Regular*, *Insuficiente* e *Crítico*) e lista recomendações práticas de conformidade trabalhista.

### 🤝 Módulo de Empregabilidade e Capacitação
Permite a aproximação de candidatos e mercado de trabalho decente através de:
1. **Banco de Vagas:** Vagas detalhadas contendo requisitos, habilidades e benefícios justos alinhados às metas ODS 8.
2. **Banco de Cursos:** Acesso a cursos profissionalizantes e de capacitação gratuitos/parceiros (SENAC, SEBRAE, SENAI).
3. **Algoritmo de Match:** Cruza habilidades do currículo do usuário com requisitos das vagas e sugere cursos adicionais para as habilidades que ainda faltam ser conquistadas.

---

## 🖥️ Cheatsheet: Comandos para Executar

Para rodar a aplicação localmente utilizando a infraestrutura baseada no Docker (para o banco de dados PostgreSQL) e Node.js, execute os comandos no terminal **CMD**:

```cmd
:: 1. Subir banco de dados em segundo plano (porta 5433)
docker run --name trabalhojusto-db -e POSTGRES_DB=trabalhojusto -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5433:5432 -d postgres

:: 2. Sincronizar o Schema de tabelas
set DATABASE_URL=postgresql://postgres:postgres@localhost:5433/trabalhojusto
npx pnpm --filter @workspace/db run push

:: 3. Rodar a carga inicial de dados (Seed)
npx pnpm --filter @workspace/scripts run seed-jobs

:: 4. Iniciar o Servidor de API (Backend)
set PORT=8080
set DATABASE_URL=postgresql://postgres:postgres@localhost:5433/trabalhojusto
npx pnpm dev:api-node

:: 5. Iniciar o Cliente React (Frontend - em um novo terminal)
cd Ods-8-Solution-main
set PORT=23781
set BASE_PATH=/
npx pnpm --filter @workspace/trabalho-justo run dev
```
