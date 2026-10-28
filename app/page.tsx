import Link from "next/link";
import { ArrowRight, Camera, Gift, Heart, Mic, QrCode, Smartphone, Video } from "lucide-react";
import { Logo, LogoMark } from "@/components/Logo";

const passos = [
  {
    icone: Gift,
    titulo: "A loja entrega o link",
    texto: "Junto com o pedido, o cliente recebe um link para preparar a surpresa de quem vai ganhar o presente.",
  },
  {
    icone: Heart,
    titulo: "O cliente grava o carinho",
    texto: "Texto, foto, vídeo ou um áudio gravado na hora, direto pelo celular. Sem app para instalar.",
  },
  {
    icone: QrCode,
    titulo: "O QR Code vai no cartão",
    texto: "Quem recebe aponta a câmera e abre uma página exclusiva com a mensagem.",
  },
];

const ocasioes = ["Aniversários", "Dia dos Namorados", "Confeitarias", "Floriculturas", "Cestas de café", "Datas especiais"];

export default function Home() {
  return (
    <main className="flex-1 overflow-hidden">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-6">
        <Logo />
        <Link href="/mensagem/exemplo" className="text-sm font-semibold text-mimo-600 hover:text-mimo-700">
          Ver exemplo
        </Link>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-6 sm:px-6 md:pt-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-mimo-100 px-3 py-1 text-sm font-semibold text-mimo-700">
            <Heart className="h-4 w-4" /> Presentes que falam
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Um QR Code no cartão.
            <span className="block text-mimo-500">Uma lembrança do outro lado.</span>
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-mimo-muted">
            O MimoQR transforma qualquer presente em experiência: quem compra grava uma mensagem em texto, foto,
            áudio ou vídeo, e quem recebe abre tudo apontando a câmera do celular.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/criar"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-mimo-500 px-7 py-4 font-semibold text-white shadow-lg shadow-mimo-500/25 transition hover:bg-mimo-600"
            >
              Criar mensagem <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/mensagem/exemplo"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-mimo-200 bg-white px-7 py-4 font-semibold text-mimo-700 transition hover:border-mimo-300 hover:bg-mimo-50"
            >
              Ver um exemplo
            </Link>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-mimo-muted">
            <li className="flex items-center gap-2"><Camera className="h-4 w-4 text-mimo-500" /> Foto e vídeo</li>
            <li className="flex items-center gap-2"><Mic className="h-4 w-4 text-mimo-500" /> Áudio gravado na hora</li>
            <li className="flex items-center gap-2"><Smartphone className="h-4 w-4 text-mimo-500" /> Abre em qualquer celular</li>
          </ul>
        </div>

        {/* Prévia do que o presenteado vê */}
        <div className="relative mx-auto w-full max-w-sm">
          <div className="absolute -inset-8 -z-10 rounded-full bg-gradient-to-br from-mimo-200 via-mimo-100 to-mimo-peach/40 blur-3xl" />
          <div className="rounded-[2.5rem] border-[10px] border-mimo-ink bg-white p-4 shadow-2xl">
            <div className="rounded-3xl bg-gradient-to-br from-mimo-100 via-white to-mimo-peach/30 px-5 py-6 text-center">
              <LogoMark className="mx-auto h-12 w-12" />
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-mimo-500">Para Maria</p>
              <p className="mt-2 text-xl font-extrabold leading-tight">Você recebeu um carinho especial</p>
            </div>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl bg-mimo-50 p-4 text-left text-sm leading-relaxed">
                Feliz aniversário, Maria! Que esse ano venha cheio de risadas e café quentinho aos domingos. 💜
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-mimo-line p-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-mimo-500 text-white">
                  <Mic className="h-5 w-5" />
                </span>
                <div className="flex h-8 flex-1 items-center gap-[3px]">
                  {[40, 70, 55, 90, 35, 65, 80, 45, 95, 60, 30, 75, 50, 85, 40, 65].map((h, i) => (
                    <span key={i} className="w-1 flex-1 rounded-full bg-mimo-300" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <span className="text-xs font-semibold text-mimo-muted">0:24</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-mimo-line p-3 text-sm font-medium text-mimo-muted">
                <Video className="h-5 w-5 text-mimo-500" /> Vídeo de 38 segundos
              </div>
            </div>
          </div>
          <div className="absolute -bottom-8 -right-8 hidden rotate-[6deg] rounded-2xl bg-white p-3 shadow-xl sm:block">
            <QrCode className="h-14 w-14 text-mimo-ink" />
            <p className="mt-1 text-center text-[10px] font-bold uppercase tracking-wider text-mimo-muted">Aponte a câmera</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl">Como funciona</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-mimo-muted">
            Três passos entre o pedido e o sorriso de quem recebe.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {passos.map(({ icone: Icone, titulo, texto }, i) => (
              <div key={titulo} className="rounded-3xl border border-mimo-line bg-mimo-cream p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-mimo-500 text-white">
                    <Icone className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-bold text-mimo-400">Passo {i + 1}</span>
                </div>
                <h3 className="mt-4 text-lg font-bold">{titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mimo-muted">{texto}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-2">
            {ocasioes.map((o) => (
              <span key={o} className="rounded-full border border-mimo-line bg-white px-4 py-2 text-sm font-medium text-mimo-muted">
                {o}
              </span>
            ))}
          </div>
        </div>
      </section>

      <footer className="mx-auto flex w-full max-w-6xl flex-col items-center gap-2 px-5 py-8 text-center text-sm text-mimo-muted sm:flex-row sm:justify-between sm:px-6 sm:text-left">
        <p>Projeto de demonstração: as mensagens são apagadas automaticamente após 7 dias.</p>
        <p>
          Desenvolvido por{" "}
          <a href="https://gustavosuzuki.vercel.app" className="font-semibold text-mimo-600 hover:underline">
            Gustavo Suzuki
          </a>
        </p>
      </footer>
    </main>
  );
}
