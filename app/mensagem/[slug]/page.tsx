import Image from "next/image";
import Link from "next/link";
import { Camera, Headphones, MessageCircleHeart, Video } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { buscarMensagem } from "@/lib/mensagens";

// Cada mensagem é única e pode ser criada a qualquer momento: renderiza a cada acesso.
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function MensagemPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await buscarMensagem(slug);

  if (!data) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-[2rem] border border-mimo-line bg-white p-6 text-center shadow-sm sm:p-10">
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-mimo-50 text-3xl">💌</div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">Mensagem não encontrada</h1>
          <p className="mt-3 text-sm text-mimo-muted sm:text-base">Esse link pode ter expirado ou não existe.</p>
          <Link href="/" className="mt-6 inline-block font-semibold text-mimo-600 hover:underline">
            Conhecer o MimoQR
          </Link>
        </div>
      </main>
    );
  }

  const isImage = data.arquivoTipo?.startsWith("image/");
  const isVideo = data.arquivoTipo?.startsWith("video/");
  const isAudio = data.arquivoTipo?.startsWith("audio/");
  const hasMedia = data.arquivoUrl && (isImage || isVideo || isAudio);

  return (
    <main className="flex-1 px-4 py-6 sm:px-6 sm:py-10">
      <section className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] border border-mimo-line bg-white shadow-sm">
        <div className="bg-gradient-to-br from-mimo-100 via-white to-mimo-peach/30 px-5 py-8 text-center sm:px-10 sm:py-10">
          <LogoMark className="mx-auto h-16 w-16 sm:h-20 sm:w-20" />

          <p className="mt-4 text-sm font-bold uppercase tracking-[0.25em] text-mimo-500">
            {data.nomePresenteado ? `Para ${data.nomePresenteado}` : "MimoQR"}
          </p>

          <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Você recebeu um carinho especial
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-mimo-muted sm:text-base">
            {data.nome
              ? `${data.nome} preparou essa mensagem com muito carinho para acompanhar o seu presente.`
              : "Alguém preparou essa mensagem com muito carinho para acompanhar o seu presente."}
          </p>
        </div>

        <div className="space-y-6 px-5 py-6 sm:px-10 sm:py-8">
          {data.texto && (
            <div className="rounded-3xl bg-mimo-cream p-5 sm:p-6">
              <div className="mb-3 flex items-center gap-2 text-mimo-600">
                <MessageCircleHeart className="h-5 w-5" />
                <h2 className="font-bold text-mimo-ink">Mensagem</h2>
              </div>
              <p className="whitespace-pre-line text-base leading-relaxed sm:text-lg">{data.texto}</p>
            </div>
          )}

          {hasMedia && (
            <div className="rounded-3xl border border-mimo-line bg-white p-3 shadow-sm sm:p-4">
              <div className="mb-3 flex items-center gap-2 px-1 text-mimo-600">
                {isImage ? <Camera className="h-5 w-5" /> : isVideo ? <Video className="h-5 w-5" /> : <Headphones className="h-5 w-5" />}
                <h2 className="font-bold text-mimo-ink">
                  {isImage ? "Foto enviada" : isVideo ? "Vídeo enviado" : "Áudio enviado"}
                </h2>
              </div>

              {isImage && (
                <div className="overflow-hidden rounded-3xl bg-mimo-cream">
                  <Image
                    src={data.arquivoUrl}
                    alt="Imagem enviada"
                    width={1200}
                    height={1200}
                    unoptimized={data.arquivoTipo === "image/svg+xml"}
                    className="h-auto max-h-[75vh] w-full object-contain"
                  />
                </div>
              )}

              {isVideo && (
                <div className="overflow-hidden rounded-3xl bg-black">
                  <video controls playsInline preload="metadata" className="max-h-[75vh] w-full bg-black">
                    <source src={data.arquivoUrl} type={data.arquivoTipo} />
                    Seu navegador não suporta vídeo.
                  </video>
                </div>
              )}

              {isAudio && (
                <div className="rounded-3xl bg-mimo-cream p-5 text-center sm:p-6">
                  <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-mimo-500 text-white shadow-md">
                    <Headphones className="h-7 w-7" />
                  </div>
                  <p className="mb-4 text-sm font-medium text-mimo-muted">Aperte o play para ouvir a mensagem de áudio.</p>
                  <audio controls preload="metadata" className="w-full">
                    <source src={data.arquivoUrl} type={data.arquivoTipo} />
                    Seu navegador não suporta áudio.
                  </audio>
                </div>
              )}
            </div>
          )}

          {!data.texto && !hasMedia && (
            <div className="rounded-3xl bg-mimo-cream p-6 text-center">
              <p className="text-mimo-muted">Essa mensagem não possui texto ou mídia disponível.</p>
            </div>
          )}

          <div className="border-t border-mimo-line pt-6 text-center">
            <p className="text-sm leading-relaxed text-mimo-muted">
              Criado com carinho pelo{" "}
              <Link href="/" className="font-bold text-mimo-600 hover:underline">
                MimoQR
              </Link>{" "}
              💜
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
