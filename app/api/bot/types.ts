import { Key } from "@prisma/client";
import { Context, SessionFlavor } from "grammy";

type MinKey = {
    id: Key["id"];
    type: Key["type"];
    keyPath: Key["keyPath"];
};

interface SessionData {
    keys: Array<MinKey>;
    wireguardLastKeyId: MinKey["id"];
    wgLastMsgId: number | undefined;
}

type MyContext = Context & SessionFlavor<SessionData>;

type DataType = {
    firstName?: string | null;
    lastName?: string | null;
    username?: string | null;
    phone?: string | null;
    about?: string | null;
    birthday?: string | null;
    hasPhoto?: boolean;
};

export { type MyContext, type SessionData, type MinKey, type DataType };
