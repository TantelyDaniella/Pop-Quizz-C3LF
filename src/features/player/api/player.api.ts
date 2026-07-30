import createClient from "@/lib/api.client";

export const PlayerApi = () => {
  const client = createClient("player");

  return {
    getInfo: () => client.get("me"),
  };
};
