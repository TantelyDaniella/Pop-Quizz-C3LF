import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminPlayerService } from "../services/admin.player.service";
import type { PlayersResponse } from "../types/player";

export function usePlayer() {
  const { data, isLoading, error, refetch } = useQuery<PlayersResponse>({
    queryKey: ["players"],
    queryFn: () => AdminPlayerService.list() as Promise<PlayersResponse>,
  });

  return { players: data?.data ?? [], isLoading, error, refetch };
}

export function useDeletePlayer() {
  const queryClient = useQueryClient();

  const { mutate: deletePlayer, isPending } = useMutation({
    mutationFn: (playerId: number) => AdminPlayerService.remove(playerId),
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ["players"] }); },
  });

  return { deletePlayer, isPending };
}
