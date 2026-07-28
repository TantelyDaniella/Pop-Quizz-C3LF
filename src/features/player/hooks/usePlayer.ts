import { useQuery } from "@tanstack/react-query";
import { PlayerService } from "../services/player.service";
import type { Player } from "../types/player.types";

export function usePlayer() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["player"],
    queryFn: PlayerService.getInfo,
  });

  return { player: (data as Player | undefined) ?? null, isLoading, isError };
}
