import { Pencil, Trash2 } from "lucide-react";
import { usePlayer } from "../../hooks/admin/usePlayer";

export default function PlayerList() {
  const {
    players,
    isLoading,
    error,
  } = usePlayer();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <p className="text-sm text-gray-500">
          Chargement des joueurs...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-600">
          Une erreur est survenue lors du chargement des joueurs.
        </p>
      </div>
    );
  }

  const handleEdit = (playerId: number) => {
    console.log("Modifier le joueur :", playerId);
  };

  const handleDelete = (playerId: number) => {
    console.log("Supprimer le joueur :", playerId);
  };

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
        <table className="w-full">
          {/* Header */}
          <thead className="bg-slate-800">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Joueur
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Email
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Date d'inscription
              </th>

              <th className="px-6 py-4 text-right text-sm font-semibold text-white">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-700">
            {players.length > 0 ? (
              players.map((player) => (
                <tr
                  key={player.playerId}
                  className="transition-colors hover:bg-slate-800"
                >
                  {/* Joueur */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={player.avatarUrl}
                        alt={`Avatar de ${player.username}`}
                        className="h-10 w-10 rounded-full border border-slate-600 object-cover"
                      />

                      <div>
                        <p className="font-medium text-white">
                          {player.username}
                        </p>

                        <p className="text-xs text-slate-400">
                          #ID-{player.playerId}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 text-sm text-slate-300">
                    {player.email}
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-sm text-slate-300">
                    {new Date(player.createdAt).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      {/* Modifier */}
                      <button
                        type="button"
                        onClick={() => handleEdit(player.playerId)}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                      >
                        <Pencil size={16} />
                        Modifier
                      </button>

                      {/* Supprimer */}
                      <button
                        type="button"
                        onClick={() => handleDelete(player.playerId)}
                        className="flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                      >
                        <Trash2 size={16} />
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-10 text-center text-sm text-slate-400"
                >
                  Aucun joueur trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}