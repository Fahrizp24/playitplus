import { Elysia } from "elysia";
import { getWhatsAppStatus, sendWhatsAppMessage } from "./service";
import { t } from "elysia";

export const whatsappController = new Elysia({ prefix: "/api/whatsapp" })
  .get("/status", () => getWhatsAppStatus())
  .post(
    "/send",
    async ({ body, set }) => {
      try {
        await sendWhatsAppMessage(body.phone, body.message);
        return { success: true };
      } catch (err) {
        set.status = 400;
        return { success: false, error: err instanceof Error ? err.message : "Gagal mengirim WhatsApp." };
      }
    },
    { body: t.Object({ phone: t.String({ maxLength: 20 }), message: t.String({ minLength: 1, maxLength: 4000 }) }) }
  );
