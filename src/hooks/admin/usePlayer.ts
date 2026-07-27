import { useQuery } from "@tanstack/react-query";
import { AdminPlayerApi } from "../../api/admin.player.api";
import type { PlayersResponse } from "../../types/player";

export function usePlayer() {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<PlayersResponse>({
    queryKey: ["players"],
    queryFn: () => AdminPlayerApi.list(),
  });

  return {
    players: data?.data ?? [],
    isLoading,
    error,
    refetch,
  };
}

