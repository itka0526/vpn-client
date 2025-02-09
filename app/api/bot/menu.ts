import { config } from "@/lib/config";
import prisma from "@/lib/db";
import { User } from "@prisma/client";
import { MyContext } from "./types";

export const tgDomain = "@telegram.it";

export const goBackToConnectWrapper = async (ctx: MyContext) => {
    return await ctx.editMessageText(connectWrapperText, { parse_mode: "HTML" });
};

export const goBackToMain = async (ctx: MyContext) => {
    const user = await prisma.user.findUnique({ where: { email: `${ctx?.from?.id}${tgDomain}` } });
    if (!user) return await ctx.reply("❓ Хэрэглэгч олдсонгүй, дахин эхлүүлнэ үү.");
    return await ctx.editMessageText(mainText(user), { parse_mode: "HTML" });
};

export const mainText = (u: User, nu: boolean = false) => `
📋 <b>ҮНДСЭН ЦЭС</b>

🌟 Сайн уу, бро!

👤 Хэрэглэгчийн хаяг:
   - <code>${u.email}</code>

🔐 Нууц үг:
   - <span class="tg-spoiler">${u.password}</span>

ℹ️ Та вебсайт руу нэвтрэхийн тулд дээрх утгуудыг ашиглаж болно.
${nu ? "\n👤 Шинэ хэрэглэгч болгон 14 хоногийн үнэгүй эрхтэй. Хэрэв асуудал хөгжүүлэгч рүү бичээрэй. \n" : ""}
🕊️ Интернетийн хязгааргүй орчим
🇲🇳 Монгол дахь төрийн сайтууд ажилна
🎥 Зар сурталчилгаагүй Youtube, TikTok
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

⛓️‍💥 <a href="${config.website}">GalVPN вебсайт</a>
`;

export const paymentText = (email: string) => `
💳 <b>ТӨЛБӨРИЙН ЦЭС</b>

ℹ️ Хэрэв танд энэ үйлчилгээ таалагдаж байгаа бөгөөд та үүнийг үргэлжлүүлэн ашиглахыг хүсч байгаа бол сард <b>${config.paymentAmountPerMonth}</b> рубль төлнө үү.

⚠️ Гүйлгээний утга хэсэгт: <code>${email}</code>
🔢 Мөнгө хийх данс: <code>${config.accountDetails}</code> (${config.bankType})
`;

export const connectWrapperText = `
🔗 <b>ХОЛБОЛТЫН ЦЭС</b>

ℹ️ WireguardVPN-ийг тохируулахад жаахан төвөгтэй гэхдээ хамгийн сайн хурдтай нь

ℹ️ HiddifyVPN нь Монголд байгаа учраас удаан гэхдээ Youtube, Tiktok дээр сурталчилгаагүй

💡 Хэрэв танд ямар нэгэн асуудал гарвал чөлөөтэй асуугаарай.

ℹ️ Одоо байгаа түлхүүрүүдээ устгахыг хүсвэл сайт руу нэвтэрж устгана уу.

ℹ️ /start дарж нэр үг, нүүц үгээ авна уу
`;

export const connectTextHiddify = `
🔗 <b>HIDDIFY</b> - ХОЛБОЛТЫН ЦЭС

ℹ️ Танд ямар нэгэн асуудал тулгарвал WireGuard ашиглана уу

ℹ️ Түлхүүрээ үүсгэсний дараа та түлхүүрээ хуулаад iOS, Android, Windows, MacOS товчлууруудыг дарж өөрийн платформын зааврыг дагах хэрэгтэй

⚠️ Ганц түлхүүр нь зөвхөн ганц төхөөрөмжид зориулсан. Хэрэв олон төхөөрөмж нэг түлхүүр ашиглавал гацах болно.
`;

export const connectTextWireguard = `
🔗 <b>WIREGUARD</b> - ХОЛБОЛТЫН ЦЭС

ℹ️ Энэ сервер нь Европ дахь Нидерланд улсад байдаг

ℹ️ Түлхүүрээ үүсгэсний дараа та түлхүүрээ хуулаад iOS, Android, Windows, MacOS товчлууруудыг дарж өөрийн платформын зааврыг дагах хэрэгтэй

⚠️ Ганц түлхүүр нь зөвхөн ганц төхөөрөмжид зориулсан. Хэрэв олон төхөөрөмж нэг түлхүүр ашиглавал гацах болно.
`;

export const iosInstructionsTextHiddify = `
🍎📱 iOS төхөөрөмжид зориулсан заавар

1. Програм суулгах: Доорх холбоосоор орж <b>Hiddify</b> аппыг татаарай...

2. Түлхүүр авах: Hiddify холболт цэс рүү буцаж шинээр түлхүүр үүсгээрэй.

3. Түлхүүр оруулах: Үүссэн түлхүүр дээр дарж хуулж авсаны дараа татсан програмыг нээнэ үү. Дээрээс баруун талд ➕ товчийг дараад, түлхүүрийг оруулна уу.

ENJOY! Тохиргоо дууссан ✅🎉

https://apps.apple.com/us/app/hiddify-proxy-vpn/id6596777532
`;

