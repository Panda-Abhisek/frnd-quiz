import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, PartyPopper, Sparkles } from 'lucide-react';

const FeedbackOverlay = ({ isVisible, onComplete }) => {
  // Add useEffect to handle the timeout
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1.2, rotate: 0 }}
            exit={{ scale: 0.5, rotate: 10 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="bg-white text-purple-600 p-8 rounded-full shadow-2xl flex flex-col items-center justify-center gap-2"
          >
            <Sparkles size={64} className="text-yellow-400 animate-pulse" />
            <h2 className="text-4xl font-black tracking-tighter uppercase">Correct!</h2>
            <p className="text-sm font-medium text-gray-500">You know me so well!</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackOverlay;
