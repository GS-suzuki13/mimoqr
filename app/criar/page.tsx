"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { ArrowLeft, Loader2, Mic, Square, Upload, X } from "lucide-react";
import { Logo } from "@/components/Logo";

const TAMANHO_MAXIMO = 15 * 1024 * 1024;

const inputClass =
  "mt-2 w-full rounded-2xl border border-mimo-line bg-white px-4 py-3 outline-none transition focus:border-mimo-400 focus:ring-4 focus:ring-mimo-100";

// "audio/webm;codecs=opus" -> "audio/webm"
const tipoBase = (tipo: string) => tipo.split(";")[0].trim();

const extensao = (tipo: string) =>
  ({ "audio/webm": "webm", "audio/mp4": "m4a", "audio/ogg": "ogg" })[tipoBase(tipo)] ?? "webm";

export default function CriarMensagem() {
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [nomePresenteado, setNomePresenteado] = useState("");
  const [texto, setTexto] = useState("");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [modalAberta, setModalAberta] = useState(false);
  const [gravando, setGravando] = useState(false);
  const [etapa, setEtapa] = useState<string | null>(null);
  const [erro, setErro] = useState("");

  const formatarTelefone = (value: string) => {
    let telefoneFormatado = value.replace(/\D/g, "");
    telefoneFormatado = telefoneFormatado.replace(/^(\d{2})(\d)/g, "($1) $2");
    telefoneFormatado = telefoneFormatado.replace(/(\d{5})(\d)/, "$1-$2");
    return telefoneFormatado;
  };

  const selecionarArquivo = (file: File | null) => {
    if (!file) return;

    if (file.size > TAMANHO_MAXIMO) {
      setErro("O arquivo pode ter no máximo 15 MB.");
      setModalAberta(false);
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setErro("");
    setArquivo(file);
    setPreviewUrl(URL.createObjectURL(file));
    setModalAberta(false);
  };

  const iniciarGravacao = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => chunks.push(event.data);

      recorder.onstop = () => {
        // Cada navegador grava num formato (Chrome: webm, Safari: mp4).
        const tipo = tipoBase(recorder.mimeType || "audio/webm");
        const audioBlob = new Blob(chunks, { type: tipo });
        const audioFile = new File([audioBlob], `audio-${Date.now()}.${extensao(tipo)}`, { type: tipo });

        selecionarArquivo(audioFile);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setGravando(true);
    } catch {
      setErro("Não foi possível acessar o microfone.");
    }
  };

  const pararGravacao = () => {
    mediaRecorderRef.current?.stop();
    setGravando(false);
  };

  const removerArquivo = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setArquivo(null);
    setPreviewUrl("");
  };

  const handleSubmit = async () => {
    if (!nome || !sobrenome || !telefone || !nomePresenteado) {
      setErro("Preencha nome, sobrenome, telefone e nome do presenteado.");
      return;
    }

    if (!texto && !arquivo) {
      setErro("Escreva uma mensagem ou envie um arquivo.");
      return;
    }

    setErro("");

    try {
      let arquivoUrl = "";
      let arquivoTipo = "";

      if (arquivo) {
        setEtapa("Enviando mídia...");
        const ext = arquivo.name.split(".").pop() || "bin";
        const blob = await upload(`midias/${Date.now()}.${ext}`, arquivo, {
          access: "public",
          handleUploadUrl: "/api/upload",
          contentType: tipoBase(arquivo.type),
        });
        arquivoUrl = blob.url;
        arquivoTipo = tipoBase(arquivo.type);
      }

      setEtapa("Gerando QR Code...");
      const res = await fetch("/api/mensagens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, sobrenome, telefone, nomePresenteado, texto, arquivoUrl, arquivoTipo }),
      });
      const dados = await res.json().catch(() => null);
      if (!res.ok) throw new Error(dados?.error || "Erro ao criar mensagem.");

      router.push(`/confirmar/${dados.slug}`);
    } catch (error) {
      console.error(error);
      setErro(
        error instanceof Error && error.message.includes("content type")
          ? "Formato de arquivo não suportado. Use foto, áudio ou vídeo comuns."
          : "Não foi possível criar a mensagem. Tente novamente.",
      );
      setEtapa(null);
    }
  };

  return (
    <main className="flex-1 px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto mb-6 flex max-w-3xl items-center justify-between">
        <Link href="/" aria-label="Início">
          <Logo />
        </Link>
        <Link href="/" className="flex items-center gap-1 text-sm font-semibold text-mimo-muted hover:text-mimo-ink">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
      </div>

      <section className="mx-auto max-w-3xl rounded-[2rem] border border-mimo-line bg-white p-5 shadow-sm sm:p-8 md:p-10">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Criar mensagem especial</h1>

        <p className="mt-3 text-sm text-mimo-muted sm:text-base">
          Preencha os dados e envie uma mensagem em texto, foto, áudio ou vídeo para acompanhar o presente.
        </p>

        <p className="mt-4 rounded-2xl bg-mimo-50 px-4 py-3 text-sm text-mimo-700">
          Demonstração: use dados fictícios. Mensagens e arquivos são apagados após 7 dias.
        </p>

        <form className="mt-7 space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold">Nome</label>
              <input type="text" placeholder="Ex: Ana" value={nome} onChange={(e) => setNome(e.target.value)} maxLength={60} className={inputClass} />
            </div>

            <div>
              <label className="text-sm font-semibold">Sobrenome</label>
              <input type="text" placeholder="Ex: Souza" value={sobrenome} onChange={(e) => setSobrenome(e.target.value)} maxLength={80} className={inputClass} />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold">Telefone</label>
            <input
              type="tel"
              placeholder="(__) _____-____"
              maxLength={15}
              value={telefone}
              onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Nome do presenteado</label>
            <input type="text" placeholder="Ex: Maria" value={nomePresenteado} onChange={(e) => setNomePresenteado(e.target.value)} maxLength={80} className={inputClass} />
          </div>

          <div>
            <label className="text-sm font-semibold">Mensagem em texto</label>
            <textarea
              rows={5}
              placeholder="Escreva sua mensagem especial..."
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              maxLength={2000}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Foto, áudio ou vídeo</label>

            {!arquivo ? (
              <button
                type="button"
                onClick={() => setModalAberta(true)}
                className="mt-3 flex w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-mimo-300 bg-mimo-cream px-4 py-8 text-center transition hover:border-mimo-400 hover:bg-mimo-50 sm:py-10"
              >
                <span className="grid h-12 w-12 place-items-center rounded-full bg-mimo-500 text-white shadow-md">
                  <Upload className="h-5 w-5" />
                </span>
                <p className="mt-4 text-base font-semibold sm:text-lg">Selecionar mídia</p>
                <p className="mt-1 text-sm text-mimo-muted">Foto, vídeo ou áudio gravado (até 15 MB)</p>
              </button>
            ) : (
              <div className="mt-3 rounded-3xl border border-mimo-line bg-mimo-cream p-4">
                <div className="overflow-hidden rounded-2xl bg-white">
                  {arquivo.type.startsWith("image/") && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={previewUrl} alt="Prévia do arquivo" className="h-56 w-full object-cover" />
                  )}

                  {arquivo.type.startsWith("video/") && <video src={previewUrl} controls className="h-56 w-full object-cover" />}

                  {arquivo.type.startsWith("audio/") && (
                    <div className="p-4">
                      <p className="mb-3 text-sm font-semibold">Áudio selecionado</p>
                      <audio src={previewUrl} controls className="w-full" />
                    </div>
                  )}
                </div>

                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="truncate text-sm font-medium">{arquivo.name}</p>
                  <button
                    type="button"
                    onClick={removerArquivo}
                    className="rounded-full border border-mimo-300 px-4 py-2 text-sm font-semibold text-mimo-600 hover:bg-white"
                  >
                    Remover
                  </button>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,audio/*,video/*"
              className="hidden"
              onChange={(e) => selecionarArquivo(e.target.files?.[0] || null)}
            />
          </div>

          {erro && (
            <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {erro}
            </p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={etapa !== null}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-mimo-500 px-8 py-4 font-semibold text-white shadow-lg shadow-mimo-500/25 transition hover:bg-mimo-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {etapa ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> {etapa}
              </>
            ) : (
              "Finalizar e gerar QR Code"
            )}
          </button>
        </form>
      </section>

      {modalAberta && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-mimo-ink/40 px-4 sm:items-center">
          <div className="w-full max-w-md rounded-t-3xl bg-white p-5 shadow-xl sm:rounded-3xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold">Selecionar mídia</h2>
              <button
                type="button"
                onClick={() => setModalAberta(false)}
                aria-label="Fechar"
                className="grid h-9 w-9 place-items-center rounded-full bg-mimo-50 text-mimo-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full items-center gap-3 rounded-2xl bg-mimo-50 px-5 py-4 text-left font-semibold"
              >
                <Upload className="h-5 w-5 text-mimo-500" /> Enviar foto, vídeo ou áudio
              </button>

              {!gravando ? (
                <button
                  type="button"
                  onClick={iniciarGravacao}
                  className="flex w-full items-center gap-3 rounded-2xl bg-mimo-500 px-5 py-4 font-semibold text-white"
                >
                  <Mic className="h-5 w-5" /> Gravar áudio
                </button>
              ) : (
                <button
                  type="button"
                  onClick={pararGravacao}
                  className="flex w-full items-center gap-3 rounded-2xl bg-mimo-ink px-5 py-4 font-semibold text-white"
                >
                  <Square className="h-5 w-5 animate-pulse" /> Parar gravação
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
