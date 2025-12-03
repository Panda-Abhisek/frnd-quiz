import React from 'react';
import { motion } from 'framer-motion';

const QuizCard = ({ question, onAnswer }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md p-8 rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl text-center"
    >
      <h2 className="text-3xl font-bold text-white mb-8 drop-shadow-md">
        {question.question}
      </h2>

      <div className="flex flex-col gap-4">
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAnswer(option)}
            className="p-4 rounded-xl bg-white/10 border border-white/10 text-white font-semibold text-lg transition-all hover:shadow-lg hover:border-white/30 active:bg-white/30"
          >
            {option}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default QuizCard;
