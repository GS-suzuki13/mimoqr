"use client";

import QRCode from "qrcode";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { Download, ExternalLink, Share2 } from "lucide-react";
import { Logo } from "@/components/Logo";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ConfirmarPage({ params }: PageProps) {
  const { slug } = use(params);

  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [linkMensagem, setLinkMensagem] = useState("");
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    async function gerarQRCode() {
      const url = `${window.location.origin}/mensagem/${slug}`;
      setLinkMensagem(url);

      const qr = await QRCode.toDataURL(url, {
        width: 400,
        margin: 2,
        color: { dark: "#1e1442", light: "#ffffff" },
      });

      setQrCodeUrl(qr);
    }

    gerarQRCode();
  }, [slug]);

  const compartilhar = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Mensagem especial",
        text: "Acesse sua mensagem especial 💜",
        url: linkMensagem,
      });
    } else {
      await navigator.clipboard.writeText(linkMensagem);
      setCopiado(true);
    }
  };

  return (
    <main className="flex-1 px-4 py-6 sm:px-6 md:py-10">
      <div className="mx-auto mb-6 max-w-4xl">
        <Link href="/" aria-label="Início">
          <Logo />
        </Link>
      </div>

      <section className="mx-auto max-w-4xl rounded-[2rem] border border-mimo-line bg-white p-5 shadow-sm sm:p-6 md:p-10">
        <h1 className="text-center text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
          Mensagem criada com sucesso 💜
        </h1>

        <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-mimo-muted sm:text-base">
          Baixe o QR Code para imprimir no cartão do presente ou compartilhe o link. Teste agora: aponte a câmera
          do celular para o código abaixo.
        </p>

        <div className="mt-8 grid gap-5 md:mt-10 md:grid-cols-2 md:gap-8">
          <div className="rounded-3xl bg-mimo-cream p-5 text-center sm:p-6">
            <h2 className="text-lg font-bold sm:text-xl">QR Code do presente</h2>

            {qrCodeUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrCodeUrl}
                alt="QR Code da mensagem"
                className="mx-auto mt-5 w-full max-w-[260px] rounded-2xl bg-white p-3 shadow-sm sm:max-w-xs sm:p-4"
              />
            )}

            <a
              href={qrCodeUrl}
              download={`qrcode-${slug}.png`}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-mimo-500 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-mimo-600 sm:w-auto"
            >
              <Download className="h-5 w-5" /> Baixar QR Code
            </a>
          </div>

          <div className="flex flex-col justify-center rounded-3xl border border-mimo-line p-5 sm:p-6">
            <h2 className="text-lg font-bold sm:text-xl">Link da mensagem</h2>

            <div className="mt-3 rounded-2xl bg-mimo-cream p-3">
              <p className="break-all text-xs leading-relaxed text-mimo-muted sm:text-sm">{linkMensagem}</p>
            </div>

            <button
              type="button"
              onClick={compartilhar}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-mimo-500 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-mimo-600"
            >
              <Share2 className="h-5 w-5" /> {copiado ? "Link copiado!" : "Compartilhar link"}
            </button>

            <Link
              href={`/mensagem/${slug}`}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-mimo-300 px-6 py-3 font-semibold text-mimo-600 transition hover:bg-mimo-50"
            >
              <ExternalLink className="h-5 w-5" /> Visualizar página
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
