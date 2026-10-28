import { salvarMensagem } from "@/lib/mensagens";

const texto = (valor: unknown, max: number) =>
  typeof valor === "string" ? valor.trim().slice(0, max) : "";

// A mídia precisa ter vindo do nosso próprio Blob (upload assinado por /api/upload).
function midiaValida(url: string) {
  try {
    const { protocol, hostname, pathname } = new URL(url);
    return protocol === "https:" && hostname.endsWith(".public.blob.vercel-storage.com") && pathname.startsWith("/midias/");
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const corpo = await request.json().catch(() => null);
  if (!corpo || typeof corpo !== "object") {
    return Response.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const dados = {
    nome: texto(corpo.nome, 60),
    sobrenome: texto(corpo.sobrenome, 80),
    telefone: texto(corpo.telefone, 20),
    nomePresenteado: texto(corpo.nomePresenteado, 80),
    texto: texto(corpo.texto, 2000),
    arquivoUrl: texto(corpo.arquivoUrl, 500),
    arquivoTipo: texto(corpo.arquivoTipo, 100),
  };

  if (!dados.nome || !dados.sobrenome || !dados.telefone || !dados.nomePresenteado) {
    return Response.json({ error: "Preencha nome, sobrenome, telefone e nome do presenteado." }, { status: 400 });
  }
  if (!dados.texto && !dados.arquivoUrl) {
    return Response.json({ error: "Escreva uma mensagem ou envie um arquivo." }, { status: 400 });
  }
  if (dados.arquivoUrl && (!midiaValida(dados.arquivoUrl) || !/^(image|audio|video)\//.test(dados.arquivoTipo))) {
    return Response.json({ error: "Arquivo de mídia inválido." }, { status: 400 });
  }

  const mensagem = await salvarMensagem(dados);
  return Response.json({ slug: mensagem.slug }, { status: 201 });
}
