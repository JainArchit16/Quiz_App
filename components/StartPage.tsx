"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuiz } from "@/context/QuizContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ThemeToggle from "@/components/ThemeToggle";
import { useRouter } from "next/navigation";

import {
  Brain,
  Clock,
  ListChecks,
  Trophy,
  ArrowRight,
  Loader2,
  Sparkles,
  Zap,
  Target,
  RotateCcw,
  Play,
  LogOut,
} from "lucide-react";
import { QuizQuestion, Difficulty } from "@/types/quiz";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const FloatingOrb = ({
  className,
  delay = 0,
}: {
  className: string;
  delay?: number;
}) => (
  <motion.div
    className={`absolute rounded-full blur-3xl opacity-30 ${className}`}
    animate={{
      y: [0, -30, 0],
      x: [0, 15, 0],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
  />
);

const difficultyOptions: {
  value: Difficulty;
  label: string;
  description: string;
  color: string;
}[] = [
  {
    value: "easy",
    label: "Easy",
    description: "Beginner friendly",
    color: "from-green-500 to-emerald-500",
  },
  {
    value: "medium",
    label: "Medium",
    description: "Balanced challenge",
    color: "from-amber-500 to-orange-500",
  },
  {
    value: "hard",
    label: "Hard",
    description: "Expert level",
    color: "from-red-500 to-pink-500",
  },
  {
    value: "mix",
    label: "Mix",
    description: "All difficulties",
    color: "from-purple-500 to-indigo-500",
  },
];

const StartPage: React.FC = () => {
  const router = useRouter();
  const {
    setEmail,
    setQuestions,
    setDifficulty,
    startTimer,
    hasSavedProgress,
    resumeQuiz,
    clearSavedProgress,
  } = useQuiz();
  const [email, setEmailInput] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showResumeDialog, setShowResumeDialog] = useState(false);

  // Load saved email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("quiz_user_email");
    if (savedEmail) {
      setEmailInput(savedEmail);
    }
    if (hasSavedProgress()) {
      setShowResumeDialog(true);
    }
  }, [hasSavedProgress]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const fetchQuestions = async (
    difficulty: Difficulty
  ): Promise<QuizQuestion[]> => {
    const difficultyParam =
      difficulty === "mix" ? "" : `&difficulty=${difficulty}`;
    const response = await fetch(
      `https://opentdb.com/api.php?amount=15${difficultyParam}`
    );
    const data = await response.json();

    if (data.response_code !== 0) {
      throw new Error("Failed to fetch questions");
    }

    return data.results.map((q: any, index: number) => ({
      id: index + 1,
      question: q.question,
      correct_answer: q.correct_answer,
      incorrect_answers: q.incorrect_answers,
      all_answers: shuffleArray([q.correct_answer, ...q.incorrect_answers]),
      category: q.category,
      difficulty: q.difficulty,
      type: q.type,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!selectedDifficulty) {
      setError("Please select a difficulty level");
      return;
    }

    // Save email to localStorage
    localStorage.setItem("quiz_user_email", email);

    setIsLoading(true);

    try {
      const questions = await fetchQuestions(selectedDifficulty);
      setEmail(email);
      setDifficulty(selectedDifficulty);
      setQuestions(questions);
      startTimer();
      router.push("/quiz");
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load quiz questions. Please try again.",
        variant: "destructive",
      });
      setError("Failed to load quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResume = () => {
    if (resumeQuiz()) {
      startTimer();
      router.push("/quiz");
    }
    setShowResumeDialog(false);
  };

  const handleStartNew = () => {
    clearSavedProgress();
    setShowResumeDialog(false);
  };

  const features = [
    {
      icon: Clock,
      title: "30 Minutes",
      description: "Race against time to complete all questions",
      gradient: "from-orange-500 to-pink-500",
    },
    {
      icon: ListChecks,
      title: "15 Questions",
      description: "Diverse topics to test your knowledge",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Trophy,
      title: "Instant Results",
      description: "Get detailed feedback immediately",
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Theme toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Resume Quiz Dialog */}
      <AnimatePresence>
        {showResumeDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-3xl card-shadow-glow p-8 max-w-md w-full border border-border"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <RotateCcw className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Resume Quiz?
                </h3>
                <p className="text-muted-foreground">
                  We found a saved quiz in progress. Would you like to continue
                  where you left off?
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-12 rounded-xl"
                  onClick={handleStartNew}
                >
                  Start New
                </Button>
                <Button
                  className="flex-1 h-12 rounded-xl bg-gradient-to-r from-primary to-accent"
                  onClick={handleResume}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Resume
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingOrb
          className="w-[600px] h-[600px] bg-primary -top-40 -left-40"
          delay={0}
        />
        <FloatingOrb
          className="w-[500px] h-[500px] bg-accent top-1/2 -right-40"
          delay={2}
        />
        <FloatingOrb
          className="w-[400px] h-[400px] bg-warning/50 bottom-0 left-1/3"
          delay={4}
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 pattern-dots opacity-50" />
      </div>

      {/* Header */}
      <header className="relative quiz-gradient-animated text-primary-foreground py-16 md:py-24 overflow-hidden">
        {/* Floating decorative elements */}
        <motion.div
          className="absolute top-10 left-10 w-20 h-20 border border-white/20 rounded-2xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-16 h-16 border border-white/20 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-1/2 right-1/4 hidden lg:block"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles className="w-8 h-8 text-white/30" />
        </motion.div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="inline-flex items-center justify-center w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-white/10 backdrop-blur-sm mb-8 glow"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Brain className="w-12 h-12 md:w-14 md:h-14" />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
          >
            Quiz{" "}
            <span className="relative">
              Challenge
              <motion.span
                className="absolute -bottom-2 left-0 right-0 h-1 bg-white/50 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl lg:text-2xl opacity-90 max-w-2xl mx-auto leading-relaxed"
          >
            Test your knowledge across various topics with our{" "}
            <span className="font-semibold">timed quiz challenge</span>
          </motion.p>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto fill-background">
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" />
          </svg>
        </div>
      </header>

      {/* Main content */}
      <main className="relative container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          {/* Features */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <div className="relative bg-card rounded-2xl card-shadow-lg p-6 md:p-8 border border-border/50 overflow-hidden h-full">
                  {/* Background gradient on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  />

                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white mb-5 shadow-lg`}
                  >
                    <feature.icon className="w-7 h-7" />
                  </motion.div>

                  <h3 className="font-bold text-xl text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Email form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: "spring" }}
            className="relative max-w-lg mx-auto"
          >
            {/* Glow effect */}
            <div
              className={`absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-xl transition-opacity duration-500 ${
                isFocused ? "opacity-100" : "opacity-0"
              }`}
            />

            <div className="relative bg-card rounded-3xl card-shadow-glow p-8 md:p-10 border border-border/50">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="text-center mb-8"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  <Zap className="w-4 h-4" />
                  Ready to challenge yourself?
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Let's Get Started
                </h2>
                <p className="text-muted-foreground">
                  Enter your email and choose difficulty
                </p>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="email"
                      className="text-foreground font-medium"
                    >
                      Email Address
                    </Label>
                    {typeof window !== "undefined" &&
                      localStorage.getItem("quiz_user_email") &&
                      email && (
                        <motion.button
                          type="button"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          onClick={() => {
                            localStorage.removeItem("quiz_user_email");
                            setEmailInput("");
                            toast({
                              title: "Signed out",
                              description: "Your email has been cleared.",
                            });
                          }}
                          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <LogOut className="w-3 h-3" />
                          Sign out
                        </motion.button>
                      )}
                  </div>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => {
                        setEmailInput(e.target.value);
                        setError("");
                      }}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      className="h-14 text-base pl-5 rounded-xl border-2 transition-all duration-300 focus:border-primary focus:ring-4 focus:ring-primary/10"
                      disabled={isLoading}
                    />
                    {email && validateEmail(email) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-success rounded-full flex items-center justify-center"
                      >
                        <Target className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </div>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-sm text-destructive font-medium"
                    >
                      {error}
                    </motion.p>
                  )}
                </div>

                {/* Difficulty Selection */}
                <div className="space-y-3">
                  <Label className="text-foreground font-medium">
                    Select Difficulty
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {difficultyOptions.map((option) => (
                      <motion.button
                        key={option.value}
                        type="button"
                        onClick={() => setSelectedDifficulty(option.value)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          "relative p-4 rounded-xl border-2 transition-all duration-300 text-left overflow-hidden",
                          selectedDifficulty === option.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        {selectedDifficulty === option.value && (
                          <motion.div
                            layoutId="difficulty-bg"
                            className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-10`}
                            transition={{
                              type: "spring",
                              bounce: 0.2,
                              duration: 0.6,
                            }}
                          />
                        )}
                        <div className="relative z-10">
                          <div
                            className={cn(
                              "text-sm font-bold mb-1 bg-gradient-to-r bg-clip-text",
                              selectedDifficulty === option.value
                                ? `${option.color} text-transparent`
                                : "text-foreground"
                            )}
                          >
                            {option.label}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {option.description}
                          </div>
                        </div>
                        {selectedDifficulty === option.value && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                          >
                            <Target className="w-3 h-3 text-primary-foreground" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    className="w-full h-14 text-lg font-semibold rounded-xl bg-gradient-to-r from-primary via-primary to-accent hover:opacity-90 transition-all duration-300 shadow-lg shadow-primary/25"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <motion.div
                        className="flex items-center gap-3"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Loading Quiz...
                      </motion.div>
                    ) : (
                      <span className="flex items-center gap-3">
                        Start Quiz
                        <motion.span
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight className="w-5 h-5" />
                        </motion.span>
                      </span>
                    )}
                  </Button>
                </motion.div>
              </form>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-8 pt-6 border-t border-border flex items-center justify-center gap-6 text-sm text-muted-foreground"
              >
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  Secure
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                  Free
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  Instant
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default StartPage;
