import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { QuestionState } from '@/types/quiz';
import { Check, Eye, Grid3X3 } from 'lucide-react';

interface QuestionNavigatorProps {
  questionStates: QuestionState[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  questionStates,
  currentIndex,
  onNavigate,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl card-shadow-lg border border-border/50 p-5"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Grid3X3 className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">
          Question Overview
        </h3>
      </div>
      
      <div className="grid grid-cols-5 gap-2">
        {questionStates.map((state, index) => {
          const isCurrent = currentIndex === index;
          const isAnswered = state.answered;
          const isVisited = state.visited;

          return (
            <motion.button
              key={index}
              onClick={() => onNavigate(index)}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative w-11 h-11 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                isCurrent
                  ? "bg-gradient-to-br from-warning to-orange-500 text-white shadow-lg shadow-warning/30 ring-2 ring-warning ring-offset-2"
                  : isAnswered
                    ? "bg-gradient-to-br from-accent to-cyan-500 text-white shadow-md"
                    : isVisited
                      ? "bg-muted-foreground/20 text-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-muted"
              )}
            >
              <span className="relative z-10">{index + 1}</span>
              
              {/* Status indicator */}
              {isAnswered && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-success text-white rounded-full flex items-center justify-center shadow-md"
                >
                  <Check className="w-3 h-3" strokeWidth={3} />
                </motion.div>
              )}
              {isVisited && !isAnswered && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-muted-foreground text-background rounded-full flex items-center justify-center"
                >
                  <Eye className="w-3 h-3" />
                </motion.div>
              )}

              {/* Current indicator pulse */}
              {isCurrent && (
                <motion.div
                  className="absolute inset-0 rounded-xl bg-warning/50"
                  animate={{ opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-6 pt-5 border-t border-border space-y-3">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-accent to-cyan-500 shadow-sm" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="w-5 h-5 rounded-md bg-muted-foreground/20" />
          <span>Visited</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-warning to-orange-500 shadow-sm" />
          <span>Current</span>
        </div>
      </div>
    </motion.div>
  );
};

export default QuestionNavigator;
