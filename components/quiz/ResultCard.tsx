import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { QuizResult } from '@/types/quiz';
import { Check, X, Minus, HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ResultCardProps {
  result: QuizResult;
  questionNumber: number;
}

const decodeHTML = (html: string): string => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

const ResultCard: React.FC<ResultCardProps> = ({ result, questionNumber }) => {
  const { question, selectedAnswer, isCorrect } = result;
  const wasAttempted = selectedAnswer !== null;

  const difficultyConfig = {
    easy: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/30' },
    medium: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/30' },
    hard: { bg: 'bg-destructive/10', text: 'text-destructive', border: 'border-destructive/30' },
  };

  const difficulty = difficultyConfig[question.difficulty as keyof typeof difficultyConfig] || difficultyConfig.medium;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        "rounded-2xl border-2 p-6 transition-all duration-300 relative overflow-hidden",
        isCorrect
          ? "border-success/40 bg-success/5"
          : wasAttempted
            ? "border-destructive/40 bg-destructive/5"
            : "border-muted-foreground/20 bg-muted/30"
      )}
    >
      {/* Status indicator strip */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1",
        isCorrect ? "bg-gradient-to-r from-success to-emerald-400" :
        wasAttempted ? "bg-gradient-to-r from-destructive to-red-400" :
        "bg-muted-foreground/30"
      )} />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-3 flex-wrap">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", delay: 0.1 }}
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md",
              isCorrect
                ? "bg-gradient-to-br from-success to-emerald-500 text-white"
                : wasAttempted
                  ? "bg-gradient-to-br from-destructive to-red-500 text-white"
                  : "bg-muted-foreground text-background"
            )}
          >
            {isCorrect ? (
              <Check className="w-5 h-5" strokeWidth={3} />
            ) : wasAttempted ? (
              <X className="w-5 h-5" strokeWidth={3} />
            ) : (
              <Minus className="w-5 h-5" strokeWidth={3} />
            )}
          </motion.div>
          
          <Badge variant="outline" className="text-sm font-semibold">
            Q{questionNumber}
          </Badge>
          
          <Badge 
            className={cn(
              "text-xs font-semibold capitalize border",
              difficulty.bg,
              difficulty.text,
              difficulty.border
            )}
          >
            {question.difficulty}
          </Badge>
          
          <Badge variant="outline" className="text-xs hidden sm:inline-flex">
            {decodeHTML(question.category)}
          </Badge>
        </div>
      </div>

      {/* Question */}
      <h3 className="text-base md:text-lg font-semibold text-foreground mb-6 leading-relaxed">
        {decodeHTML(question.question)}
      </h3>

      {/* Answers comparison */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className={cn(
            "p-4 rounded-xl border-2",
            wasAttempted
              ? isCorrect
                ? "border-success/50 bg-success/10"
                : "border-destructive/50 bg-destructive/10"
              : "border-muted-foreground/30 bg-muted/50"
          )}
        >
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Your Answer
            </span>
          </div>
          <span className={cn(
            "text-sm md:text-base block",
            !wasAttempted ? "italic text-muted-foreground" : "font-medium"
          )}>
            {wasAttempted ? decodeHTML(selectedAnswer!) : "Not attempted"}
          </span>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-xl border-2 border-success/50 bg-success/10"
        >
          <div className="flex items-center gap-2 mb-2">
            <Check className="w-4 h-4 text-success" />
            <span className="text-xs font-semibold text-success uppercase tracking-wide">
              Correct Answer
            </span>
          </div>
          <span className="text-sm md:text-base font-semibold text-success block">
            {decodeHTML(question.correct_answer)}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ResultCard;
