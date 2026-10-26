import makeWASocket, {
  Browsers,
  DisconnectReason,
  useMultiFileAuthState,
  type WASocket,
} from "@whiskeysockets/baileys";
import qrcode from "qrcode-terminal";
import pino from "pino";

const authDir = "./whatsapp_auth";
const maxReconnectAttempts = 3;
let socket: WASocket | null = null;
let connected = false;
let qrAvailable = false;
let reconnectAttempts = 0;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

export async function startWhatsApp(): Promise<void> {
  socket?.ev.removeAllListeners("connection.update");
  socket?.end(undefined);
  const { state, saveCreds } = await useMultiFileAuthState(authDir);

  socket = makeWASocket({
    auth: state,
    browser: Browsers.ubuntu("PlayItPlus"),
    logger: pino({ level: "silent" }),
    printQRInTerminal: false,
  });

  socket.ev.on("creds.update", saveCreds);
  socket.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      qrAvailable = true;
      console.log("WhatsApp QR tersedia. Scan QR berikut dengan WhatsApp pengirim:");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "open") {
      connected = true;
      qrAvailable = false;
      reconnectAttempts = 0;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      reconnectTimer = null;
      console.log("WhatsApp Baileys terhubung.");
    }

    if (connection === "close") {
      connected = false;
      qrAvailable = false;
      const code = (lastDisconnect?.error as { output?: { statusCode?: number } })?.output?.statusCode;
      console.log(`Koneksi WhatsApp terputus (kode ${code}).`);
      if (code === DisconnectReason.loggedOut) {
        console.log("WhatsApp logout. Hapus folder whatsapp_auth untuk login ulang.");
      } else if (code === DisconnectReason.connectionReplaced) {
        console.log("Sesi dipakai instance lain. Tutup instance lain, lalu restart. Tidak reconnect.");
      } else if (reconnectAttempts < maxReconnectAttempts && !reconnectTimer) {
        reconnectAttempts += 1;
        console.log(`Mencoba reconnect ${reconnectAttempts}/${maxReconnectAttempts} dalam 3 detik.`);
        reconnectTimer = setTimeout(() => {
          reconnectTimer = null;
          void startWhatsApp();
        }, 3000);
      } else if (!reconnectTimer) {
        console.log("Batas reconnect tercapai. Restart layanan secara manual untuk mencoba lagi.");
      }
    }
  });
}

export function getWhatsAppStatus() {
  return { connected, qrAvailable };
}

export function getWhatsAppSocket(): WASocket {
  if (!socket || !connected) {
    throw new Error("WhatsApp belum terhubung.");
  }
  return socket;
}

function toWhatsAppJid(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
  if (!/^62[1-9]\d{8,12}$/.test(normalized)) {
    throw new Error("Nomor WhatsApp tidak valid. Gunakan format 08xxxxxxxxxx atau +628xxxxxxxxxx.");
  }
  return `${normalized}@s.whatsapp.net`;
}

export async function sendWhatsAppMessage(phone: string, text: string): Promise<void> {
  if (!text.trim()) throw new Error("Pesan WhatsApp tidak boleh kosong.");
  const jid = toWhatsAppJid(phone);
  const client = getWhatsAppSocket();
  const exists = await client.onWhatsApp(jid);
  if (!exists?.[0]?.exists) throw new Error("Nomor WhatsApp penerima tidak terdaftar.");
  await client.sendMessage(jid, { text });
}
