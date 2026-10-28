import { BlobNotFoundError, head, put } from "@vercel/blob";

export interface Mensagem {
  slug: string;
  nome: string;
  sobrenome: string;
  telefone: string;
  nomePresenteado: string;
  texto: string;
  arquivoUrl: string;
  arquivoTipo: string;
  criadaEm: string;
}

// Mídia e mensagens são apagadas pela rota /api/limpeza (cron diário).
export const DIAS_DE_RETENCAO = 7;
export const TAMANHO_MAXIMO_MIDIA = 15 * 1024 * 1024;
export const TIPOS_DE_MIDIA = [
  "image/jpeg", "image/png", "image/webp", "image/gif", "image/heic", "image/heif",
  "audio/webm", "audio/ogg", "audio/mpeg", "audio/mp4", "audio/x-m4a", "audio/aac", "audio/wav",
  "video/mp4", "video/webm", "video/quicktime",
];

const SLUG_VALIDO = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

const caminho = (slug: string) => `mensagens/${slug}.json`;

// Exemplo fixo, para quem visita conhecer a página do presenteado sem criar nada.
export const MENSAGEM_EXEMPLO: Mensagem = {
  slug: "exemplo",
  nome: "Ana",
  sobrenome: "Souza",
  telefone: "",
  nomePresenteado: "Maria",
  texto:
    "Feliz aniversário, Maria! 🎉\n\nQue esse ano venha cheio de risadas, viagens e café quentinho nas manhãs de domingo. Obrigada por ser abrigo nos dias difíceis e festa nos dias bons.\n\nCom todo o meu carinho,\nAna",
  arquivoUrl: "/exemplo-foto.svg",
  arquivoTipo: "image/svg+xml",
  criadaEm: "2026-10-01T12:00:00.000Z",
};

export async function salvarMensagem(dados: Omit<Mensagem, "slug" | "criadaEm">) {
  const mensagem: Mensagem = {
    ...dados,
    slug: crypto.randomUUID(),
    criadaEm: new Date().toISOString(),
  };

  await put(caminho(mensagem.slug), JSON.stringify(mensagem), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    cacheControlMaxAge: 60,
  });

  return mensagem;
}

export async function buscarMensagem(slug: string): Promise<Mensagem | null> {
  if (slug === MENSAGEM_EXEMPLO.slug) return MENSAGEM_EXEMPLO;
  if (!SLUG_VALIDO.test(slug)) return null;

  try {
    const blob = await head(caminho(slug));
    const res = await fetch(blob.url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as Mensagem;
  } catch (error) {
    if (error instanceof BlobNotFoundError) return null;
    throw error;
  }
}