export const androidInstructionsTextHiddify = `
🤖📱 Android төхөөрөмжид зориулсан заавар

1. Програм суулгах: Доорх холбоосоор орж <b>Hiddify</b> аппыг татаарай...

2. Түлхүүр авах: Hiddify холболт цэс рүү буцаж шинээр түлхүүр үүсгээрэй.

3. Түлхүүр оруулах: Үүссэн түлхүүр дээр дарж хуулж авсаны дараа татсан програмыг нээнэ үү. Дээрээс баруун талд ➕ товчийг дараад, түлхүүрийг оруулна уу.

ENJOY! Тохиргоо дууссан ✅🎉

https://play.google.com/store/apps/details?id=app.hiddify.com
`;

export const windowsInstructionsTextHiddify = `
🪟💻 Windows төхөөрөмжид зориулсан заавар

1. Програм суулгах: Доорх холбоосоор орж <b>v2rayN</b> аппыг татаарай...

2. Түлхүүр авах: Hiddify холболт цэс рүү буцаж шинээр түлхүүр үүсгээрэй.

3. v2rayN татах линк: https://github.com/2dust/v2rayN/releases/download/7.6.2/v2rayN-windows-64-SelfContained-With-Core.zip

4. Энэ бичлэгийг үзээрэй: https://youtu.be/5toklFHQm6o?t=111
   - Хэл солих: Баруун дээд талд ':' товчийг дараад, 'zh-Hans' дээр дарж хэлээ 'en' болгоно уу.

5. Түлхүүр оруулах: Үүссэн түлхүүр дээр дарж хуулж авсаны дараа v2rayN програмыг нээнэ үү. Дээрээс зүүн талд байгаа 'Servers' товчийг дараад, 'Import bulk URL from clipboard' дээр дарж түлхүүрийг оруулна уу.

ENJOY! Тохиргоо дууссан ✅🎉

`;

export const macosInstructionsTextHiddify = `
🍏💻 MacOS төхөөрөмжид зориулсан заавар

1. Програм суулгах: Доорх холбоосоор орж <b>Hiddify</b> аппыг татаарай...

2. Түлхүүр авах: Hiddify холболт цэс рүү буцаж шинээр түлхүүр үүсгээрэй.

3. Түлхүүр оруулах: Үүссэн түлхүүр дээр дарж хуулж авсаны дараа татсан програмыг нээнэ үү. Дээрээс баруун талд ➕ товчийг дараад, түлхүүрийг оруулна уу.

ENJOY! Тохиргоо дууссан ✅🎉

https://apps.apple.com/us/app/hiddify-proxy-vpn/id6596777532
`;

export const mobileInstructionsTextWireguard = `
🍎📱 iOS/ 🤖📱 Android төхөөрөмжид зориулсан заавар

1. Татах: Доорх холбоосоор орж <b>Wireguard</b> аппыг татаарай...

2. Түлхүүр үүсгэх: Телеграм ботны "Wireguard холболт цэс" рүү буцаж шинээр түлхүүр үүсгээрэй.

3. Түлхүүр оруулах: Үүссэн QR кодыг WireGuard аппнаасаа уншуулна уу.

4. Дурын нэр өгнө үү...

ℹ️ Сайт руу нэвтрэхийн тулд /start дарж нэр үг, нүүц үгээ авна уу

ℹ️ Дэлгэрэнгүй: ${config.website}/instructions/wireguard#article-5

⛓️ Татах холбоос: https://www.wireguard.com/install/
`;

export const desktopInstructionsTextWireguard = `
🪟💻 Windows / 🍏💻 MacOS төхөөрөмжид зориулсан заавар

1. Татах: Доорх холбоосоор орж <b>Wireguard</b> аппыг татаарай...

2. Түлхүүр үүсгэх: Телеграм ботны "Wireguard холболт цэс" рүү буцаж шинээр түлхүүр үүсгээрэй.

3. Түлхүүр оруулах: Үүссэн .conf файлыг WireGuard апп руугаа татаж оруулна уу эсвэл хуулж тавина уу.

4. Дурын нэр өгнө үү...

ℹ️ Сайт руу нэвтрэхийн тулд /start дарж нэр үг, нүүц үгээ авна уу

ℹ️ Дэлгэрэнгүй: ${config.website}/instructions/wireguard#article-4

⛓️ Татах холбоос: https://www.wireguard.com/install/
`;

export const wireguarConfigText = `
⚙️ <b>ТОХИРГОО</b>

🟩 QR код уншуулах нь хамгийн хялбар арга.
   WireGuard аппаа нээгээд "QR Scan" дээр дарж QR кодыг уншуулна уу.

🟨 Wireguard програмыг нээгээд "Import from file" дээр дарж татсан файл аа оруулна уу.

🟥 Энэ зааврыг дагана уу... ${config.website}/instructions/wireguard#article-4

ℹ️ Хүссэн нэрээ өгөөрөй...

`;

export const reportIssueText = (user: string, message: string) => `
- From: <b>${user}</b>

- Message: ${message}
`;

export const iPaidMessage = (user: string, message: string) => `
- <b>${user}</b>

- ${message}
`;

export const askText = `📍 Та бот руу шууд хүсэлтээ бичнэ үү. \n 🖌️ Эсвэл лавлах зүйл байвал над руу бичнэ үү.\n${config.telegram}`;

export const usersList = (users: Partial<User>[]) => `
${users.map((u) => `${u.email}` + "\n")}
`;
