# TrabalhoJusto — ODS 8 (Trabalho Decente e Crescimento Econômico)

## 📌 Contexto Acadêmico
* **Instituição:** Centro Universitário UNA  
* **Curso/Disciplina:** Interação Humano Computador e UX  
* **Professor Orientador:** Daniel Henrique Matos de Paiva  
* **Atividade:** Atividade Avaliativa Prática (A3) — Semestre Letivo 2026  

---

## 👥 Membros da Equipe
| Nome Completo | Registro Acadêmico (RA) |
| :--- | :---: |
| Caio Durães Vasconcelos | 325132875 |
| Fernando Almeida Braga | 326132695 |
| Juan Oliveira Meireles | 325226644 |
| Laura Chagas Faria | 326129970 |
| Mateus Henrique Silva Dutra | 32612590 |

---

## 🎯 Escopo do Projeto e Alinhamento ODS
O **TrabalhoJusto** é uma plataforma focada no monitoramento e promoção do **Objetivo de Desenvolvimento Sustentável 8 (ODS 8) da ONU**: *Trabalho Decente e Crescimento Econômico*.

### Principais Recursos:
1. **Painel de ODS 8**: Monitoramento de indicadores de conformidade trabalhista de empresas (equidade salarial, carga horária, diversidade, taxa de formalidade de contratos e capacitação).
2. **Cálculo de Score de Conformidade**: Algoritmo proprietário que pontua empresas baseando-se nas diretrizes ODS 8, oferecendo recomendações de melhorias.
3. **Módulo de Empregabilidade**: Cadastro de currículos de candidatos e cruzamento de vagas de trabalho decente e cursos de capacitação técnica com base em competências e habilidades.

---

## 🛠️ Arquitetura do Sistema
O projeto foi migrado e otimizado para um ambiente local de fácil execução:
* **Frontend:** React + Vite + TailwindCSS (porta padrão: `23781`)
* **Backend:** C# (.NET 10 Web API) (porta padrão: `8080` com documentação Swagger interativa)
* **Banco de Dados:** SQLite (padrão local zero-config, gerado e populado automaticamente) ou PostgreSQL (configurável via `DATABASE_URL`).

---

## 🚀 Como Executar o Projeto Localmente

### 1. Inicializar o Backend (C#)
1. Certifique-se de ter o **.NET SDK 10** instalado.
2. Abra o terminal na raiz do projeto e execute:
   ```powershell
   pnpm dev:api-dotnet
   ```
3. A API criará o banco SQLite local (`trabalhojusto.db`) e o alimentará automaticamente com vagas e cursos de teste.
4. Acesse `http://localhost:8080/swagger` para visualizar a documentação interativa da API.

### 2. Inicializar o Frontend (React)
1. Em um **novo terminal** na raiz do projeto, configure as variáveis de ambiente e execute:
   * **No PowerShell:**
     ```powershell
     $env:PORT="23781"
     $env:BASE_PATH="/"
     pnpm --filter @workspace/trabalho-justo run dev
     ```
   * **No Prompt de Comando (cmd):**
     ```cmd
     set PORT=23781
     set BASE_PATH=/
     pnpm --filter @workspace/trabalho-justo run dev
     ```
2. Acesse a aplicação em: **`http://localhost:23781`**

---

## 📅 Cronograma de Entregas (A3)
| Artefato | Prazo Final | Plataforma de Entrega |
| :--- | :---: | :---: |
| **Documento de Anteprojeto (PDF)** | 01/04/2026 | Way Hub |
| **Apresentação Executiva (PowerPoint)** | 31/05/2026 | A definir |
| **Repositório (GitHub / Figma)** | 31/05/2026 | Via Link |
| **Relatório Final e Vídeo Pitch** | 31/05/2026 | Way Hub |
| **Início das Apresentações** | 01/06/2026 | Presencial/Síncrono (10 min) |
<img width="1366" height="720" alt="Captura de tela 2026-05-21 214110" src="https://github.com/user-attachments/assets/9c1036e7-f494-4bc5-b909-a10a5b4b57e6" />
<img width="1366" height="720" alt="Captura de tela 2026-05-21 213848" src="https://github.com/user-attachments/assets/8cff5ab2-6e17-4b6a-8962-3888916554c5" />
<img width="1366" height="720" alt="Captura de tela 2026-05-21 214305" src="https://github.com/user-attachments/assets/9ad33342-9468-42aa-a70c-4c312d29da68" />
<img width="1366" height="720" alt="Captura de tela 2026-05-21 214234" src="https://github.com/user-attachments/assets/62e898ad-493d-4473-afb3-fc2458c98287" />
<img width="1366" height="720" alt="Captura de tela 2026-05-21 214205" src="https://github.com/user-attachments/assets/21c61457-1d97-46bc-b154-a71f38e6c2eb" />
<img width="1366" height="720" alt="Captura de tela 2026-05-21 214137" src="https://github.com/user-attachments/assets/26b26af9-5f59-491e-b5f2-64b1946c6c7e" />

