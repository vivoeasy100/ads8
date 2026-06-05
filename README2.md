# Guia de Instalação do Sistema TrabalhoJusto (Máquina do Zero)

Este guia foi elaborado para configurar o ambiente de desenvolvimento e rodar o projeto em um computador Windows recém-formatado.

---

## ⚡ Guia Rápido de Comandos (Copie e Cole)

### 1. No PowerShell como Administrador:
```powershell
# Instalar todos os pré-requisitos (Git, Node.js LTS, .NET 10 SDK e VS Code) de uma só vez:
winget install --id Git.Git -e --source winget; winget install --id OpenJS.NodeJS.LTS -e --source winget; winget install --id Microsoft.DotNet.SDK.10 -e --source winget; winget install --id Microsoft.VisualStudioCode -e --source winget

# Habilitar execução de scripts (necessário para rodar o comando pnpm):
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine -Force
```
*(Lembre-se de reiniciar o computador após rodar as instalações do winget)*

### 2. No PowerShell comum (após reiniciar):
```powershell
# Instalar pnpm globalmente
npm install -g pnpm

# Acessar a pasta e instalar dependências do projeto
cd C:\Users\ferna\Downloads\Ods-8-Solution\Ods-8-Solution
pnpm install

# Iniciar o servidor Backend (C# + SQLite)
pnpm dev:api-dotnet
```

### 3. Em um novo terminal comum (iniciar o Frontend React):
```powershell
# Configurar ambiente e iniciar o Vite
$env:PORT="23781"; $env:BASE_PATH="/"; pnpm --filter @workspace/trabalho-justo run dev
```

---

## 🛠️ Passo 1: Instalação de Programas e Runtimes

Abra o **PowerShell** como **Administrador** (clique com o botão direito no menu iniciar -> Terminal do Windows/PowerShell (Administrador)) e execute os comandos abaixo usando o gerenciador de pacotes padrão do Windows (`winget`):

### 1. Instalar o Git (Controle de Versão)
```powershell
winget install --id Git.Git -e --source winget
```

### 2. Instalar o Node.js LTS (Runtime do Frontend)
```powershell
winget install --id OpenJS.NodeJS.LTS -e --source winget
```

### 3. Instalar o .NET 10 SDK (Runtime do Backend C#)
```powershell
winget install --id Microsoft.DotNet.SDK.10 -e --source winget
```

### 4. Instalar o Visual Studio Code (IDE Recomendada)
```powershell
winget install --id Microsoft.VisualStudioCode -e --source winget
```

> [!NOTE]  
> Após as instalações acima, **reinicie o computador** para que as variáveis de ambiente e caminhos do sistema sejam recarregados corretamente.

---

## 📦 Passo 2: Instalação do Gerenciador de Pacotes (`pnpm`)

Abra um terminal comum (PowerShell ou Prompt de Comando) e instale globalmente o `pnpm`, que é o gerenciador de dependências usado no projeto:

```powershell
npm install -g pnpm
```

---

## 📂 Passo 3: Clonar o Repositório e Instalar as Dependências

1. Navegue até a pasta onde deseja guardar o projeto (por exemplo, na pasta Downloads ou Documentos):
   ```powershell
   cd C:\Users\ferna\Downloads
   ```
2. Baixe o código (caso não o tenha localmente):
   ```powershell
   git clone <URL_DO_SEU_REPOSITORIO>
   cd Ods-8-Solution
   ```
3. Instale todas as dependências do monorepo (isso baixará as pastas `node_modules` do React e TypeScript):
   ```powershell
   pnpm install
   ```

---

## 🚀 Passo 4: Como Rodar o Sistema

Sempre precisaremos de duas janelas de terminal abertas (uma para o Backend C# e outra para o Frontend React).

### Terminal 1: Iniciar o Backend (C# + SQLite)
Na raiz do projeto (`Ods-8-Solution`):
```powershell
pnpm dev:api-dotnet
```
* **O que acontece aqui:** O projeto compilará, criará o arquivo de banco local `trabalhojusto.db` na raiz da API C# e adicionará todas as vagas e cursos de teste automaticamente. O backend ficará ativo em `http://localhost:8080`.

---

### Terminal 2: Iniciar o Frontend (React + Vite)
Abra uma **segunda** janela de terminal na raiz do projeto e defina a porta de conexão:

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

---

## 🌐 Passo 5: Acessar a Aplicação

Abra o seu navegador web favorito e acesse:
👉 **`http://localhost:23781`**

Para visualizar a documentação interativa das rotas da API em C#, acesse:
👉 **`http://localhost:8080/swagger`**

---

## ❓ Solução de Problemas Comuns

### 1. Erro de Permissão de Scripts no PowerShell
Se ao rodar os comandos do `pnpm` o PowerShell der erro dizendo que a execução de scripts está desabilitada:
1. Abra o PowerShell como Administrador.
2. Execute o comando:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine
   ```
3. Digite `S` e pressione Enter para confirmar.

### 2. Erro de DOM / Tradutor do Navegador (`removeChild` on `Node`)
Se ao abrir a página no navegador aparecer uma tela preta com o erro `Falha ao executar 'removeChild' em 'Node'`:
* Isso ocorre porque a extensão de tradução do seu navegador (como o Google Tradutor) está tentando traduzir o site automaticamente. 
* Clique no ícone de tradução ao lado da barra de endereços e selecione **"Nunca traduzir este site"**.
* Pressione **F5** para atualizar a página.
