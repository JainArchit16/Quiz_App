"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/context/QuizContext";
import Timer from "@/components/quiz/Timer";
import QuestionNavigator from "@/components/quiz/QuestionNavigator";
import QuestionCard from "@/components/quiz/QuestionCard";
import ProgressBar from "@/components/quiz/ProgressBar";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Send, Brain, Sparkles } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const QuizPage: React.FC = () => {
  const router = useRouter();
  const { state, navigateToQuestion, selectAnswer, submitQuiz } = useQuiz();

  const {
    questions,
    questionStates,
    currentQuestionIndex,
    timeRemaining,
    isCompleted,
  } = state;

  useEffect(() => {
    if (questions.length === 0) {
      router.push("/");
    }
  }, [questions, router]);

  useEffect(() => {
    if (isCompleted) {
      router.push("/results");
    }
  }, [isCompleted, router]);

  if (questions.length === 0) {
    return null;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentState = questionStates[currentQuestionIndex];

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      navigateToQuestion(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      navigateToQuestion(currentQuestionIndex + 1);
    }
  };

  const answeredCount = questionStates.filter((s) => s.answered).length;

  return (
    <div className="min-h-screen bg-background relative">
      {/* Theme toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Subtle background pattern */}
      <div className="fixed inset-0 pattern-dots opacity-30 pointer-events-none" />

      {/* Floating accent orbs */}
      <div className="fixed top-20 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-10 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 glass-strong border-b border-border/50"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-11 h-11 rounded-xl quiz-gradient flex items-center justify-center shadow-lg shadow-primary/20">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-foreground">Quiz Challenge</h1>
                <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                  {state.email}
                </p>
              </div>
            </motion.div>
            <Timer timeRemaining={timeRemaining} />
          </div>
        </div>
      </motion.header>

      {/* Main content */}
      <main className="relative container mx-auto px-4 py-6 md:py-8">
        <div className="grid lg:grid-cols-[1fr_300px] gap-6 lg:gap-8 max-w-7xl mx-auto">
          {/* Question area */}
          <div className="space-y-6">
            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <ProgressBar
                questionStates={questionStates}
                currentIndex={currentQuestionIndex}
                totalQuestions={questions.length}
              />
            </motion.div>

            {/* Question card with AnimatePresence for smooth transitions */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
              >
                <QuestionCard
                  question={currentQuestion}
                  questionNumber={currentQuestionIndex + 1}
                  totalQuestions={questions.length}
                  selectedAnswer={currentState.selectedAnswer}
                  onSelectAnswer={selectAnswer}
                />
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-between gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="h-12 px-6 rounded-xl border-2 hover:bg-muted transition-all duration-300"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  <span className="hidden sm:inline">Previous</span>
                </Button>
              </motion.div>

              <div className="flex items-center gap-3">
                {currentQuestionIndex === questions.length - 1 ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button className="h-12 px-6 rounded-xl bg-gradient-to-r from-accent to-accent/80 hover:opacity-90 shadow-lg shadow-accent/25 transition-all duration-300">
                          <Send className="w-5 h-5 mr-2" />
                          Submit Quiz
                        </Button>
                      </motion.div>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl">
                          Submit Quiz?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-base">
                          You have answered{" "}
                          <span className="font-bold text-foreground">
                            {answeredCount}
                          </span>{" "}
                          out of{" "}
                          <span className="font-bold text-foreground">
                            {questions.length}
                          </span>{" "}
                          questions.
                          {answeredCount < questions.length && (
                            <span className="block mt-3 p-3 rounded-lg bg-warning/10 text-warning border border-warning/20">
                              ⚠️ You have {questions.length - answeredCount}{" "}
                              unanswered questions.
                            </span>
                          )}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">
                          Continue Quiz
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={submitQuiz}
                          className="rounded-xl bg-gradient-to-r from-accent to-accent/80"
                        >
                          Submit
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={handleNext}
                      className="h-12 px-6 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 shadow-lg shadow-primary/25 transition-all duration-300"
                    >
                      <span className="hidden sm:inline mr-2">Next</span>
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Question navigator */}
          <motion.aside
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:sticky lg:top-24 h-fit space-y-4"
          >
            <QuestionNavigator
              questionStates={questionStates}
              currentIndex={currentQuestionIndex}
              onNavigate={navigateToQuestion}
            />

            {/* Submit button in sidebar for desktop */}
            <div className="hidden lg:block">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full h-12 rounded-xl border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Submit Quiz
                    </Button>
                  </motion.div>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl">
                      Submit Quiz?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-base">
                      You have answered{" "}
                      <span className="font-bold text-foreground">
                        {answeredCount}
                      </span>{" "}
                      out of{" "}
                      <span className="font-bold text-foreground">
                        {questions.length}
                      </span>{" "}
                      questions.
                      {answeredCount < questions.length && (
                        <span className="block mt-3 p-3 rounded-lg bg-warning/10 text-warning border border-warning/20">
                          ⚠️ You have {questions.length - answeredCount}{" "}
                          unanswered questions.
                        </span>
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">
                      Continue Quiz
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={submitQuiz}
                      className="rounded-xl bg-gradient-to-r from-accent to-accent/80"
                    >
                      Submit
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </motion.aside>
        </div>
      </main>
    </div>
  );
};

export default QuizPage;
