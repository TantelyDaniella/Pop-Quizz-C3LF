import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Hourglass } from "lucide-react";
import { useGame } from "../hooks/useContest";
import { useContestContext } from "@/features/game-engine/context/ContestContext";
import WaitingRoom from "./WaitingRoom";
import QuestionPanel from "./QuestionPanel";
import AnswerReview from "./AnswerReview";
import IdleGamePage from "@/features/game-engine/components/IdleGamePage.tsx";

export default function GameView() {
  const navigate = useNavigate();
  const { state, submitAnswer, submitAnswerApi } = useGame();
  const { joinedContest, setJoinedContest } = useContestContext();
  const title = joinedContest?.title ?? "Partie";
  const totalQuestions = joinedContest?.totalQuestions ?? 1;

  useEffect(() => {
    if (state.phase === "ended" && joinedContest) {
      navigate(`/game-result/${joinedContest.id}`, { replace: true });
    }
  }, [state.phase, joinedContest, navigate]);

  const handleSubmitAnswer = (choiceId: number | null) => {
    if (choiceId === null) return;
    submitAnswerApi();
  };

  return (
    <div>
      {state.phase === "idle" && !joinedContest && <IdleGamePage />}
      {state.phase === "idle" && joinedContest && (
        <div className="flex flex-1 flex-col items-center justify-center min-h-80 w-full p-6 mt-35 text-center">
          <div className="relative mb-4 flex items-center justify-center p-4 rounded-2xl bg-bg-main border border-orange-500/30 text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.15)]">
            <Hourglass className="w-10 h-10 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)] animate-[spin_3s_linear_infinite]" />
          </div>
          <h2 className="text-xl font-bold uppercase tracking-wide text-slate-100 mb-1">{title}</h2>
          <p className="text-sm font-medium tracking-wide text-(--secondary-text) animate-pulse">
            Attente du commencement de la partie...
          </p>
        </div>
      )}
      {state.phase === "waiting" && <WaitingRoom title={title} />}
      {state.phase === "playing" && state.currentQuestion && (
        <QuestionPanel
          question={state.currentQuestion}
          onAnswer={submitAnswer}
          onSubmit={handleSubmitAnswer}
          questionIndex={state.questionIndex - 1}
          totalQuestions={totalQuestions}
          submitting={state.submitting}
          submitted={state.submittedQuestionId === state.currentQuestion.questionId}
        />
      )}
      {state.phase === "review" && state.currentQuestion && (
        <AnswerReview
          question={state.currentQuestion}
          correctAnswer={state.correctAnswer}
          progress={state.progress ?? { answeredCount: 0, totalParticipants: 0 }}
          selectedChoiceId={state.selectedChoiceId}
          showLeaderboard={state.showLeaderboard}
        />
      )}
    </div>
  );
}
