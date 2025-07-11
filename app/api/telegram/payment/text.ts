export const notifyAdminText = (email: string, activeTill: Date) => `
ℹ️ Хэрэглэгч төлбөрөө төллөө

- Хэрэглэгч:
    <b>${email}</b>

- Дуусах хугацаа:
    <b>${activeTill.toLocaleString("ru-RU")}</b>
`;

export const userInformation = ({ dbData = "", tgData = "" }) => `
<blockquote>ℹ️ Database</blockquote>
<blockquote expandable>${dbData}</blockquote>
<blockquote>ℹ️ Telegram</blockquote>
<blockquote expandable>${tgData}</blockquote>
`;
