import { config } from "@/lib/config";
import prisma from "@/lib/db";
import { User } from "@prisma/client";
import { MyContext } from "./types";

export const tgDomain = "@telegram.it";

export const goBackToMain = async (ctx: MyContext) => {
    const user = await prisma.user.findUnique({ where: { email: `${ctx?.from?.id}${tgDomain}` } });
    if (!user) return await ctx.reply("❓ Хэрэглэгч олдсонгүй, дахин эхлүүлнэ үү.");
    return await ctx.editMessageText(mainText(user), { parse_mode: "HTML" });
};

export const mainText = (u: User, nu: boolean = false) => `
📋 ҮНДСЭН ЦЭС

🌟 Сайн уу, ${u.email}!

ℹ️ Энэ үйлчилгээ нь таны интернет траффикийг үл мэдэгдэх болгох боломжийг олгодог. Хэрэв та хөгжүүлэгчтэй холбогдохыг хүсвэл: @itka0526
${nu ? "\n👤 Шинэ хэрэглэгч болгон 14 хоногийн үнэгүй эрхтэй. Хэрэв асуудал хөгжүүлэгч рүү бичээрэй. \n" : ""}
🕊️ Интернетийн хязгааргүй орчим
🌐 Хурдан интернет
🛠️ Тохируулахад хялбар
💻 Бүх төхөөрөмжийг дэмждэг

<b>${
    u.banned
        ? "🚫 Дансны төлөв блоклогдсон"
        : new Date() > u.activeTill
        ? "💵 Дансны төлөв хүчингүй [төлбөр төлөх]"
        : `✅ Дансны төлөв хүчинтэй [${u.activeTill.toISOString().split("T")[0]}]`
}</b>
`;

export const paymentText = (email: string) => `
💳 ТӨЛБӨРИЙН ЦЭС

ℹ️ Хэрэв танд энэ үйлчилгээ таалагдаж байгаа бөгөөд та үүнийг үргэлжлүүлэн ашиглахыг хүсч байгаа бол сард <b>${config.paymentAmountPerMonth}</b> рубль төлнө үү.

⚠️ Гүйлгээний утга хэсэгт: <code>${email}</code>
🔢 Мөнгө хийх данс: <code>${config.accountDetails}</code> (${config.bankType})
`;

export const connectText = `
🔗 ХОЛБОЛТЫН ЦЭС

ℹ️ Түлхүүрээ үүсгэсний дараа та түлхүүрээ хуулаад iOS, Android, Windows, MacOS товчлууруудыг дарж өөрийн платформын зааврыг дагах хэрэгтэй

⚠️ Ганц түлхүүр нь зөвхөн ганц төхөөрөмжид зориулсан. Хэрэв олон төхөөрөмж нэг түлхүүр ашиглавал гацах болно.
`;

export const iosInstructionsText = `
🍎📱 iOS төхөөрөмжид зориулсан заавар

1. Програм суулгах: Доорх холбоосоор орж <b>Hiddify</b> аппыг татаарай...

2. Түлхүүр авах: Холболт цэс рүү буцаж шинээр түлхүүр үүсгээрэй.

3. Түлхүүр оруулах: Үүссэн түлхүүр дээр дарж хуулж авсаны дараа татсан програмыг нээнэ үү. Дээрээс баруун талд ➕ товчийг дараад, түлхүүрийг оруулна уу.

ENJOY! Тохиргоо дууссан ✅🎉

https://apps.apple.com/us/app/hiddify-proxy-vpn/id6596777532
`;

export const androidInstructionsText = `
🤖📱 Android төхөөрөмжид зориулсан заавар

1. Програм суулгах: Доорх холбоосоор орж <b>Hiddify</b> аппыг татаарай...

2. Түлхүүр авах: Холболт цэс рүү буцаж шинээр түлхүүр үүсгээрэй.

3. Түлхүүр оруулах: Үүссэн түлхүүр дээр дарж хуулж авсаны дараа татсан програмыг нээнэ үү. Дээрээс баруун талд ➕ товчийг дараад, түлхүүрийг оруулна уу.

ENJOY! Тохиргоо дууссан ✅🎉

https://play.google.com/store/apps/details?id=app.hiddify.com
`;

export const windowsInstructionsText = `
🪟💻 Windows төхөөрөмжид зориулсан заавар

1. Програм суулгах: Доорх холбоосоор орж <b>Hiddify</b> аппыг татаарай...

2. Түлхүүр авах: Холболт цэс рүү буцаж шинээр түлхүүр үүсгээрэй.

3. Түлхүүр оруулах: Үүссэн түлхүүр дээр дарж хуулж авсаны дараа татсан програмыг нээнэ үү. Дээрээс баруун талд ➕ товчийг дараад, түлхүүрийг оруулна уу.

ENJOY! Тохиргоо дууссан ✅🎉

https://github.com/hiddify/hiddify-app/releases/latest/download/Hiddify-Windows-Setup-x64.Msix
`;

export const macosInstructionsText = `
🍏💻 MacOS төхөөрөмжид зориулсан заавар

1. Програм суулгах: Доорх холбоосоор орж <b>Hiddify</b> аппыг татаарай...

2. Түлхүүр авах: Холболт цэс рүү буцаж шинээр түлхүүр үүсгээрэй.

3. Түлхүүр оруулах: Үүссэн түлхүүр дээр дарж хуулж авсаны дараа татсан програмыг нээнэ үү. Дээрээс баруун талд ➕ товчийг дараад, түлхүүрийг оруулна уу.

ENJOY! Тохиргоо дууссан ✅🎉

https://apps.apple.com/us/app/hiddify-proxy-vpn/id6596777532
`;
