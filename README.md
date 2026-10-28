# MimoQR — mensagens surpresa por QR Code

Quem compra um presente grava uma mensagem em **texto, foto, áudio ou vídeo**.
Quem recebe abre tudo apontando a câmera do celular para o **QR Code** impresso
no cartão. Não precisa instalar app.

> Projeto de portfólio. A demonstração apaga mensagens e arquivos após 7 dias.

## Como funciona

1. **/criar**: o formulário coleta os dados e a mensagem. O áudio pode ser
   gravado no próprio navegador (MediaRecorder).
2. A mídia vai **direto do navegador para o Vercel Blob**, com um token de
   upload de curta duração gerado em `/api/upload`. O token limita o tipo do
   arquivo (foto, áudio ou vídeo) e o tamanho (15 MB).
3. `/api/mensagens` valida os campos, confere que a mídia veio do próprio Blob
   e grava a mensagem com um identificador aleatório (UUID).
4. **/confirmar/[slug]** gera o QR Code (lib `qrcode`) para baixar ou
   compartilhar.
5. **/mensagem/[slug]**: página renderizada no servidor que o presenteado abre.
6. Um **cron diário** (`/api/limpeza`, protegido por `CRON_SECRET`) apaga
   mensagens e mídias com mais de 7 dias.

Para ver o exemplo pronto, abra `/mensagem/exemplo`.

## Tecnologias

Next.js 16 (App Router, Route Handlers), React 19, TypeScript, Tailwind CSS 4,
Vercel Blob, Vercel Cron, `qrcode` e MediaRecorder API.

## Rodar localmente

```bash
npm install
# BLOB_READ_WRITE_TOKEN: token de um Blob store da Vercel
echo "BLOB_READ_WRITE_TOKEN=..." > .env.local
npm run dev
```

## Autor

Desenvolvido por **Gustavo Suzuki**:
[portfólio](https://gustavosuzuki.vercel.app) ·
[LinkedIn](https://www.linkedin.com/in/gustavo-suzuki-858189163/) ·
[GitHub](https://github.com/GS-suzuki13)
