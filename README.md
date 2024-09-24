# TCC2024

# Exportação e Instalação do Sistema

Este documento fornece instruções para exportar e instalar um sistema com as seguintes tecnologias:
- **Backend:** Django REST
- **Frontend-web:** React
- **Frontend-mobile:** React Native (Expo)

## Estrutura do Projeto

- `backend/`: Código do backend em Django REST.
- `frontend-web/`: Código do frontend web em React.
- `frontend-mobile/`: Código do frontend mobile em React Native com Expo.

---

## Instalação e Exportação do Backend (Django REST)

### Requisitos

- Python 3.x
- Pip
- PostgreSQL (ou outro banco de dados suportado)

### Passos

1. **Baixe o Repositório**

   ```bash
   git clone https://github.com/joaoamarojs/TCC2024.git
   cd backend
   ```

2. **Crie e Ative um Ambiente Virtual**

   ```bash
   python -m venv env
   source env/bin/activate  # No Windows: env\Scripts\activate
   ```

3. **Instale as Dependências**

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure as Variáveis de Ambiente**

   Crie um arquivo `.env` na raiz do diretório `backend` e adicione as variáveis necessárias, por exemplo:

   ```env
   DB_NAME=nome_do_banco
   DB_USER=usuario
   DB_PWD=senha
   DB_HOST=localhost
   DB_PORT=5432

   SENHA_FECHA_FESTA = 'senha_para_fechar_festa'
   ```

5. **Mude o atributo `DEBUG` para `False` em `settings.py`** 

   ```bash
   DEBUG = False
   ```

6. **Execute as Migrações**

   ```bash
   python manage.py migrate
   ```

7. **Crie o usuario admin e os grupos de usuario**

   ```bash
   python manage.py create_initial_data
   ```

8. **Inicie o Servidor**

   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

   O backend estará disponível em `http://127.0.0.1:8000`.

---

## Instalação e Exportação do Frontend-web (Vite + React)

### Requisitos

- Node.js (v14 ou superior)
- npm ou yarn

### Passos

1. **Acesse a pasta do frontend web**

   ```bash
   cd frontend-web
   ```

2. **Instale as Dependências**

   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente**

   Crie um arquivo `.env` na raiz do diretório `frontend-web` e adicione as variáveis necessárias, por exemplo:

   ```env
   VITE_API_URL = "http://127.0.0.1:8000" 
   ```

4. **Inicie o Servidor de Desenvolvimento**

   ```bash
   npm run dev
   ```

   O frontend web estará disponível em `http://localhost:5173`.

5. **Para Produção**

   Para gerar a versão de produção, execute:

   ```bash
   npm run build 
   ```

   Os arquivos estáticos estarão disponíveis na pasta `dist`.

---

## Instalação e Exportação do Frontend-mobile (React Native com Expo)

### Requisitos

- Node.js (v14 ou superior)
- npm ou yarn
- Expo CLI

### Passos

1. **Acesse a pasta do frontend mobile**

   ```bash
   cd frontend-mobile
   ```

2. **Instale as Dependências**

   ```bash
   npm install  
   ```

3. **Inicie o Servidor Expo**

   ```bash
   expo start
   ```

   O frontend mobile estará disponível através do Expo Go em seu dispositivo ou no emulador.

5. **Para Produção**

   Para gerar a versão de produção, execute:

   ```bash
   expo build:android  # Para Android
   expo build:ios      # Para iOS
   ```

   Siga as instruções para configurar as credenciais e concluir o processo de build.

---

## Observações

- **Backend:** Certifique-se de que o backend está rodando antes de iniciar o frontend-web e o frontend-mobile para garantir que a API esteja acessível.
- **Frontend-web e frontend-mobile:** Ambos devem estar configurados para apontar para o endpoint da API correto no backend.

---
