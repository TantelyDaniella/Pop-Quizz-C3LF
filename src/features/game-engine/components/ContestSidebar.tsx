import { Inbox } from "lucide-react";
import { useJoinContest } from "@/features/game-engine/hooks/useContest";
import { useContestContext } from "@/features/game-engine/context/ContestContext";
import ContestCard from "./ContestCard";
import EmptyState from "@/components/common/EmptyState";
import { getPlayerIdFromToken } from "@/app/utils/app.utils";
import type { Contest } from "@/features/game-engine/hooks/useContest";

type Props = { contests: Contest[] };

export default function ContestSidebar({ contests }: Props) {
  const { join } = useJoinContest();
  const { joinedContest, setJoinedContest } = useContestContext();
  const playerId = getPlayerIdFromToken();

  if (!contests.length)
    return <EmptyState icon={Inbox} text="Aucune partie disponible" height="h-40" />;

  return (
      <div className="flex flex-col gap-3">
        {contests.map(contest => (
            <ContestCard
                key={contest.gameId}
                contest={contest}
                isJoined={joinedContest?.id === contest.gameId}
                hasJoinedAny={!!joinedContest}
                onJoin={() => join(
                    { gameId: contest.gameId, playerId: playerId ?? 0 },
                    { onSuccess: () => setJoinedContest({ id: contest.gameId, title: contest.title, totalQuestions: contest.totalQuestions }) }
                )}
            />
        ))}
      </div>
  );
}