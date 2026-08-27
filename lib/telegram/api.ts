import "server-only";

/**
 * Lo minimo de la Bot API de Telegram: contestar y bajarse el audio.
 *
 * Sin libreria: son dos llamadas HTTP y una descarga. Un framework de bots
 * traeria polling, sesiones y un router de comandos que aca no se usan.
 */

const API = "https://api.telegram.org";

function token(): string {
  const t = process.env.TELEGRAM_BOT_TOKEN;
  if (!t) throw new Error("Falta TELEGRAM_BOT_TOKEN");
  return t;
}

/**
 * Manda un mensaje y dice si Telegram lo acepto.
 *
 * Nunca tira: quien llama decide que hacer con un false. Un mensaje que no
 * entro (bloquearon el bot, borraron el chat) tiene que poder quedar
 * marcado, no reventar la operacion que lo mando.
 */
export async function enviarMensaje(chatId: number, texto: string): Promise<boolean> {
  try {
    const r = await fetch(`${API}/bot${token()}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: texto,
        parse_mode: "HTML",
        link_preview_options: { is_disabled: true },
      }),
      signal: AbortSignal.timeout(15_000),
    });

    if (!r.ok) console.error("[telegram] sendMessage:", r.status);
    return r.ok;
  } catch (e) {
    console.error("[telegram] enviar:", e);
    return false;
  }
}

/** Acuse dentro del webhook, donde el resultado del envio no cambia nada. */
export async function responder(chatId: number, texto: string): Promise<void> {
  await enviarMensaje(chatId, texto);
}

interface RespuestaGetFile {
  ok: boolean;
  result?: { file_path?: string; file_size?: number };
  description?: string;
}

/**
 * Baja un archivo del bot. Telegram no lo manda en el update: llega un
 * file_id y hay que pedir la ruta y despues el contenido.
 *
 * Limite duro de la Bot API: 20 MB por descarga.
 */
export async function descargarArchivo(fileId: string): Promise<Buffer | null> {
  try {
    const meta = (await (
      await fetch(
        `${API}/bot${token()}/getFile?file_id=${encodeURIComponent(fileId)}`,
        { signal: AbortSignal.timeout(20_000) },
      )
    ).json()) as RespuestaGetFile;

    const ruta = meta.result?.file_path;
    if (!meta.ok || !ruta) {
      console.error("[telegram] getFile:", meta.description);
      return null;
    }

    const archivo = await fetch(`${API}/file/bot${token()}/${ruta}`, {
      signal: AbortSignal.timeout(60_000),
    });
    if (!archivo.ok) {
      console.error("[telegram] descarga:", archivo.status);
      return null;
    }

    return Buffer.from(await archivo.arrayBuffer());
  } catch (e) {
    console.error("[telegram] descargar:", e);
    return null;
  }
}

/** El texto que Telegram muestra escapado, no como HTML. */
export function escapar(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ── Forma de los updates, solo lo que se usa ──────────────────

export interface AudioTelegram {
  file_id: string;
  duration?: number;
  mime_type?: string;
  file_size?: number;
}

export interface MensajeTelegram {
  chat: { id: number };
  from?: {
    id: number;
    first_name?: string;
    last_name?: string;
    username?: string;
  };
  text?: string;
  caption?: string;
  /** Nota de voz (el microfono). */
  voice?: AudioTelegram;
  /** Archivo de audio mandado como adjunto. */
  audio?: AudioTelegram;
  /** Un audio reenviado a veces llega como documento. */
  document?: AudioTelegram & { file_name?: string };
}

export interface UpdateTelegram {
  update_id: number;
  message?: MensajeTelegram;
  edited_message?: MensajeTelegram;
}

/** El nombre para firmar la idea. Telegram no siempre manda todo. */
export function nombreDe(msg: MensajeTelegram): string {
  const from = msg.from;
  if (!from) return "Alguien por Telegram";
  const nombre = [from.first_name, from.last_name].filter(Boolean).join(" ").trim();
  if (nombre) return nombre;
  if (from.username) return `@${from.username}`;
  return `Telegram ${from.id}`;
}

/**
 * El audio del mensaje, venga como nota de voz, adjunto o documento.
 * Un documento que no es audio no cuenta: seria mandar un PDF a transcribir.
 */
export function audioDe(msg: MensajeTelegram): AudioTelegram | null {
  if (msg.voice) return msg.voice;
  if (msg.audio) return msg.audio;
  if (msg.document?.mime_type?.startsWith("audio/")) return msg.document;
  return null;
}
