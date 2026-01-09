import React from 'react';
import { motion } from 'framer-motion';
import { QuestionState } from '@/types/quiz';

interface ProgressBarProps {
  questionStates: QuestionState[];
  currentIndex?: number;
  totalQuestions?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  questionStates, 
  currentIndex = 0,
  totalQuestions 
}) => {
  const answeredCount = questionStates.filter(s => s.answered).length;
  const totalCount = totalQuestions ?? questionStates.length;
  const percentage = totalCount > 0 ? (answeredCount / totalCount) * 100 : 0;

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground font-medium">
          Question {currentIndex + 1} of {totalCount}
        </span>
        <span className="font-semibold text-foreground">
          {answeredCount} of {totalCount} answered
        </span>
      </div>
      
      <div className="relative h-3 bg-secondary rounded-full overflow-hidden shadow-inner">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-accent to-success rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            repeatDelay: 3,
            ease: "easeInOut" 
          }}
        />
      </div>

      {/* Progress dots */}
      <div className="flex gap-1">
        {questionStates.map((state, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.02 }}
            className={`
              flex-1 h-1 rounded-full transition-all duration-300
              ${index === currentIndex 
                ? 'bg-primary' 
                : state.answered 
                  ? 'bg-success' 
                  : state.visited 
                    ? 'bg-muted-foreground/30' 
                    : 'bg-muted'
              }
            `}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
