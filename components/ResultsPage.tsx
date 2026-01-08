"use client";

import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { motion } from "framer-motion";
import { useQuiz } from "@/context/QuizContext";
import { useConfetti } from "@/hooks/useConfetti";
import ResultCard from "@/components/quiz/ResultCard";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { QuizResult } from "@/types/quiz";
import {
  Trophy,
  Target,
  CheckCircle,
  XCircle,
  RotateCcw,
  Brain,
  TrendingUp,
  Award,
  Star,
  Sparkles,
  PartyPopper,
} from "lucide-react";

const ResultsPage: React.FC = () => {
  const router = useRouter();

  const { state, resetQuiz } = useQuiz();
  const { questions, questionStates, email, isCompleted } = state;
  const { fireConfetti, fireStars } = useConfetti();

  const results: QuizResult[] = useMemo(() => {
    return questions.map((question, index) => {
      const selectedAnswer = questionStates[index]?.selectedAnswer || null;
      return {
        question,
        selectedAnswer,
        isCorrect: selectedAnswer === question.correct_answer,
      };
    });
  }, [questions, questionStates]);

  const stats = useMemo(() => {
    const correct = results.filter((r) => r.isCorrect).length;
    const attempted = results.filter((r) => r.selectedAnswer !== null).length;
    const incorrect = attempted - correct;
    const unattempted = results.length - attempted;
    const percentage =
      results.length > 0 ? Math.round((correct / results.length) * 100) : 0;

    return { correct, incorrect, unattempted, attempted, percentage };
  }, [results]);

  // Fire confetti for high scores
  useEffect(() => {
    if (stats.percentage >= 70 && questions.length > 0) {
      // Delay to let the page render first
      const timer = setTimeout(() => {
        if (stats.percentage >= 90) {
          fireConfetti();
          setTimeout(fireStars, 500);
        } else {
          fireConfetti();
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [stats.percentage, questions.length, fireConfetti, fireStars]);

  useEffect(() => {
    if (!isCompleted && questions.length === 0) {
      router.push("/");
    }
  }, [isCompleted, questions, router.push]);

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90)
      return { text: "Outstanding!", emoji: "🎉", color: "text-success" };
    if (percentage >= 70)
      return { text: "Great job!", emoji: "👏", color: "text-accent" };
    if (percentage >= 50)
      return { text: "Good effort!", emoji: "💪", color: "text-primary" };
    if (percentage >= 30)
      return { text: "Keep practicing!", emoji: "📚", color: "text-warning" };
    return {
      text: "Don't give up!",
      emoji: "🌟",
      color: "text-muted-foreground",
    };
  };

  const handleRetake = () => {
    resetQuiz();
    router.push("/");
  };

  if (questions.length === 0) {
    return null;
  }

  const scoreMessage = getScoreMessage(stats.percentage);
  const isHighScore = stats.percentage >= 70;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Theme toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 pattern-dots opacity-30" />
      </div>

      {/* Header */}
      <header className="relative quiz-gradient-animated text-primary-foreground py-16 md:py-20 overflow-hidden">
        {/* Floating decorative elements */}
        <motion.div
          className="absolute top-10 left-10"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Star className="w-8 h-8 text-white/20" />
        </motion.div>
        <motion.div
          className="absolute top-20 right-20 hidden md:block"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Sparkles className="w-10 h-10 text-white/30" />
        </motion.div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="inline-flex items-center justify-center w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-white/15 backdrop-blur-sm mb-6"
            >
              <motion.div
                animate={
                  isHighScore
                    ? {
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1],
                      }
                    : { rotate: [0, 10, -10, 0] }
                }
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Trophy className="w-12 h-12 md:w-14 md:h-14" />
              </motion.div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-5xl font-bold mb-4"
            >
              Quiz Completed!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg opacity-90 mb-2"
            >
              {email}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/15 backdrop-blur-sm"
            >
              <motion.span
                className="text-2xl"
                animate={isHighScore ? { scale: [1, 1.3, 1] } : {}}
                transition={{
                  duration: 0.5,
                  repeat: isHighScore ? Infinity : 0,
                  repeatDelay: 1,
                }}
              >
                {scoreMessage.emoji}
              </motion.span>
              <span className="text-xl font-bold">{scoreMessage.text}</span>
            </motion.div>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto fill-background">
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" />
          </svg>
        </div>
      </header>

      {/* Score section */}
      <div className="relative container mx-auto px-4 -mt-8">
        <div className="max-w-5xl mx-auto">
          {/* Score card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="bg-card rounded-3xl card-shadow-glow p-6 md:p-10 mb-10 border border-border/50"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {/* Score percentage */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
                className="col-span-2 md:col-span-1 flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20"
              >
                <Award className="w-10 h-10 text-primary mb-3" />
                <motion.span
                  className="text-5xl md:text-6xl font-bold text-gradient"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  {stats.percentage}%
                </motion.span>
                <span className="text-sm text-muted-foreground mt-1">
                  Score
                </span>
              </motion.div>

              {/* Correct */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: "spring" }}
                className="flex flex-col items-center justify-center p-5 rounded-2xl bg-success/10 border border-success/20"
              >
                <CheckCircle className="w-8 h-8 text-success mb-2" />
                <span className="text-4xl font-bold text-success">
                  {stats.correct}
                </span>
                <span className="text-sm text-muted-foreground">Correct</span>
              </motion.div>

              {/* Incorrect */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
                className="flex flex-col items-center justify-center p-5 rounded-2xl bg-destructive/10 border border-destructive/20"
              >
                <XCircle className="w-8 h-8 text-destructive mb-2" />
                <span className="text-4xl font-bold text-destructive">
                  {stats.incorrect}
                </span>
                <span className="text-sm text-muted-foreground">Incorrect</span>
              </motion.div>

              {/* Unattempted */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.9, type: "spring" }}
                className="flex flex-col items-center justify-center p-5 rounded-2xl bg-muted border border-border"
              >
                <Target className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-4xl font-bold text-muted-foreground">
                  {stats.unattempted}
                </span>
                <span className="text-sm text-muted-foreground">Skipped</span>
              </motion.div>
            </div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-8 pt-6 border-t border-border"
            >
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Performance Breakdown
                </span>
                <span className="font-semibold text-foreground">
                  {stats.correct}/{questions.length} correct
                </span>
              </div>
              <div className="h-4 bg-secondary rounded-full overflow-hidden flex shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-success to-success/80"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(stats.correct / questions.length) * 100}%`,
                  }}
                  transition={{ delay: 1.1, duration: 0.8, ease: "easeOut" }}
                />
                <motion.div
                  className="h-full bg-gradient-to-r from-destructive to-destructive/80"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(stats.incorrect / questions.length) * 100}%`,
                  }}
                  transition={{ delay: 1.3, duration: 0.6, ease: "easeOut" }}
                />
                <motion.div
                  className="h-full bg-muted-foreground/30"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(stats.unattempted / questions.length) * 100}%`,
                  }}
                  transition={{ delay: 1.5, duration: 0.4, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Retake button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex justify-center mb-12"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleRetake}
                variant="outline"
                size="lg"
                className="h-14 px-8 rounded-xl border-2 text-base font-semibold hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
              >
                <RotateCcw className="w-5 h-5 mr-3" />
                Take Another Quiz
              </Button>
            </motion.div>
          </motion.div>

          {/* Results breakdown */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              Detailed Results
            </h2>
            <div className="space-y-5">
              {results.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.5 + index * 0.05 }}
                >
                  <ResultCard result={result} questionNumber={index + 1} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="text-center py-10 border-t border-border"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleRetake}
                className="h-14 px-10 rounded-xl bg-gradient-to-r from-primary via-primary to-accent hover:opacity-90 text-lg font-semibold shadow-lg shadow-primary/25 transition-all duration-300"
              >
                <PartyPopper className="w-5 h-5 mr-3" />
                Start New Quiz
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
