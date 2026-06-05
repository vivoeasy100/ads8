#!/bin/bash

# ==============================================================================
# Script de Implantação Automática - TrabalhoJusto (ODS 8)
# ==============================================================================
# Como usar na VPS Ubuntu:
# 1. git clone https://github.com/vivoeasy100/ads8.git
# 2. cd ads8
# 3. chmod +x deploy.sh
# 4. ./deploy.sh [IP_OU_DOMINIO_DA_VPS]
# ==============================================================================

# Encerrar em caso de erro
set -e

IP_PUBLICO=$1
if [ -z "$IP_PUBLICO" ]; then
    echo "⚠️  AVISO: Nenhum IP ou Domínio fornecido como argumento. Usando 'localhost' como padrão."
    IP_PUBLICO="localhost"
fi

PROJECT_PATH=$(pwd)
DB_NAME="trabalhojusto"
DB_USER="postgres"
DB_PASS="123456"
PORT_API=8080

echo "🚀 Iniciando implantação automatizada na pasta: $PROJECT_PATH"
echo "🌐 Configurando servidor Nginx para o IP/Domínio: $IP_PUBLICO"

# ------------------------------------------------------------------------------
# 1. Atualização e Instalações de Sistema
# ------------------------------------------------------------------------------
echo "📦 1. Atualizando sistema e instalando dependências base..."
sudo apt update
sudo DEBIAN_FRONTEND=noninteractive apt upgrade -y
sudo apt install -y curl git curl gnupg2 ca-certificates lsb-release

# Node.js v22 LTS (se não estiver instalado)
if ! command -v node &> /dev/null; then
    echo "🟢 Instalando Node.js v22..."
    curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "✔️  Node.js já instalado ($(node -v))"
fi

# pnpm e PM2
echo "🟢 Instalando pnpm e PM2 globalmente..."
sudo npm install -g pnpm pm2

# PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "🟢 Instalando PostgreSQL..."
    sudo apt install -y postgresql postgresql-contrib
else
    echo "✔️  PostgreSQL já instalado"
fi

# Nginx
if ! command -v nginx &> /dev/null; then
    echo "🟢 Instalando Nginx..."
    sudo apt install -y nginx
else
    echo "✔️  Nginx já instalado"
fi

# ------------------------------------------------------------------------------
# 2. Configurando PostgreSQL
# ------------------------------------------------------------------------------
echo "🗄️  2. Configurando PostgreSQL..."
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Alterar senha e criar banco
echo "🟢 Configurando usuário '$DB_USER' e criando banco '$DB_NAME'..."
sudo -i -u postgres psql -c "ALTER USER postgres PASSWORD '$DB_PASS';"
sudo -i -u postgres psql -c "DROP DATABASE IF EXISTS $DB_NAME;"
sudo -i -u postgres psql -c "CREATE DATABASE $DB_NAME;"

# ------------------------------------------------------------------------------
# 3. Instalando dependências e rodando migrações/seed
# ------------------------------------------------------------------------------
echo "📂 3. Instalando dependências do projeto com pnpm..."
pnpm install

echo "🟢 Sincronizando o banco de dados com Drizzle..."
export DATABASE_URL="postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME"
pnpm --filter @workspace/db run push

echo "🟢 Populando banco de dados (seeding)..."
pnpm --filter @workspace/scripts run seed-jobs

# ------------------------------------------------------------------------------
# 4. Compilando e Iniciando o Backend (API) com PM2
# ------------------------------------------------------------------------------
echo "⚙️  4. Compilando e iniciando API no PM2..."
pnpm --filter @workspace/api-server run build

# Parar processo existente se houver
pm2 delete trabalhojusto-api 2>/dev/null || true

# Iniciar o arquivo compilado diretamente
PORT=$PORT_API DATABASE_URL="postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME" pm2 start $PROJECT_PATH/artifacts/api-server/dist/index.mjs --name "trabalhojusto-api" --node-args="--enable-source-maps"
pm2 save

# ------------------------------------------------------------------------------
# 5. Compilando o Frontend
# ------------------------------------------------------------------------------
echo "💻 5. Compilando frontend (React + Vite)..."
PORT=23781 BASE_PATH=/ pnpm --filter @workspace/trabalho-justo run build

# ------------------------------------------------------------------------------
# 6. Configurando Nginx
# ------------------------------------------------------------------------------
echo "🌐 6. Configurando Nginx..."

# Criar a configuração do Nginx dinâmica
sudo bash -c "cat <<EOF > /etc/nginx/sites-available/trabalhojusto
server {
    listen 80;
    server_name $IP_PUBLICO;

    # Frontend (React)
    location / {
        root $PROJECT_PATH/artifacts/trabalho-justo/dist/public;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API (Proxy)
    location /api {
        proxy_pass http://localhost:$PORT_API;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF"

# Habilitar site no Nginx e reiniciar
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/trabalhojusto /etc/nginx/sites-enabled/

echo "🟢 Reiniciando Nginx..."
sudo systemctl restart nginx

# ------------------------------------------------------------------------------
# FIM
# ------------------------------------------------------------------------------
echo "🎉 IMPLANTAÇÃO CONCLUÍDA COM SUCESSO!"
echo "--------------------------------------------------------"
echo "🔗 Frontend: http://$IP_PUBLICO/"
echo "🔗 Documentação API: http://$IP_PUBLICO/api/health"
echo "--------------------------------------------------------"
echo "PM2 Status:"
pm2 status
