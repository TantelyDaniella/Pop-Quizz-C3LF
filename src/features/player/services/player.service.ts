import { PlayerApi } from "../api/player.api";
import { mockPlayer } from "@/features/game-engine/mocks/player.mock";
import { handleUnauthorized } from "@/app/utils/app.utils";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const api = PlayerApi();

export const PlayerService = {
  getInfo: async () => {
    if (USE_MOCK) return mockPlayer;
    try {
      const res = await api.getInfo();
      return (res as { data: typeof mockPlayer }).data;
    } catch (e) {
      if ((e as { response?: { status?: number } })?.response?.status === 401) {
        handleUnauthorized();
      }
      throw e;
    }
  },
};
