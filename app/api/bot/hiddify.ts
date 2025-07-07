export type HiddifyKeyResponseType = {
    added_by_uuid: string;
    comment: null | string;
    current_usage_GB: number;
    ed25519_private_key: string;
    ed25519_public_key: string;
    enable: boolean;
    id: number;
    is_active: boolean;
    lang: string;
    last_online: null | string;
    last_reset_time: null | string;
    mode: string;
    name: string;
    package_days: number;
    start_date: null | string;
    telegram_id: number | null;
    usage_limit_GB: number;
    uuid: string;
    wg_pk: string;
    wg_psk: string;
    wg_pub: string;
};

const getHiddifyUrls = () => {
    const baseUrl = process.env.HIDDIFY_API_BASE_URL;
    const adminPath = process.env.HIDDIFY_PROXY_PATH;
    const userPath = process.env.HIDDIFY_USER_PROXY_PATH;
    if (!baseUrl || !adminPath || !userPath) {
        throw new Error("Could not get configuration from .env");
    }
    const HIDDIFY_BASE_URL = new URL(baseUrl);
    const HIDDIFY_API_ADMIN_BASE_URL = new URL(adminPath, baseUrl);
    const HIDDIFY_API_USER_BASE_URL = new URL(userPath, baseUrl);
    return {
        HIDDIFY_BASE_URL,
        HIDDIFY_API_ADMIN_BASE_URL,
        HIDDIFY_API_USER_BASE_URL,
    };
};

async function createHiddifyKey(telegramId: number, name: string) {
    const url = new URL(HIDDIFY_API_ADMIN_BASE_URL + "/api/v2/admin/user/");
    const body = {
        added_by_uuid: `${process.env.HIDDIFY_API_KEY}`,
        comment: null,
        current_usage_GB: 0,
        enable: true,
        is_active: true,
        lang: null,
        last_online: null,
        last_reset_time: null,
        mode: "monthly",
        name: name,
        package_days: 365 * 10,
        start_date: new Date().toISOString().split("T")[0],
        telegram_id: telegramId,
        usage_limit_GB: null,
        uuid: null,
        wg_pk: "string",
        wg_psk: "string",
        wg_pub: "string",
    };

    const options: RequestInit = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Hiddify-API-Key": process.env.HIDDIFY_API_KEY,
        } as HeadersInit,
        body: JSON.stringify(body),
    };

    try {
        const response = await fetch(url.toString(), options);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Hiddify API Error: ${response.status} ${errorText}`);
        }
        const data: HiddifyKeyResponseType = await response.json();
        return data;
    } catch (error) {
        console.error("Error creating Hiddify user:", error);
        throw error;
    }
}

async function getHiddifyKeyDetails(uuid: string) {
    const url = new URL(HIDDIFY_API_ADMIN_BASE_URL + `/api/v2/admin/user/${uuid}/`);

    const options = {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Hiddify-API-Key": process.env.HIDDIFY_API_KEY,
        } as HeadersInit,
    };

    try {
        const response = await fetch(url.toString(), options);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Hiddify API Error: ${response.status} ${errorText}`);
        }
        const data: HiddifyKeyResponseType = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching Hiddify user details:", error);
        throw error;
    }
}

async function removeHiddifyKeyDetails(uuid: string) {
    const url = new URL(HIDDIFY_API_ADMIN_BASE_URL + `/api/v2/admin/user/${uuid}/`);

    const options = {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Hiddify-API-Key": process.env.HIDDIFY_API_KEY,
        } as HeadersInit,
    };

    try {
        const response = await fetch(url.toString(), options);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Hiddify API Error: ${response.status} ${errorText}`);
        }
        const data: HiddifyKeyResponseType = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching Hiddify user details:", error);
        throw error;
    }
}

async function deactivateHiddifyKeyDetails(uuid: string) {
    const url = new URL(HIDDIFY_API_ADMIN_BASE_URL + `/api/v2/admin/user/${uuid}/`);

    const options = {
        method: "PATCH",
        headers: {
            Accept: "application/json",
            "Hiddify-API-Key": process.env.HIDDIFY_API_KEY,
        } as HeadersInit,
    };

    try {
        const response = await fetch(url.toString(), options);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Hiddify API Error: ${response.status} ${errorText}`);
        }
        const data: HiddifyKeyResponseType = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching Hiddify user details:", error);
        throw error;
    }
}

const { HIDDIFY_API_ADMIN_BASE_URL, HIDDIFY_API_USER_BASE_URL, HIDDIFY_BASE_URL } = getHiddifyUrls();
export { createHiddifyKey, getHiddifyKeyDetails, removeHiddifyKeyDetails, HIDDIFY_API_ADMIN_BASE_URL, HIDDIFY_API_USER_BASE_URL, HIDDIFY_BASE_URL };
