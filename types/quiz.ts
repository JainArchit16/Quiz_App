export type Difficulty = 'easy' | 'medium' | 'hard' | 'mix';

export interface QuizQuestion {
  id: number;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  all_answers: string[];
  category: string;
  difficulty: string;
  type: string;
}

export interface QuestionState {
  visited: boolean;
  answered: boolean;
  selectedAnswer: string | null;
}

export interface QuizState {
  email: string;
  questions: QuizQuestion[];
  questionStates: QuestionState[];
  currentQuestionIndex: number;
  timeRemaining: number;
  isCompleted: boolean;
  startTime: number | null;
  difficulty: Difficulty;
}

export interface QuizResult {
  question: QuizQuestion;
  selectedAnswer: string | null;
  isCorrect: boolean;
}

export interface SavedQuizProgress {
  email: string;
  questions: QuizQuestion[];
  questionStates: QuestionState[];
  currentQuestionIndex: number;
  timeRemaining: number;
  startTime: number | null;
  difficulty: Difficulty;
  savedAt: number;
}
