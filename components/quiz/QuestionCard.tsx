import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { QuizQuestion } from '@/types/quiz';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Sparkles } from 'lucide-react';

interface QuestionCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  onSelectAnswer: (answer: string) => void;
}

const decodeHTML = (html: string): string => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
}) => {
  const answerLabels = ['A', 'B', 'C', 'D'];

  const difficultyConfig = {
    easy: { gradient: 'from-green-500 to-emerald-500', bg: 'bg-success/10', text: 'text-success', border: 'border-success/30' },
    medium: { gradient: 'from-amber-500 to-orange-500', bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/30' },
    hard: { gradient: 'from-red-500 to-pink-500', bg: 'bg-destructive/10', text: 'text-destructive', border: 'border-destructive/30' },
  };

  const difficulty = difficultyConfig[question.difficulty as keyof typeof difficultyConfig] || difficultyConfig.medium;

  return (
    <motion.div
      className="bg-card rounded-3xl card-shadow-lg border border-border/50 p-6 md:p-10 relative overflow-hidden"
      layout
    >
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-accent/5 rounded-bl-[100px]" />
      
      {/* Question header */}
      <div className="flex flex-wrap items-center gap-3 mb-8 relative">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-primary">
            Question {questionNumber} of {totalQuestions}
          </span>
        </motion.div>
        
        <Badge 
          className={cn(
            "text-xs font-semibold capitalize px-3 py-1 border",
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

      {/* Question text */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-10 leading-relaxed"
      >
        {decodeHTML(question.question)}
      </motion.h2>

      {/* Answer options */}
      <div className="space-y-4">
        {question.all_answers.map((answer, index) => {
          const isSelected = selectedAnswer === answer;
          
          return (
            <motion.button
              key={index}
              onClick={() => onSelectAnswer(answer)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.01, x: 4 }}
              whileTap={{ scale: 0.99 }}
              className={cn(
                "w-full text-left p-5 rounded-2xl border-2 transition-all duration-300",
                "hover:shadow-lg hover:border-primary/50",
                "focus:outline-none focus:ring-4 focus:ring-primary/20",
                "flex items-center gap-5 group relative overflow-hidden",
                isSelected
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                  : "border-border bg-background hover:bg-muted/50"
              )}
            >
              {/* Selection indicator background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10"
                initial={{ opacity: 0, x: '-100%' }}
                animate={isSelected ? { opacity: 1, x: 0 } : { opacity: 0, x: '-100%' }}
                transition={{ duration: 0.3 }}
              />

              {/* Answer label */}
              <motion.span
                className={cn(
                  "relative z-10 flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-300",
                  isSelected
                    ? "bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg"
                    : "bg-secondary text-secondary-foreground group-hover:bg-primary/20 group-hover:text-primary"
                )}
                animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {isSelected ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  answerLabels[index]
                )}
              </motion.span>
              
              {/* Answer text */}
              <span className={cn(
                "relative z-10 text-base md:text-lg transition-colors duration-300",
                isSelected ? "text-foreground font-medium" : "text-foreground/80"
              )}>
                {decodeHTML(answer)}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default QuestionCard;
