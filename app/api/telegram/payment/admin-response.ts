import { InlineKeyboard } from "grammy";

export const adminResponse = (email: string) =>
    new InlineKeyboard()
        .text("🔓 АН-БЛОКЛОХ", `unblock-$#${email}`)
        .text("🗑️ БЛОКЛОХ", `block-$#${email}`)
        .row()
        .text("🗓️ 30 хоног", `30days-$#${email}`)
        .text("🗓️ 60 хоног", `60days-$#${email}`)
        .text("🗓️ 90 хоног", `90days-$#${email}`)
        .row()
        .text("ℹ️ Мэдээлэл", `information-$#${email}`)
        .row();
