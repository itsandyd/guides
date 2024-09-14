import { wow } from "blizzard.js";

let blizzardClient: ReturnType<typeof wow.createInstance> | null = null;

export const getBlizzardClient = async () => {
    console.log('Client ID:', process.env.NEXT_PUBLIC_BLIZZARD_CLIENT_ID);
    console.log('Client Secret:', process.env.NEXT_PUBLIC_BLIZZARD_CLIENT_SECRET);

    if (!blizzardClient) {
        try {
            blizzardClient = wow.createInstance({
                key: "83b3b1f946844460ac8894fc5041473c",
                secret: "jkKnfkUYnInH0UTft86EwVt1lAgz1mHE",
                origin: "us",
                locale: "en_US",
            });
        } catch (error) {
            console.error("Failed to create Blizzard client:", error);
            throw error;
        }
    }
    return blizzardClient;
};

