export type QuestionCategory =
  | "culture_generale"
  | "linux"
  | "shell";

export type QuestionType =
  | "multiple_choice"
  | "command"
  | "fill_blank"
  | "combination"
  | "shell_code";

export type QuestionDifficulty =
  | "easy"
  | "medium"
  | "hard";

export type Question = {
  questionId: number;
  statement: string;
  category: QuestionCategory;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  duration: number;
  points: number;
  explanation: string;
  createdAt: string;
};

export type QuestionResponse = {
  data: Question[];
};

export type QuestionChoice = {
  label: string;
  content: string;
  isCorrect: boolean;
};
export type CreateQuestionPayload = {
  statement: string;
  category: QuestionCategory;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  duration: number;
  points: number;
  explanation: string;
  choices: QuestionChoice[];
};