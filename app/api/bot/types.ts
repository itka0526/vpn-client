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
}

type MyContext = Context & SessionFlavor<SessionData>;

export { type MyContext, type SessionData, type MinKey };
