import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { TAMANHO_MAXIMO_MIDIA, TIPOS_DE_MIDIA } from "@/lib/mensagens";

// Gera um token de upload de curta duração: o arquivo vai direto do navegador
// para o Blob, já limitado a foto/áudio/vídeo de até 15 MB.
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const resultado = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith("midias/")) {
          throw new Error("Caminho de upload inválido.");
        }
        return {
          allowedContentTypes: TIPOS_DE_MIDIA,
          maximumSizeInBytes: TAMANHO_MAXIMO_MIDIA,
          addRandomSuffix: true,
        };
      },
      // O vínculo com a mensagem é feito em /api/mensagens; nada a fazer aqui.
      onUploadCompleted: async () => {},
    });

    return Response.json(resultado);
  } catch (error) {
    const mensagem = error instanceof Error ? error.message : "Falha no upload.";
    return Response.json({ error: mensagem }, { status: 400 });
  }
}
