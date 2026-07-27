import { useQuery } from "@tanstack/react-query";
import { AdminPlayerApi } from "../../api/admin.player.api";
import type { Player } from "../../types/player";

export function useQuestion() {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<Player[]>({
    queryKey: ["players"],
    queryFn: () => AdminPlayerApi.list(),
  });

  return {
    players: data ?? [],
    isLoading,
    error,
    refetch,
  };
}