import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { usePlayer } from "@/features/player/hooks/usePlayer";
import { LogOut } from "lucide-react";
import {useState} from "react";
import ConfirmDialog from "@/components/common/ConfirmDialog.tsx";
import {useLogout} from "@/features/auth/hooks/useAuth.ts";

export default function UserPopover() {
  const [confirm, setConfirm] = useState(false);
  const { player } = usePlayer();
  const { logout } = useLogout()

  return (
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer border py-1 px-2 rounded-lg">
            <div className="w-9 h-9 rounded-full bg-(--input-bg) border border-(--border-color) overflow-hidden">
              {player?.avatarUrl && <img src={player.avatarUrl} alt="avatar" className="w-full h-full" />}
            </div>
            <span className="text-md font-bold">{player?.username ?? "player..."}</span>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-3 flex flex-col gap-3" onOpenAutoFocus={(e) => e.preventDefault()}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-(--border-color)">
              {player?.avatarUrl && <img src={player.avatarUrl} alt="avatar" className="w-full h-full" />}
            </div>
            <div>
              <p className="text-sm font-medium">{player?.username}</p>
              <p className="text-xs text-(--secondary-text)">{player?.email}</p>
            </div>
          </div>
          <button onClick={() => setConfirm(true)} className="btn-outline flex items-center gap-2 py-1.5 text-sm text-red-500 border-red-500/30 hover:bg-red-500/10 w-full">
            <LogOut className="w-4 h-4" /> Se déconnecter
          </button>
          <ConfirmDialog
              open={confirm}
              onOpenChange={setConfirm}
              icon={LogOut}
              title="Déconnexion"
              message="Voulez-vous vraiment vous déconnecter ?"
              onConfirm={logout}
          />
        </PopoverContent>
      </Popover>
  );
}