"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  QuizState,
  QuizQuestion,
  QuestionState,
  Difficulty,
  SavedQuizProgress,
} from "@/types/quiz";

const STORAGE_KEY = "quiz_progress";

interface QuizContextType {
  state: QuizState;
  setEmail: (email: string) => void;
  setQuestions: (questions: QuizQuestion[]) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  navigateToQuestion: (index: number) => void;
  selectAnswer: (answer: string) => void;
  submitQuiz: () => void;
  resetQuiz: () => void;
  startTimer: () => void;
  hasSavedProgress: () => boolean;
  resumeQuiz: () => boolean;
  clearSavedProgress: () => void;
}

const initialState: QuizState = {
  email: "",
  questions: [],
  questionStates: [],
  currentQuestionIndex: 0,
  timeRemaining: 30 * 60, // 30 minutes in seconds
  isCompleted: false,
  startTime: null,
  difficulty: "mix",
};

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<QuizState>(initialState);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Save progress to localStorage
  const saveProgress = useCallback((currentState: QuizState) => {
    if (currentState.questions.length > 0 && !currentState.isCompleted) {
      const progress: SavedQuizProgress = {
        email: currentState.email,
        questions: currentState.questions,
        questionStates: currentState.questionStates,
        currentQuestionIndex: currentState.currentQuestionIndex,
        timeRemaining: currentState.timeRemaining,
        startTime: currentState.startTime,
        difficulty: currentState.difficulty,
        savedAt: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  }, []);

  // Check if there's saved progress
  const hasSavedProgress = useCallback((): boolean => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return false;
      const progress: SavedQuizProgress = JSON.parse(saved);
      // Check if saved within last 24 hours and has time remaining
      const isRecent = Date.now() - progress.savedAt < 24 * 60 * 60 * 1000;
      return (
        isRecent && progress.timeRemaining > 0 && progress.questions.length > 0
      );
    } catch {
      return false;
    }
  }, []);

  // Resume from saved progress
  const resumeQuiz = useCallback((): boolean => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return false;

      const progress: SavedQuizProgress = JSON.parse(saved);

      setState({
        email: progress.email,
        questions: progress.questions,
        questionStates: progress.questionStates,
        currentQuestionIndex: progress.currentQuestionIndex,
        timeRemaining: progress.timeRemaining,
        isCompleted: false,
        startTime: Date.now(),
        difficulty: progress.difficulty,
      });

      return true;
    } catch {
      return false;
    }
  }, []);

  // Clear saved progress
  const clearSavedProgress = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const setEmail = useCallback((email: string) => {
    setState((prev) => ({ ...prev, email }));
  }, []);

  const setDifficulty = useCallback((difficulty: Difficulty) => {
    setState((prev) => ({ ...prev, difficulty }));
  }, []);

  const setQuestions = useCallback((questions: QuizQuestion[]) => {
    const questionStates: QuestionState[] = questions.map(() => ({
      visited: false,
      answered: false,
      selectedAnswer: null,
    }));
    // Mark first question as visited
    if (questionStates.length > 0) {
      questionStates[0].visited = true;
    }
    setState((prev) => ({ ...prev, questions, questionStates }));
  }, []);

  const navigateToQuestion = useCallback(
    (index: number) => {
      setState((prev) => {
        const newStates = [...prev.questionStates];
        if (newStates[index]) {
          newStates[index].visited = true;
        }
        const newState = {
          ...prev,
          currentQuestionIndex: index,
          questionStates: newStates,
        };
        saveProgress(newState);
        return newState;
      });
    },
    [saveProgress]
  );

  const selectAnswer = useCallback(
    (answer: string) => {
      setState((prev) => {
        const newStates = [...prev.questionStates];
        newStates[prev.currentQuestionIndex] = {
          ...newStates[prev.currentQuestionIndex],
          answered: true,
          selectedAnswer: answer,
        };
        const newState = { ...prev, questionStates: newStates };
        saveProgress(newState);
        return newState;
      });
    },
    [saveProgress]
  );

  const submitQuiz = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    clearSavedProgress();
    setState((prev) => ({ ...prev, isCompleted: true }));
  }, [clearSavedProgress]);

  const resetQuiz = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    clearSavedProgress();
    setState(initialState);
  }, [clearSavedProgress]);

  const startTimer = useCallback(() => {
    setState((prev) => ({ ...prev, startTime: Date.now() }));

    timerRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.timeRemaining <= 1) {
          // Auto-submit when timer reaches zero
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          localStorage.removeItem(STORAGE_KEY);
          return { ...prev, timeRemaining: 0, isCompleted: true };
        }
        const newState = { ...prev, timeRemaining: prev.timeRemaining - 1 };
        // Save progress every 10 seconds
        if (prev.timeRemaining % 10 === 0) {
          saveProgress(newState);
        }
        return newState;
      });
    }, 1000);
  }, [saveProgress]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <QuizContext.Provider
      value={{
        state,
        setEmail,
        setQuestions,
        setDifficulty,
        navigateToQuestion,
        selectAnswer,
        submitQuiz,
        resetQuiz,
        startTimer,
        hasSavedProgress,
        resumeQuiz,
        clearSavedProgress,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
};
