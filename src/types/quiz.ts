export type QuizStatus = "waiting" | "running" | "finished";

export interface Quiz {
  gameId: number;
  title: string;
  status: QuizStatus;
  createdBy: number | null;
  totalQuestions: number;
  startTime: string | null;
  endTime: string | null;
  createdAt: string;
}

export type QuizResponse = {
  data: Quiz[];
};

export type CreateQuizPayload = {
    title: string;
    totalQuestions: number;
    createdBy: number;
}

export type UpdateQuizPayload = {
  title: string;
  totalQuestions: number;
};