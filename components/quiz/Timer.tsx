import React from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimerProps {
  timeRemaining: number;
}

const Timer: React.FC<TimerProps> = ({ timeRemaining }) => {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  
  const isLowTime = timeRemaining <= 5 * 60;
  const isCritical = timeRemaining <= 60;

  const percentage = (timeRemaining / (30 * 60)) * 100;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "relative flex items-center gap-3 px-5 py-3 rounded-2xl font-mono text-lg font-semibold transition-all duration-500",
        isCritical 
          ? "bg-destructive/15 text-destructive border-2 border-destructive/30" 
          : isLowTime 
            ? "bg-warning/15 text-warning border-2 border-warning/30"
            : "bg-primary/10 text-primary border-2 border-primary/20"
      )}
    >
      {/* Circular progress indicator */}
      <div className="relative w-10 h-10">
        <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
          <path
            className="stroke-current opacity-20"
            strokeWidth="3"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <motion.path
            className="stroke-current"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            initial={{ strokeDasharray: "100, 100" }}
            animate={{ strokeDasharray: `${percentage}, 100` }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {isCritical ? (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <AlertTriangle className="w-4 h-4" />
            </motion.div>
          ) : (
            <Clock className="w-4 h-4" />
          )}
        </div>
      </div>

      {/* Time display */}
      <motion.span
        className="min-w-[80px] text-center tabular-nums"
        animate={isCritical ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 1, repeat: isCritical ? Infinity : 0 }}
      >
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </motion.span>

      {/* Pulse effect for critical time */}
      {isCritical && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-destructive/20"
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
};

export default Timer;
