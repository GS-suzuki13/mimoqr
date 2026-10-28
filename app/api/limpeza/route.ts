import { del, list } from "@vercel/blob";
import { DIAS_DE_RETENCAO } from "@/lib/mensagens";

// Chamada pelo cron da Vercel (vercel.json): apaga mensagens e mídias antigas.
export async function GET(request: Request) {
  const segredo = process.env.CRON_SECRET;
  if (!segredo || request.headers.get("authorization") !== `Bearer ${segredo}`) {
    return Response.json({ error: "Não autorizado." }, { status: 401 });
  }

  const limite = Date.now() - DIAS_DE_RETENCAO * 24 * 60 * 60 * 1000;
  let apagados = 0;

  for (const prefix of ["mensagens/", "midias/"]) {
    let cursor: string | undefined;
    do {
      const pagina = await list({ prefix, cursor, limit: 1000 });
      const antigos = pagina.blobs
        .filter((b) => new Date(b.uploadedAt).getTime() < limite)
        .map((b) => b.url);
      if (antigos.length) {
        await del(antigos);
        apagados += antigos.length;
      }
      cursor = pagina.hasMore ? pagina.cursor : undefined;
    } while (cursor);
  }

  return Response.json({ apagados });
}
