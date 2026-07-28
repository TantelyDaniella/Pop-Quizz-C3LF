import { useQuery } from "@tanstack/react-query";
import { AdminPlayerApi } from "../../api/admin.player.api";
import type { PlayersResponse } from "../../types/player";

import { useMutation, useQueryClient } from "@tanstack/react-query";

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


export function useDeletePlayer() {
  const queryClient = useQueryClient();

  const {
    mutate: deletePlayer,
    isPending,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: (playerId: number) =>
      AdminPlayerApi.remove(playerId),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["players"],
      });
    },
  });

  return {
    deletePlayer,
    isPending,
    isSuccess,
    error,
  };
}
