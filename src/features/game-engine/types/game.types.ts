export type Choice = {
  choiceId: number;
  label: string;
  content: string;
};

export type Question = {
  contestQuestionId: number;
  gameId: number;
  questionId: number;
  roundNumber: number;
  orderIndex: number;
  status: string;
  openedAt: string;
  closedAt: string | null;
  statement: string;
  category: string;
  correctAnswer: string;
  duration: number;
  explanation: string;
  points: number;
  type: string;
  choices: Choice[];
};

export type GameInfo = {
  id: number;
  title: string;
  status: string;
};

export type QuestionProgress = {
  answeredCount: number;
  totalParticipants: number;
};

export type LeaderboardEntry = {
  gameId: number;
  playerId: number;
  username: string;
  avatarUrl: string;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  firstBloodCount: number;
  avgResponseTime: number;
  rank: number;
};

export type GamePhase = "idle" | "waiting" | "playing" | "review" | "ended";

export type GameState = {
  phase: GamePhase;
  game: GameInfo | null;
  currentQuestion: Question | null;
  questionIndex: number;
  contestQuestionId: number | null;
  correctAnswer: string | null;
  progress: QuestionProgress | null;
  score: number;
  selectedChoiceId: number | null;
  submittedQuestionId: number | null;
  submitting: boolean;
};
