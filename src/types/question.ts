export type QuestionCategory =
  | "culture_generale"
  | "commandes_linux"
  | "programmation_shell";

export type QuestionType =
  | "multiple_choice"
  | "command_input"
  | "command_combination"
  | "command_completion"
  | "shell_programming";

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